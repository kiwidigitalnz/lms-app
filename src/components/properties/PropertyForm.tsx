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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "./form/BasicInfoTab";
import { DetailsTab } from "./form/DetailsTab";
import { ComplianceTab } from "./form/ComplianceTab";
import { EnvironmentalTab } from "./form/EnvironmentalTab";
import { TechnicalTab } from "./form/TechnicalTab";
import { ImageUpload } from "./ImageUpload";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  landlord_contact_id: z.string().optional(),
  property_manager_contact_id: z.string().optional(),
  site_contact_id: z.string().optional(),
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

  const { data: contacts } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("first_name", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

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
      landlord_contact_id: "",
      property_manager_contact_id: "",
      site_contact_id: "",
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
    },
  });

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No user found");

      // Ensure all required fields are present and properly typed
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="environmental">Environmental</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
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

          <TabsContent value="contacts" className="space-y-4 mt-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="landlord_contact_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Landlord</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select landlord" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contacts?.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.first_name} {contact.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="property_manager_contact_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Manager</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property manager" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contacts?.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.first_name} {contact.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="site_contact_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Contact</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select site contact" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contacts?.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.first_name} {contact.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
