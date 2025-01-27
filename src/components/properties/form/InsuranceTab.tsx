import { UseFormReturn } from "react-hook-form";
import { PropertyFormValues } from "../PropertyForm";
import { PrimaryInsuranceDetails } from "./insurance/PrimaryInsuranceDetails";
import { CoverageDetails } from "./insurance/CoverageDetails";
import { DatesAndReminders } from "./insurance/DatesAndReminders";
import { InsuranceNotes } from "./insurance/InsuranceNotes";

interface InsuranceTabProps {
  form: UseFormReturn<PropertyFormValues>;
}

export function InsuranceTab({ form }: InsuranceTabProps) {
  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-20rem)] px-1">
      <PrimaryInsuranceDetails form={form} />
      <CoverageDetails form={form} />
      <DatesAndReminders form={form} />
      <InsuranceNotes form={form} />
    </div>
  );
}