import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus } from "lucide-react";

const leaseSchema = z.object({
  title: z.string().optional(),
  property_name: z.string().min(1, "Property name is required"),
  lease_type: z.enum(["commercial", "residential", "industrial"]),
  lease_purpose: z.string().optional(),
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
  
  // Parse initial rights of renewal data if it exists
  const initialRightsOfRenewal = initialData?.rights_of_renewal ? 
    JSON.parse(initialData.rights_of_renewal) : 
    { number_of_rights: '', years_per_right: '', total_years: '' };

  // Parse initial future rent review dates if they exist
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
      lease_type: "commercial",
      lease_purpose: "",
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
        lease_purpose: data.lease_purpose,
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

  // Function to add a new review date
  const addReviewDate = () => {
    const currentDates = form.getValues('future_rent_review_dates') || [];
    form.setValue('future_rent_review_dates', [...currentDates, '']);
  };

  // Function to remove a review date
  const removeReviewDate = (index: number) => {
    const currentDates = form.getValues('future_rent_review_dates') || [];
    form.setValue('future_rent_review_dates', 
      currentDates.filter((_, i) => i !== index)
    );
  };

  // Calculate total years when either number of rights or years per right changes
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name?.startsWith('rights_of_renewal.')) {
        const rights = form.getValues('rights_of_renewal');
        if (rights.number_of_rights && rights.years_per_right) {
          const total = Number(rights.number_of_rights) * Number(rights.years_per_right);
          form.setValue('rights_of_renewal.total_years', String(total));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

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

          <TabsContent value="basic" className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lease Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="property_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Name/Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lease_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lease_purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lease Purpose</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="dates" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
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
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="fortnightly">Fortnightly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </FormControl>
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
              name="capitalised_improvements_rent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capitalised Improvements Rent</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fixed_rent_review_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fixed Rent Review Percentage (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="current_cpi_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current CPI Percentage (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
          </TabsContent>

          <TabsContent value="additional" className="space-y-4">
            <FormField
              control={form.control}
              name="rent_review_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rent Review Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rent_review_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rent Review Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="division"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="business_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Unit</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="general_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>General Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <Button type="submit" className="w-full">
          {mode === "create" ? "Add Lease Agreement" : "Update Lease Agreement"}
        </Button>
      </form>
    </Form>
  );
}
