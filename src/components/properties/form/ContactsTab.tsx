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
            <div className="space-y-2">
              {(field.value || []).map((contactId: string) => (
                <ContactSelect
                  key={contactId}
                  value={contactId}
                  onChange={(newValue) => {
                    const values = field.value || [];
                    const index = values.indexOf(contactId);
                    if (index !== -1) {
                      const newValues = [...values];
                      newValues[index] = newValue;
                      field.onChange(newValues);
                    }
                  }}
                  contactType="landlord"
                  placeholder="Select landlord..."
                />
              ))}
              <ContactSelect
                value=""
                onChange={handleContactChange('landlord_contact_ids')}
                contactType="landlord"
                placeholder="Add landlord..."
              />
            </div>
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
            <div className="space-y-2">
              {(field.value || []).map((contactId: string) => (
                <ContactSelect
                  key={contactId}
                  value={contactId}
                  onChange={(newValue) => {
                    const values = field.value || [];
                    const index = values.indexOf(contactId);
                    if (index !== -1) {
                      const newValues = [...values];
                      newValues[index] = newValue;
                      field.onChange(newValues);
                    }
                  }}
                  contactType="property_manager"
                  placeholder="Select property manager..."
                />
              ))}
              <ContactSelect
                value=""
                onChange={handleContactChange('property_manager_contact_ids')}
                contactType="property_manager"
                placeholder="Add property manager..."
              />
            </div>
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
            <div className="space-y-2">
              {(field.value || []).map((contactId: string) => (
                <ContactSelect
                  key={contactId}
                  value={contactId}
                  onChange={(newValue) => {
                    const values = field.value || [];
                    const index = values.indexOf(contactId);
                    if (index !== -1) {
                      const newValues = [...values];
                      newValues[index] = newValue;
                      field.onChange(newValues);
                    }
                  }}
                  placeholder="Select site contact..."
                />
              ))}
              <ContactSelect
                value=""
                onChange={handleContactChange('site_contact_ids')}
                placeholder="Add site contact..."
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}