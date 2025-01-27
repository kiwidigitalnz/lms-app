import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormValues } from "../PropertyForm";

interface EnvironmentalTabProps {
  form: UseFormReturn<PropertyFormValues>;
}

export function EnvironmentalTab({ form }: EnvironmentalTabProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="nabersnz_rating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>NABERSNZ Rating</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="green_star_rating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Green Star Rating (0-6)</FormLabel>
            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5, 6].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {rating} Stars
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="energy_performance_rating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Energy Performance Rating</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="waste_management_plan"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Waste Management Plan</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}