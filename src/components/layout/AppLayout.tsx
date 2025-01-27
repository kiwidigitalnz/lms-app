import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { NotificationList } from "@/components/notifications/NotificationList";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AppLayout({ children, title, description }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <AppSidebar />
        <div className="flex-1 transition-all duration-300 md:ml-[3.5rem] group-data-[state=expanded]:md:ml-64">
          <main className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">{title}</h1>
                {description && (
                  <p className="text-muted-foreground">{description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <NotificationList />
              </div>
            </div>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}