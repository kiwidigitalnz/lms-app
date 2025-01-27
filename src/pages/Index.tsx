import { Building, DollarSign, FileText, Users } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { LeaseList } from "@/components/dashboard/LeaseList";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: stats } = useQuery({
    queryKey: ["lease-stats"],
    queryFn: async () => {
      const { data: leases, error } = await supabase
        .from("leases")
        .select("rent_amount, payment_frequency");

      if (error) throw error;

      const totalLeases = leases?.length || 0;
      const monthlyExpenses = leases?.reduce((acc, lease) => {
        let monthlyAmount = lease.rent_amount;
        switch (lease.payment_frequency) {
          case "weekly":
            monthlyAmount *= 4;
            break;
          case "fortnightly":
            monthlyAmount *= 2;
            break;
          case "quarterly":
            monthlyAmount /= 3;
            break;
          case "annually":
            monthlyAmount /= 12;
            break;
        }
        return acc + monthlyAmount;
      }, 0) || 0;

      return {
        totalLeases,
        monthlyExpenses,
      };
    },
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Rentals</h1>
              <p className="text-muted-foreground">
                Manage your rental agreements and payments
              </p>
            </div>
            <SidebarTrigger />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="My Properties"
              value={stats?.totalLeases.toString() || "0"}
              icon={<Building className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Active Rentals"
              value={stats?.totalLeases.toString() || "0"}
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Landlords"
              value={stats?.totalLeases.toString() || "0"}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Monthly Rent"
              value={`$${(stats?.monthlyExpenses || 0).toLocaleString()}`}
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Your Rental Agreements</h2>
              <p className="text-muted-foreground">
                Track and manage your rental properties
              </p>
            </div>
            <LeaseList />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;