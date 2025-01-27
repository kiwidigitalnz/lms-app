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

const rentReviewSchema = z.object({
  review_date: z.string().min(1, "Review date is required"),
  previous_amount: z.string().min(1, "Previous amount is required"),
  new_amount: z.string().min(1, "New amount is required"),
  cpi_adjustment_percentage: z.string().optional(),
  notes: z.string().optional(),
});

type RentReviewFormValues = z.infer<typeof rentReviewSchema>;

interface RentReviewFormProps {
  leaseId: string;
  currentRent: number;
  onSuccess?: () => void;
}

export function RentReviewForm({ leaseId, currentRent, onSuccess }: RentReviewFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<RentReviewFormValues>({
    resolver: zodResolver(rentReviewSchema),
    defaultValues: {
      review_date: new Date().toISOString().split('T')[0],
      previous_amount: currentRent.toString(),
      new_amount: "",
      cpi_adjustment_percentage: "",
      notes: "",
    },
  });

  const onSubmit = async (data: RentReviewFormValues) => {
    try {
      const { error } = await supabase.from("rent_reviews").insert({
        lease_id: leaseId,
        review_date: data.review_date,
        previous_amount: parseFloat(data.previous_amount),
        new_amount: parseFloat(data.new_amount),
        cpi_adjustment_percentage: data.cpi_adjustment_percentage
          ? parseFloat(data.cpi_adjustment_percentage)
          : null,
        notes: data.notes || null,
      });

      if (error) throw error;

      // Update lease with new rent amount
      const { error: leaseError } = await supabase
        .from("leases")
        .update({ rent_amount: parseFloat(data.new_amount) })
        .eq("id", leaseId);

      if (leaseError) throw leaseError;

      toast({
        title: "Success",
        description: "Rent review saved successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["leases"] });
      queryClient.invalidateQueries({ queryKey: ["rent-reviews"] });
      onSuccess?.();
    } catch (error) {
      console.error("Error saving rent review:", error);
      toast({
        title: "Error",
        description: "Failed to save rent review",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="review_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="previous_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Previous Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="new_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cpi_adjustment_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPI Adjustment (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Rent Review</Button>
      </form>
    </Form>
  );
}