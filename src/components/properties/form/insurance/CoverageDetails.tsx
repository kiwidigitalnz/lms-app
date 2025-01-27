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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CoverageDetailsProps {
  form: UseFormReturn<PropertyFormValues>;
}

export function CoverageDetails({ form }: CoverageDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Coverage Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
            name="insurance_excess_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excess Amount ($)</FormLabel>
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
            name="insurance_liability_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Public Liability Amount ($)</FormLabel>
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