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

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="landlord_contact_ids"
        render={({ field }) => {
          console.log("Landlord contacts field value:", field.value);
          return (
            <FormItem>
              <FormLabel>Landlords</FormLabel>
              <ContactSelect
                value={field.value || []}
                onChange={(value) => {
                  console.log("Landlord contacts onChange called with:", value);
                  field.onChange(value);
                  console.log("Form values after landlord update:", form.getValues());
                }}
                contactType="landlord"
                placeholder="Select landlord..."
              />
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="property_manager_contact_ids"
        render={({ field }) => {
          console.log("Property manager contacts field value:", field.value);
          return (
            <FormItem>
              <FormLabel>Property Managers</FormLabel>
              <ContactSelect
                value={field.value || []}
                onChange={(value) => {
                  console.log("Property manager contacts onChange called with:", value);
                  field.onChange(value);
                  console.log("Form values after property manager update:", form.getValues());
                }}
                contactType="property_manager"
                placeholder="Select property manager..."
              />
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="site_contact_ids"
        render={({ field }) => {
          console.log("Site contacts field value:", field.value);
          return (
            <FormItem>
              <FormLabel>Site Contacts</FormLabel>
              <ContactSelect
                value={field.value || []}
                onChange={(value) => {
                  console.log("Site contacts onChange called with:", value);
                  field.onChange(value);
                  console.log("Form values after site contact update:", form.getValues());
                }}
                placeholder="Select site contact..."
              />
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
}