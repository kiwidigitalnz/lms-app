import * as React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FinancialTabProps {
  form: UseFormReturn<any>;
}

export function FinancialTab({ form }: FinancialTabProps) {
  const rentReviewType = form.watch("rent_review_type");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="rent_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rent Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Frequency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="fortnightly">Fortnightly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="security_deposit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Security Deposit</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="current_annual_rental"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Annual Rental</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="rent_review_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rent Review Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select review type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="market">Market Rent Review</SelectItem>
                <SelectItem value="cpi">CPI Adjustment</SelectItem>
                <SelectItem value="fixed">Fixed Percentage</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {rentReviewType === "market" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="market_rent_review_estimate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Market Review Estimate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="market_rent_review_cap"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Market Review Cap (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="market_rent_review_collar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Market Review Collar (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {rentReviewType === "cpi" && (
        <FormField
          control={form.control}
          name="current_cpi_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current CPI Rate (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {rentReviewType === "fixed" && (
        <FormField
          control={form.control}
          name="fixed_rent_review_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fixed Review Percentage (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}