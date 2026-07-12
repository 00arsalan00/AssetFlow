import { Search, Menu, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/authStore";
import { mockNotifications } from "@/mock";

interface TopNavbarProps {
  onMenuClick?: () => void;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("") ?? "U";

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-card/80 backdrop-blur-md px-4 sm:px-6 lg:h-[60px]">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0 lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-4 w-4" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>

      <div className="w-full flex-1 min-w-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assets, employees..."
            className="h-9 w-full bg-muted/40 border-transparent pl-9 text-sm focus-visible:bg-background focus-visible:border-input"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          onClick={() => navigate("/notifications")}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 px-1 text-[10px] rounded-full">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-full pl-1 pr-2 py-1 ring-offset-background transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Avatar className="h-8 w-8 border border-border/60">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                {user?.name}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                <Badge variant="secondary" className="w-fit mt-1.5 text-[10px]">
                  {user?.role}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
