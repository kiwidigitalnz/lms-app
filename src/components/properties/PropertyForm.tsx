import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "./form/BasicInfoTab";
import { DetailsTab } from "./form/DetailsTab";
import { ComplianceTab } from "./form/ComplianceTab";
import { EnvironmentalTab } from "./form/EnvironmentalTab";
import { TechnicalTab } from "./form/TechnicalTab";
import { ContactsTab } from "./form/ContactsTab";
import { ImageUpload } from "./ImageUpload";
import { Textarea } from "@/components/ui/textarea";
import { InsuranceTab } from "./form/InsuranceTab";

const propertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Address is required"),
  property_type: z.enum(["commercial", "industrial"]),
  floor_area: z.string().optional(),
  site_area: z.string().optional(),
  number_of_floors: z.number().optional(),
  number_of_car_parks: z.number().optional(),
  building_class: z.enum(["A", "B", "C"]).optional(),
  construction_type: z.string().optional(),
  building_height: z.number().optional(),
  net_lettable_area: z.number().optional(),
  year_built: z.string().optional(),
  description: z.string().optional(),
  ownership_status: z.enum(["owned", "leased", "managed"]),
  seismic_rating: z.enum(["A/A+", "B", "C", "D", "NA"]),
  asbestos_status: z.enum(["present", "not_present", "unknown"]),
  contamination_status: z.enum(["yes", "no", "unknown"]),
  oio_sensitive: z.boolean().optional(),
  operational_consent_date: z.string().optional(),
  notes: z.string().optional(),
  landlord_contact_ids: z.array(z.string()).optional(),
  property_manager_contact_ids: z.array(z.string()).optional(),
  site_contact_ids: z.array(z.string()).optional(),
  nabersnz_rating: z.string().optional(),
  green_star_rating: z.number().min(0).max(6).optional(),
  energy_performance_rating: z.string().optional(),
  waste_management_plan: z.boolean().optional(),
  hvac_system_type: z.string().optional(),
  building_management_system: z.boolean().optional(),
  generator_backup: z.boolean().optional(),
  elevator_count: z.number().optional(),
  last_building_wof_date: z.string().optional(),
  next_building_wof_date: z.string().optional(),
  insurance_provider_contact_ids: z.array(z.string()).optional(),
  insurance_broker_contact_ids: z.array(z.string()).optional(),
  insurance_policy_number: z.string().optional(),
  insurance_coverage_amount: z.number().optional(),
  insurance_excess_amount: z.number().optional(),
  insurance_liability_amount: z.number().optional(),
  insurance_premium_amount: z.number().optional(),
  insurance_start_date: z.string().optional(),
  insurance_renewal_date: z.string().optional(),
  insurance_renewal_reminder: z.boolean().optional(),
  insurance_notes: z.string().optional(),
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
      site_area: "",
      number_of_floors: undefined,
      number_of_car_parks: undefined,
      building_class: undefined,
      construction_type: "",
      building_height: undefined,
      net_lettable_area: undefined,
      year_built: "",
      description: "",
      ownership_status: "owned",
      seismic_rating: "NA",
      asbestos_status: "unknown",
      contamination_status: "unknown",
      oio_sensitive: false,
      operational_consent_date: "",
      notes: "",
      landlord_contact_ids: [],
      property_manager_contact_ids: [],
      site_contact_ids: [],
      nabersnz_rating: "",
      green_star_rating: undefined,
      energy_performance_rating: "",
      waste_management_plan: false,
      hvac_system_type: "",
      building_management_system: false,
      generator_backup: false,
      elevator_count: undefined,
      last_building_wof_date: "",
      next_building_wof_date: "",
      insurance_provider_contact_ids: [],
      insurance_broker_contact_ids: [],
      insurance_policy_number: "",
      insurance_coverage_amount: undefined,
      insurance_excess_amount: undefined,
      insurance_liability_amount: undefined,
      insurance_premium_amount: undefined,
      insurance_start_date: "",
      insurance_renewal_date: "",
      insurance_renewal_reminder: false,
      insurance_notes: "",
    },
  });

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No user found");

      const propertyData = {
        ...data,
        tenant_id: user.id,
        name: data.name,
        address: data.address,
        property_type: data.property_type,
        floor_area: data.floor_area ? parseFloat(data.floor_area) : null,
        site_area: data.site_area ? parseFloat(data.site_area) : null,
        year_built: data.year_built ? parseInt(data.year_built) : null,
      };

      let propertyId: string;

      if (mode === "create") {
        const { data: property, error } = await supabase
          .from("properties")
          .insert(propertyData)
          .select('id')
          .single();

        if (error) throw error;
        propertyId = property.id;

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
        propertyId = initialData.id;

        toast({
          title: "Success",
          description: "Property updated successfully",
        });
      }

      // Handle property contacts
      if (data.landlord_contact_ids?.length) {
        await handlePropertyContacts(propertyId, data.landlord_contact_ids, "landlord");
      }
      if (data.property_manager_contact_ids?.length) {
        await handlePropertyContacts(propertyId, data.property_manager_contact_ids, "property_manager");
      }
      if (data.site_contact_ids?.length) {
        await handlePropertyContacts(propertyId, data.site_contact_ids, "site_contact");
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

  const handlePropertyContacts = async (propertyId: string, contactIds: string[], role: string) => {
    await supabase
      .from("property_contacts")
      .delete()
      .eq("property_id", propertyId)
      .eq("role", role);

    const contactsToInsert = contactIds.map(contactId => ({
      property_id: propertyId,
      contact_id: contactId,
      role: role
    }));

    if (contactsToInsert.length > 0) {
      const { error } = await supabase
        .from("property_contacts")
        .insert(contactsToInsert);

      if (error) throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="environmental">Environmental</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
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

          <TabsContent value="environmental" className="space-y-4 mt-4">
            <EnvironmentalTab form={form} />
          </TabsContent>

          <TabsContent value="technical" className="space-y-4 mt-4">
            <TechnicalTab form={form} />
          </TabsContent>

          <TabsContent value="insurance" className="space-y-4 mt-4">
            <InsuranceTab form={form} />
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4 mt-4">
            <ContactsTab form={form} />
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
