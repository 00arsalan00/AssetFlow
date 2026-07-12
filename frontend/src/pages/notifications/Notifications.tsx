import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { mockNotifications, formatTimeAgo, type NotifType } from "@/mock";
import { cn } from "@/lib/utils";
import { Package, Wrench, CalendarCheck, ArrowRightLeft, AlertTriangle } from "lucide-react";

const iconMap: Record<NotifType, { icon: typeof Bell; color: string; bg: string }> = {
  asset: { icon: Package, color: "text-blue-600", bg: "bg-blue-500/10" },
  maintenance: { icon: Wrench, color: "text-red-600", bg: "bg-red-500/10" },
  booking: { icon: CalendarCheck, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  transfer: { icon: ArrowRightLeft, color: "text-primary", bg: "bg-primary/10" },
  audit: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-500/10" },
};

export function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayed = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const markAll = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markOne = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const grouped: Record<string, typeof displayed> = {};
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container max-w-3xl">
      <PageHeader
        title="Notifications"
        description="Stay updated on asset assignments, maintenance, bookings, and audits."
        badge={
          unreadCount > 0 ? (
            <Badge className="rounded-full px-2.5 tabular-nums">{unreadCount} new</Badge>
          ) : undefined
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All
            </Button>
            <Button variant={filter === "unread" ? "default" : "outline"} size="sm" onClick={() => setFilter("unread")}>
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </Button>
            <Button variant="ghost" size="sm" onClick={markAll} className="text-muted-foreground">
              <CheckCheck className="mr-1 h-4 w-4" /> Mark all read
            </Button>
          </div>
        }
      />

      <ScrollArea className="h-[calc(100vh-220px)] sm:h-[calc(100vh-200px)]">
        {displayed.length === 0 ? (
          <EmptyState
            variant="notifications"
            title="All caught up!"
            description="You have no unread notifications. We'll let you know when something needs your attention."
          />
        ) : (
          <div className="space-y-6 pr-2 sm:pr-4">
            {Object.entries(grouped).map(([label, items]) => (
              <div key={label}>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  {label}
                </p>
                <div className="space-y-2">
                  {items.map((notif, i) => {
                    const cfg = iconMap[notif.type];
                    return (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={cn(
                          "flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer group",
                          notif.read
                            ? "bg-card border-border/60 hover:bg-muted/40"
                            : "bg-primary/[0.03] border-primary/15 hover:bg-primary/[0.06]"
                        )}
                        onClick={() => markOne(notif.id)}
                      >
                        <div className={cn("p-2.5 rounded-xl shrink-0", cfg.bg)}>
                          <cfg.icon className={cn("h-4 w-4", cfg.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn("text-sm font-semibold", !notif.read && "text-primary")}>
                              {notif.title}
                            </p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                              {formatTimeAgo(notif.time)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                        </div>
                        {!notif.read ? (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                        ) : (
                          <Check className="h-4 w-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
}
