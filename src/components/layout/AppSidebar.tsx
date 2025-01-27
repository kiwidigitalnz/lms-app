import { Home, Building, FileText, Bell, Settings, LogOut, ChevronLeft } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Properties", icon: Building, url: "/properties" },
  { title: "Leases", icon: FileText, url: "/leases" },
  { title: "Notifications", icon: Bell, url: "/notifications" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

export function AppSidebar() {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="relative">
          <SidebarTrigger className="absolute right-2 top-2 z-50" />
          <SidebarGroup>
            <SidebarGroupLabel>Property Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
      <SidebarFooter className="p-2 flex flex-col gap-2">
        <SidebarMenuButton 
          onClick={signOut} 
          className="flex items-center gap-3 w-full text-left"
          tooltip="Sign Out"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}