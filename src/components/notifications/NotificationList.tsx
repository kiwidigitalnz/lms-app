import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Bell,
  BellOff,
  CalendarClock,
  Check,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

export function NotificationList() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lease_notifications")
        .select(`
          *,
          leases (
            property_name,
            end_date
          )
        `)
        .order("notification_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("lease_notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      
      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const getNotificationContent = (notification: any) => {
    switch (notification.notification_type) {
      case "renewal":
        return `Lease renewal coming up for ${notification.leases.property_name}. Current lease ends on ${format(
          new Date(notification.leases.end_date),
          "PP"
        )}.`;
      default:
        return "New notification";
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : notifications?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <BellOff className="h-8 w-8 mb-2" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications?.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    !notification.is_read ? "bg-muted" : ""
                  }`}
                >
                  <CalendarClock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm">{getNotificationContent(notification)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(notification.notification_date), "PP")}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}