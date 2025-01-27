import { Home, Building, FileText, Bell, Settings, LogOut } from "lucide-react";
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
  useSidebar,
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
  const { state } = useSidebar();

  return (
    <Sidebar className="h-screen">
      <SidebarContent>
        <div className="relative h-full">
          <div className="absolute right-0 top-0 p-2 z-50">
            <SidebarTrigger />
          </div>
          <SidebarGroup className="mt-12">
            <SidebarGroupLabel className={state === "collapsed" ? "hidden" : ""}>
              Property Management
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.url}
                      tooltip={state === "collapsed" ? item.title : undefined}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className={state === "collapsed" ? "hidden" : ""}>{item.title}</span>
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
          tooltip={state === "collapsed" ? "Sign Out" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className={state === "collapsed" ? "hidden" : ""}>Sign Out</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}