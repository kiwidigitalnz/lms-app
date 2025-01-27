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
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="landlord_contact_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Landlord</FormLabel>
            <ContactSelect
              value={field.value}
              onChange={field.onChange}
              contactType="landlord"
              placeholder="Select landlord..."
            />
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
            <ContactSelect
              value={field.value}
              onChange={field.onChange}
              contactType="property_manager"
              placeholder="Select property manager..."
            />
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
            <ContactSelect
              value={field.value}
              onChange={field.onChange}
              placeholder="Select site contact..."
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}