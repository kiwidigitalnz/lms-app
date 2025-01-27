import { UseFormReturn } from "react-hook-form";
import { PropertyFormValues } from "../../PropertyForm";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ContactSelect } from "@/components/contacts/ContactSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PrimaryInsuranceDetailsProps {
  form: UseFormReturn<PropertyFormValues>;
}

export function PrimaryInsuranceDetails({ form }: PrimaryInsuranceDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Primary Insurance Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="insurance_provider_contact_ids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance Provider</FormLabel>
                <ContactSelect
                  value={field.value || []}
                  onChange={field.onChange}
                  contactType="supplier"
                  placeholder="Select insurance provider..."
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="insurance_broker_contact_ids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance Broker</FormLabel>
                <ContactSelect
                  value={field.value || []}
                  onChange={field.onChange}
                  contactType="supplier"
                  placeholder="Select insurance broker..."
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="insurance_policy_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Policy Number</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="insurance_premium_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Premium Amount ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    {...field}
                    value={field.value || ''}
                    onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}