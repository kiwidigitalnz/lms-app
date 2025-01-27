import { Building, DollarSign, FileText, Users } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { LeaseList } from "@/components/dashboard/LeaseList";
import { PropertyList } from "@/components/properties/PropertyList";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { NotificationList } from "@/components/notifications/NotificationList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { data: stats } = useQuery({
    queryKey: ["lease-stats"],
    queryFn: async () => {
      const [{ data: leases }, { data: properties }] = await Promise.all([
        supabase.from("leases").select("rent_amount, payment_frequency"),
        supabase.from("properties").select("id")
      ]);

      if (!leases || !properties) return { totalLeases: 0, totalProperties: 0, monthlyExpenses: 0 };

      const totalLeases = leases.length;
      const totalProperties = properties.length;
      const monthlyExpenses = leases.reduce((acc, lease) => {
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
      }, 0);

      return {
        totalLeases,
        totalProperties,
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
              <h1 className="text-3xl font-bold">Commercial Lease Management</h1>
              <p className="text-muted-foreground">
                Manage your commercial and industrial properties and leases
              </p>
            </div>
            <div className="flex items-center gap-2">
              <NotificationList />
              <SidebarTrigger />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Properties"
              value={stats?.totalProperties.toString() || "0"}
              icon={<Building className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Active Leases"
              value={stats?.totalLeases.toString() || "0"}
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Property Owners"
              value={stats?.totalProperties.toString() || "0"}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Monthly Lease Expenses"
              value={`$${(stats?.monthlyExpenses || 0).toLocaleString()}`}
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <Tabs defaultValue="properties" className="space-y-4">
            <TabsList>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="leases">Lease Agreements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">Your Properties</h2>
                <p className="text-muted-foreground">
                  Manage your commercial and industrial properties
                </p>
              </div>
              <PropertyList />
            </TabsContent>

            <TabsContent value="leases" className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">Your Lease Agreements</h2>
                <p className="text-muted-foreground">
                  Track and manage your commercial and industrial property leases
                </p>
              </div>
              <LeaseList />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;