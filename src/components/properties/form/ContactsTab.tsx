import { UseFormReturn } from "react-hook-form";
import { PropertyFormValues } from "../PropertyForm";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ContactSelect } from "@/components/contacts/ContactSelect";

interface ContactsTabProps {
  form: UseFormReturn<PropertyFormValues>;
}

export function ContactsTab({ form }: ContactsTabProps) {
  console.log("ContactsTab rendered with form values:", form.getValues());

  const handleContactChange = (
    fieldName: keyof Pick<PropertyFormValues, 'landlord_contact_ids' | 'property_manager_contact_ids' | 'site_contact_ids'>, 
    value: string[]
  ) => {
    console.log(`${fieldName} changing to:`, value);
    form.setValue(fieldName, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
    console.log(`Form values after ${fieldName} update:`, form.getValues());
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="landlord_contact_ids"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Landlords</FormLabel>
            <ContactSelect
              value={field.value || []}
              onChange={(value) => {
                console.log("Landlord contacts onChange called with:", value);
                handleContactChange("landlord_contact_ids", value);
              }}
              contactType="landlord"
              placeholder="Select landlord..."
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="property_manager_contact_ids"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Managers</FormLabel>
            <ContactSelect
              value={field.value || []}
              onChange={(value) => {
                console.log("Property manager contacts onChange called with:", value);
                handleContactChange("property_manager_contact_ids", value);
              }}
              contactType="property_manager"
              placeholder="Select property manager..."
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="site_contact_ids"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Site Contacts</FormLabel>
            <ContactSelect
              value={field.value || []}
              onChange={(value) => {
                console.log("Site contacts onChange called with:", value);
                handleContactChange("site_contact_ids", value);
              }}
              placeholder="Select site contact..."
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}