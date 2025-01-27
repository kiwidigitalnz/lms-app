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
              <div className="flex items-center gap-2">
                <NotificationList />
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}