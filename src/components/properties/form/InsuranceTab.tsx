import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormValues } from "../PropertyForm";
import { ContactSelect } from "@/components/contacts/ContactSelect";

interface InsuranceTabProps {
  form: UseFormReturn<PropertyFormValues>;
}

export function InsuranceTab({ form }: InsuranceTabProps) {
  return (
    <div className="space-y-4">
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
        name="insurance_coverage_amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Coverage Amount ($)</FormLabel>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="insurance_start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insurance Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="insurance_renewal_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insurance Renewal Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}