import * as React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface DatesTabProps {
  form: UseFormReturn<any>;
}

export function DatesTab({ form }: DatesTabProps) {
  const addReviewDate = () => {
    const currentDates = form.getValues('future_rent_review_dates') || [];
    form.setValue('future_rent_review_dates', [...currentDates, '']);
  };

  const removeReviewDate = (index: number) => {
    const currentDates = form.getValues('future_rent_review_dates') || [];
    form.setValue('future_rent_review_dates', 
      currentDates.filter((_, i) => i !== index)
    );
  };

  // Function to calculate total years
  const calculateTotalYears = React.useCallback(() => {
    const rights = form.getValues('rights_of_renewal');
    if (rights.number_of_rights && rights.years_per_right) {
      const total = Number(rights.number_of_rights) * Number(rights.years_per_right);
      form.setValue('rights_of_renewal.total_years', String(total), {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
  }, [form]);

  // Watch for changes in number_of_rights and years_per_right
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (
        name === 'rights_of_renewal.number_of_rights' ||
        name === 'rights_of_renewal.years_per_right'
      ) {
        calculateTotalYears();
      }
    });

    return () => subscription.unsubscribe();
  }, [form, calculateTotalYears]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="final_expiry_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Final Expiry Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lease_renewal_notice_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lease Renewal Notice Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="rights_of_renewal.number_of_rights"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Rights</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rights_of_renewal.years_per_right"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years per Right</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rights_of_renewal.total_years"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Years</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Future Rent Review Dates</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addReviewDate}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Date
          </Button>
        </div>
        
        {form.watch('future_rent_review_dates')?.map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <FormField
              control={form.control}
              name={`future_rent_review_dates.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeReviewDate(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}