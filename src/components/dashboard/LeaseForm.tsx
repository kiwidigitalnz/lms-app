import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const leaseSchema = z.object({
  property_name: z.string().min(1, "Property name is required"),
  lease_type: z.enum(["commercial", "residential", "industrial"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  rent_amount: z.string().min(1, "Rent amount is required"),
  payment_frequency: z.enum([
    "weekly",
    "fortnightly",
    "monthly",
    "quarterly",
    "annually",
  ]),
  security_deposit: z.string().optional(),
});

type LeaseFormValues = z.infer<typeof leaseSchema>;

interface LeaseFormProps {
  onSuccess?: () => void;
  initialData?: any;
  mode?: "create" | "edit";
}

export function LeaseForm({ onSuccess, initialData, mode = "create" }: LeaseFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LeaseFormValues>({
    resolver: zodResolver(leaseSchema),
    defaultValues: initialData || {
      property_name: "",
      lease_type: "residential",
      start_date: "",
      end_date: "",
      rent_amount: "",
      payment_frequency: "monthly",
      security_deposit: "",
    },
  });

  const onSubmit = async (data: LeaseFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No user found");

      if (mode === "create") {
        const { error } = await supabase.from("leases").insert({
          ...data,
          tenant_id: user.id,
          rent_amount: parseFloat(data.rent_amount),
          security_deposit: data.security_deposit
            ? parseFloat(data.security_deposit)
            : null,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Lease created successfully",
        });
      } else {
        const { error } = await supabase
          .from("leases")
          .update({
            ...data,
            rent_amount: parseFloat(data.rent_amount),
            security_deposit: data.security_deposit
              ? parseFloat(data.security_deposit)
              : null,
          })
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Lease updated successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["leases"] });
      onSuccess?.();
    } catch (error) {
      console.error("Error saving lease:", error);
      toast({
        title: "Error",
        description: "Failed to save lease",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="property_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lease_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lease Type</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="rent_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rent Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment_frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Frequency</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="fortnightly">Fortnightly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="security_deposit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Security Deposit (Optional)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {mode === "create" ? "Create Lease" : "Update Lease"}
        </Button>
      </form>
    </Form>
  );
}