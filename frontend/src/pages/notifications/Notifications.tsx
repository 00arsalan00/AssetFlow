import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Bell, Package, Wrench, CalendarCheck, ArrowRightLeft, AlertTriangle, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type NotifType = "asset" | "maintenance" | "booking" | "transfer" | "audit";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: Date;
  read: boolean;
}

const iconMap: Record<NotifType, { icon: typeof Bell; color: string; bg: string }> = {
  asset:       { icon: Package,         color: "text-blue-600",   bg: "bg-blue-100"   },
  maintenance: { icon: Wrench,          color: "text-red-600",    bg: "bg-red-100"    },
  booking:     { icon: CalendarCheck,   color: "text-green-600",  bg: "bg-green-100"  },
  transfer:    { icon: ArrowRightLeft,  color: "text-purple-600", bg: "bg-purple-100" },
  audit:       { icon: AlertTriangle,   color: "text-amber-600",  bg: "bg-amber-100"  },
};

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1",  type: "asset",       title: "Asset Assigned",          message: "MacBook Pro M3 has been assigned to you.",                        time: new Date(Date.now() - 5 * 60000),         read: false },
  { id: "2",  type: "maintenance", title: "Maintenance Approved",     message: "Your maintenance request for Projector A has been approved.",     time: new Date(Date.now() - 30 * 60000),        read: false },
  { id: "3",  type: "booking",     title: "Booking Confirmed",        message: "Conference Room B is booked for tomorrow 10AM–12PM.",             time: new Date(Date.now() - 2 * 3600000),       read: false },
  { id: "4",  type: "transfer",    title: "Transfer Approved",        message: "Asset AST-2048 transfer to HR dept has been approved.",           time: new Date(Date.now() - 4 * 3600000),       read: true  },
  { id: "5",  type: "audit",       title: "Audit Discrepancy Found",  message: "3 assets are missing from their expected locations.",             time: new Date(Date.now() - 6 * 3600000),       read: false },
  { id: "6",  type: "booking",     title: "Booking Reminder",         message: "Your booking for Design Studio starts in 30 minutes.",           time: new Date(Date.now() - 8 * 3600000),       read: true  },
  { id: "7",  type: "asset",       title: "Overdue Return",           message: "Laptop AST-1023 is overdue for return. Please submit it.",        time: new Date(Date.now() - 24 * 3600000),      read: true  },
  { id: "8",  type: "maintenance", title: "Maintenance Rejected",     message: "Request for Monitor repair rejected: Insufficient details.",      time: new Date(Date.now() - 2 * 24 * 3600000), read: true  },
  { id: "9",  type: "transfer",    title: "Transfer Request Pending", message: "You have a pending transfer request to review.",                  time: new Date(Date.now() - 3 * 24 * 3600000), read: true  },
  { id: "10", type: "asset",       title: "New Asset Available",      message: "Dell XPS 15 is now available for allocation.",                   time: new Date(Date.now() - 4 * 24 * 3600000), read: true  },
];

function timeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return format(date, "MMM dd");
}

export function Notifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayed = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const markAll = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markOne = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const grouped: Record<string, Notification[]> = {};
  displayed.forEach((n) => {
    const label = (() => {
      const mins = Math.floor((Date.now() - n.time.getTime()) / 60000);
      if (mins < 60) return "Just Now";
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return "Today";
      if (hrs < 48) return "Yesterday";
      return "Older";
    })();
    (grouped[label] ??= []).push(n);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-3xl"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-white rounded-full px-2.5">{unreadCount}</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </Button>
          <Button variant="ghost" size="sm" onClick={markAll} className="text-muted-foreground">
            <CheckCheck className="mr-1 h-4 w-4" /> Mark all read
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-6 pr-4">
          {Object.entries(grouped).map(([label, items]) => (
            <div key={label}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{label}</p>
              <div className="space-y-2">
                {items.map((notif) => {
                  const cfg = iconMap[notif.type];
                  return (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group",
                        notif.read
                          ? "bg-card hover:bg-muted/40"
                          : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                      )}
                      onClick={() => markOne(notif.id)}
                    >
                      <div className={cn("p-2.5 rounded-full shrink-0 mt-0.5", cfg.bg)}>
                        <cfg.icon className={cn("h-4 w-4", cfg.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-sm font-semibold", !notif.read && "text-primary")}>
                            {notif.title}
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{timeAgo(notif.time)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                      {notif.read && (
                        <Check className="h-4 w-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}

          {displayed.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-4 rounded-full bg-muted mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-lg">All caught up!</p>
              <p className="text-muted-foreground text-sm mt-1">You have no unread notifications.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
