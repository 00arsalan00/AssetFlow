import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/shared/Sidebar";
import { TopNavbar } from "@/components/shared/TopNavbar";
import { Toaster } from "@/components/ui/sonner";

export function MainLayout() {
  return (
    <div className="flex h-screen w-full bg-muted/40 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
