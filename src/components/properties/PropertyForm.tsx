import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "./form/BasicInfoTab";
import { DetailsTab } from "./form/DetailsTab";
import { ComplianceTab } from "./form/ComplianceTab";
import { ImageUpload } from "./ImageUpload";
import { Textarea } from "@/components/ui/textarea";

const propertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Address is required"),
  property_type: z.enum(["commercial", "industrial"]),
  floor_area: z.string().optional(),
  year_built: z.string().optional(),
  description: z.string().optional(),
  ownership_status: z.enum(["owned", "leased", "managed"]),
  insurance_status: z.string().optional(),
  insurance_expiry_date: z.string().optional(),
  seismic_rating: z.string().optional(),
  asbestos_status: z.enum(["present", "not_present", "unknown"]),
  contamination_status: z.enum(["yes", "no", "unknown"]),
  oio_sensitive: z.boolean().optional(),
  operational_consent_date: z.string().optional(),
  notes: z.string().optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 mt-4">
            <BasicInfoTab form={form} />
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <DetailsTab form={form} />
          </TabsContent>
          
          <TabsContent value="compliance" className="space-y-4 mt-4">
            <ComplianceTab form={form} />
          </TabsContent>
        </Tabs>

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

        <Button type="submit" className="w-full">
          {mode === "create" ? "Add Property" : "Update Property"}
        </Button>
      </form>
    </Form>
  );
}