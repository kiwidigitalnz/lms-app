import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormValues } from "../PropertyForm";

interface TechnicalTabProps {
  form: UseFormReturn<PropertyFormValues>;
}

export function TechnicalTab({ form }: TechnicalTabProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="hvac_system_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>HVAC System Type</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="building_management_system"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Building Management System</FormLabel>
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

        <FormField
          control={form.control}
          name="generator_backup"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Generator Backup</FormLabel>
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

      <FormField
        control={form.control}
        name="elevator_count"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Elevators</FormLabel>
            <FormControl>
              <Input type="number" {...field} onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : '')} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="last_building_wof_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Building WOF Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="next_building_wof_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Next Building WOF Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}