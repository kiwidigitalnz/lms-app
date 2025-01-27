import { UseFormReturn } from "react-hook-form";
import { PropertyFormValues } from "../../PropertyForm";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InsuranceNotesProps {
  form: UseFormReturn<PropertyFormValues>;
}

export function InsuranceNotes({ form }: InsuranceNotesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Insurance Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="insurance_notes"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ''}
                  placeholder="Enter any specific notes about the insurance policy..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}