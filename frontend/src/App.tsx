import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { AssetDirectory } from "./pages/assets/AssetDirectory";
import { ResourceBooking } from "./pages/booking/ResourceBooking";
import { MaintenanceBoard } from "./pages/maintenance/MaintenanceBoard";
import { OrganizationSetup } from "./pages/organization/OrganizationSetup";
import { AuditManagement } from "./pages/audits/AuditManagement";
import { Reports } from "./pages/reports/Reports";
import { Notifications } from "./pages/notifications/Notifications";
import { ActivityLogs } from "./pages/logs/ActivityLogs";
import { Settings } from "./pages/settings/Settings";
import { Login } from "./pages/auth/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />

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

        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
