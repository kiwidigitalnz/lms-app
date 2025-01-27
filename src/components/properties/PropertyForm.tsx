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

const propertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Address is required"),
  property_type: z.enum(["commercial", "industrial"]),
  floor_area: z.string().optional(),
  year_built: z.string().optional(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  onSuccess?: () => void;
  initialData?: any;
  mode?: "create" | "edit";
}

export function PropertyForm({ onSuccess, initialData, mode = "create" }: PropertyFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData || {
      name: "",
      address: "",
      property_type: "commercial",
      floor_area: "",
      year_built: "",
    },
  });

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No user found");

      const propertyData = {
        name: data.name,
        address: data.address,
        property_type: data.property_type,
        floor_area: data.floor_area ? parseFloat(data.floor_area) : null,
        year_built: data.year_built ? parseInt(data.year_built) : null,
        tenant_id: user.id,
      };

      if (mode === "create") {
        const { error } = await supabase
          .from("properties")
          .insert(propertyData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Property added successfully",
        });
      } else {
        const { error } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Property updated successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["properties"] });
      onSuccess?.();
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="property_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Type</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
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
            name="floor_area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floor Area (sq ft)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year_built"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year Built</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">
          {mode === "create" ? "Add Property" : "Update Property"}
        </Button>
      </form>
    </Form>
  );
}