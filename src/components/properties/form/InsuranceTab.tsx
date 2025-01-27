import { UseFormReturn } from "react-hook-form";
import { PropertyFormValues } from "../PropertyForm";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactSelect } from "@/components/contacts/ContactSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface InsuranceTabProps {
  form: UseFormReturn<PropertyFormValues>;
}

export function InsuranceTab({ form }: InsuranceTabProps) {
  return (
    <div className="space-y-6">
      {/* Primary Insurance Details */}
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

      {/* Coverage Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Coverage Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

      {/* Dates and Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Dates & Reminders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="insurance_start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
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
                  <FormLabel>Renewal Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="insurance_renewal_reminder"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Renewal Reminders</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Receive notifications before insurance renewal
                  </div>
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
        </CardContent>
      </Card>

      {/* Insurance Notes */}
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
    </div>
  );
}