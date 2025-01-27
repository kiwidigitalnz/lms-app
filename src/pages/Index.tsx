import { Building, DollarSign, FileText, Users, Calendar, ListTodo, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { AppLayout } from "@/components/layout/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <AppLayout 
      title="Dashboard" 
      description="Welcome to your property management dashboard"
    >
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No upcoming events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No pending tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent updates</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Index;