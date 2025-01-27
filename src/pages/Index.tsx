import { Building, DollarSign, FileText, Users } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome to your property management dashboard</p>
            </div>
            <SidebarTrigger />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Properties"
              value="12"
              icon={<Building className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Active Leases"
              value="8"
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Total Tenants"
              value="15"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Monthly Revenue"
              value="$45,231"
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;