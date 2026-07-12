import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";

// Existing pages
import { Dashboard } from "./pages/dashboard/Dashboard";
import { AssetDirectory } from "./pages/assets/AssetDirectory";
import { ResourceBooking } from "./pages/booking/ResourceBooking";
import { MaintenanceBoard } from "./pages/maintenance/MaintenanceBoard";

// New pages
import { OrganizationSetup } from "./pages/organization/OrganizationSetup";
import { AuditManagement } from "./pages/audits/AuditManagement";
import { Reports } from "./pages/reports/Reports";
import { Notifications } from "./pages/notifications/Notifications";
import { ActivityLogs } from "./pages/logs/ActivityLogs";
import { Login } from "./pages/auth/Login";

// Stub placeholders for unbuilt pages
const Settings = () => (
  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
    <span className="text-4xl">⚙️</span>
    <p className="font-semibold text-lg">Settings</p>
    <p className="text-sm">Coming soon</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/auth/login" element={<Login />} />

        {/* Protected: requires authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="organization" element={<OrganizationSetup />} />
            <Route path="assets" element={<AssetDirectory />} />
            <Route path="booking" element={<ResourceBooking />} />
            <Route path="maintenance" element={<MaintenanceBoard />} />
            <Route path="audits" element={<AuditManagement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="logs" element={<ActivityLogs />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Catch-all: redirect to login */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
