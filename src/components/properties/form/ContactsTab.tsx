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
  const handleContactChange = (fieldName: string) => (value: string) => {
    const currentValue = form.getValues(fieldName as any) || [];
    if (!currentValue.includes(value)) {
      form.setValue(fieldName as any, [...currentValue, value]);
    }
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
              value=""
              onChange={handleContactChange('landlord_contact_ids')}
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
              value=""
              onChange={handleContactChange('property_manager_contact_ids')}
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
              value=""
              onChange={handleContactChange('site_contact_ids')}
              placeholder="Select site contact..."
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}