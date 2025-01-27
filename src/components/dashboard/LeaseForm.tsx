import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "./lease-form/BasicInfoTab";
import { DatesTab } from "./lease-form/DatesTab";
import { FinancialTab } from "./lease-form/FinancialTab";
import { AdditionalInfoTab } from "./lease-form/AdditionalInfoTab";

const leaseSchema = z.object({
  title: z.string().optional(),
  property_name: z.string().min(1, "Property name is required"),
  lease_type: z.string().min(1, "Lease type is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  final_expiry_date: z.string().optional(),
  lease_renewal_notice_date: z.string().optional(),
  rights_of_renewal: z.object({
    number_of_rights: z.string().optional(),
    years_per_right: z.string().optional(),
    total_years: z.string().optional(),
  }).optional(),
  rent_amount: z.string().min(1, "Rent amount is required"),
  payment_frequency: z.enum([
    "weekly",
    "fortnightly",
    "monthly",
    "quarterly",
    "annually",
  ]),
  security_deposit: z.string().optional(),
  next_rent_review_date: z.string().optional(),
  future_rent_review_dates: z.array(z.string()).optional(),
  rent_review_type: z.string().optional(),
  rent_review_notes: z.string().optional(),
  current_annual_rental: z.string().optional(),
  capitalised_improvements_rent: z.string().optional(),
  fixed_rent_review_percentage: z.string().optional(),
  market_rent_review_estimate: z.string().optional(),
  market_rent_review_cap: z.string().optional(),
  market_rent_review_collar: z.string().optional(),
  current_cpi_percentage: z.string().optional(),
  division: z.string().optional(),
  business_unit: z.string().optional(),
  general_notes: z.string().optional(),
});

type LeaseFormValues = z.infer<typeof leaseSchema>;

interface LeaseFormProps {
  onSuccess?: () => void;
  initialData?: any;
  mode?: "create" | "edit";
}

export function LeaseForm({ onSuccess, initialData, mode = "create" }: LeaseFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const initialRightsOfRenewal = initialData?.rights_of_renewal ? 
    JSON.parse(initialData.rights_of_renewal) : 
    { number_of_rights: '', years_per_right: '', total_years: '' };

  const initialReviewDates = initialData?.future_rent_review_dates ? 
    JSON.parse(initialData.future_rent_review_dates) : 
    [];

  const form = useForm<LeaseFormValues>({
    resolver: zodResolver(leaseSchema),
    defaultValues: initialData ? {
      ...initialData,
      rights_of_renewal: initialRightsOfRenewal,
      future_rent_review_dates: initialReviewDates,
    } : {
      title: "",
      property_name: "",
      lease_type: "",
      start_date: "",
      end_date: "",
      final_expiry_date: "",
      lease_renewal_notice_date: "",
      rights_of_renewal: {
        number_of_rights: '',
        years_per_right: '',
        total_years: '',
      },
      rent_amount: "",
      payment_frequency: "monthly",
      security_deposit: "",
      next_rent_review_date: "",
      future_rent_review_dates: [],
      rent_review_type: "",
      rent_review_notes: "",
      current_annual_rental: "",
      capitalised_improvements_rent: "",
      fixed_rent_review_percentage: "",
      market_rent_review_estimate: "",
      market_rent_review_cap: "",
      market_rent_review_collar: "",
      current_cpi_percentage: "",
      division: "",
      business_unit: "",
      general_notes: "",
    },
  });

  const onSubmit = async (data: LeaseFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No user found");

      const leaseData = {
        title: data.title,
        property_name: data.property_name,
        lease_type: data.lease_type,
        start_date: data.start_date,
        end_date: data.end_date,
        final_expiry_date: data.final_expiry_date || null,
        lease_renewal_notice_date: data.lease_renewal_notice_date || null,
        rights_of_renewal: JSON.stringify(data.rights_of_renewal),
        rent_amount: parseFloat(data.rent_amount),
        payment_frequency: data.payment_frequency,
        security_deposit: data.security_deposit ? parseFloat(data.security_deposit) : null,
        next_rent_review_date: data.next_rent_review_date || null,
        future_rent_review_dates: JSON.stringify(data.future_rent_review_dates),
        rent_review_type: data.rent_review_type,
        rent_review_notes: data.rent_review_notes,
        current_annual_rental: data.current_annual_rental ? parseFloat(data.current_annual_rental) : null,
        capitalised_improvements_rent: data.capitalised_improvements_rent ? parseFloat(data.capitalised_improvements_rent) : null,
        fixed_rent_review_percentage: data.fixed_rent_review_percentage ? parseFloat(data.fixed_rent_review_percentage) : null,
        market_rent_review_estimate: data.market_rent_review_estimate ? parseFloat(data.market_rent_review_estimate) : null,
        market_rent_review_cap: data.market_rent_review_cap ? parseFloat(data.market_rent_review_cap) : null,
        market_rent_review_collar: data.market_rent_review_collar ? parseFloat(data.market_rent_review_collar) : null,
        current_cpi_percentage: data.current_cpi_percentage ? parseFloat(data.current_cpi_percentage) : null,
        division: data.division,
        business_unit: data.business_unit,
        general_notes: data.general_notes,
        tenant_id: user.id,
      };

      if (mode === "create") {
        const { error } = await supabase
          .from("leases")
          .insert(leaseData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Lease agreement saved successfully",
        });
      } else {
        const { error } = await supabase
          .from("leases")
          .update(leaseData)
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Lease agreement updated successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["leases"] });
      onSuccess?.();
    } catch (error) {
      console.error("Error saving lease:", error);
      toast({
        title: "Error",
        description: "Failed to save lease agreement",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="dates">Dates</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="additional">Additional Info</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicInfoTab form={form} />
          </TabsContent>

          <TabsContent value="dates">
            <DatesTab form={form} />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialTab form={form} />
          </TabsContent>

          <TabsContent value="additional">
            <AdditionalInfoTab form={form} />
          </TabsContent>
        </Tabs>

        <Button type="submit" className="w-full">
          {mode === "create" ? "Add Lease Agreement" : "Update Lease Agreement"}
        </Button>
      </form>
    </Form>
  );
}