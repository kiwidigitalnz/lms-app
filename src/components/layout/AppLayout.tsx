import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { NotificationList } from "@/components/notifications/NotificationList";
import { UserMenu } from "@/components/user/UserMenu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AppLayout({ children, title, description }: AppLayoutProps) {
  const { user } = useAuth();
  
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const displayName = profile
    ? `${profile.first_name}${profile.last_name ? ` ${profile.last_name}` : ''}`
    : '';

  return (
    <SidebarProvider>
      <div className="grid grid-cols-[auto,1fr] min-h-screen">
        <AppSidebar />
        <main className="w-full">
          <div className="container mx-auto p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">{title}</h1>
                {description && (
                  <p className="text-muted-foreground">{description}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:inline-block">
                  {displayName}
                </span>
                <div className="flex items-center gap-2">
                  <UserMenu />
                  <NotificationList />
                </div>
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}