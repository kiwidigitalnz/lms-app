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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "./ImageUpload";

const propertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Address is required"),
  property_type: z.enum(["commercial", "industrial"]),
  floor_area: z.string().optional(),
  year_built: z.string().optional(),
  description: z.string().optional(),
  ownership_status: z.enum(["owned", "leased", "managed"]).optional(),
  insurance_status: z.string().optional(),
  insurance_expiry_date: z.string().optional(),
  seismic_rating: z.string().optional(),
  asbestos_status: z.enum(["present", "not_present", "unknown"]).optional(),
  contamination_status: z.enum(["yes", "no", "unknown"]).optional(),
  oio_sensitive: z.boolean().optional(),
  operational_consent_date: z.string().optional(),
  notes: z.string().optional(),
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
      description: "",
      ownership_status: "owned",
      insurance_status: "",
      insurance_expiry_date: "",
      seismic_rating: "",
      asbestos_status: "unknown",
      contamination_status: "unknown",
      oio_sensitive: false,
      operational_consent_date: "",
      notes: "",
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
        description: data.description,
        ownership_status: data.ownership_status,
        insurance_status: data.insurance_status,
        insurance_expiry_date: data.insurance_expiry_date,
        seismic_rating: data.seismic_rating,
        asbestos_status: data.asbestos_status,
        contamination_status: data.contamination_status,
        oio_sensitive: data.oio_sensitive,
        operational_consent_date: data.operational_consent_date,
        notes: data.notes,
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          <FormField
            control={form.control}
            name="ownership_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ownership Status</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="owned">Owned</option>
                    <option value="leased">Leased</option>
                    <option value="managed">Managed</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="insurance_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance Status</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="insurance_expiry_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance Expiry Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="seismic_rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seismic Rating</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="asbestos_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asbestos Status</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="present">Present</option>
                    <option value="not_present">Not Present</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contamination_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contamination Status</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="oio_sensitive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>OIO Sensitive</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="operational_consent_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operational Consent Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === "edit" && initialData?.id && (
          <ImageUpload 
            propertyId={initialData.id} 
            onSuccess={() => queryClient.invalidateQueries({ queryKey: ["properties"] })}
          />
        )}

        <Button type="submit">
          {mode === "create" ? "Add Property" : "Update Property"}
        </Button>
      </form>
    </Form>
  );
}