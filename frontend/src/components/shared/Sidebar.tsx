import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  Package, 
  CalendarCheck, 
  Wrench, 
  ClipboardCheck,
  BarChart3,
  Bell,
  Activity,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Building2, label: "Organization Setup", href: "/organization" },
  { icon: Package, label: "Asset Management", href: "/assets" },
  { icon: CalendarCheck, label: "Resource Booking", href: "/booking" },
  { icon: Wrench, label: "Maintenance", href: "/maintenance" },
  { icon: ClipboardCheck, label: "Audit Management", href: "/audits" },
  { icon: BarChart3, label: "Reports & Analytics", href: "/reports" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Activity, label: "Activity Logs", href: "/logs" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-card border-r shadow-sm">
      <div className="flex h-14 items-center border-b px-6">
        <div className="flex items-center gap-2 font-bold text-primary text-xl tracking-tight">
          <Package className="h-6 w-6" />
          AssetFlow
        </div>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                  isActive ? "bg-muted text-primary" : "text-muted-foreground hover:bg-muted/50"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
