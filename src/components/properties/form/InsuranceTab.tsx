import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormValues } from "../PropertyForm";
import { Textarea } from "@/components/ui/textarea";

interface InsuranceTabProps {
  form: UseFormReturn<PropertyFormValues>;
}

export function InsuranceTab({ form }: InsuranceTabProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="insurance_provider"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Insurance Provider</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
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

      <FormField
        control={form.control}
        name="insurance_notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Insurance Notes</FormLabel>
            <FormControl>
              <Textarea {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}