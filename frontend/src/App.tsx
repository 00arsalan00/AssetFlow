import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";

import { Dashboard } from "./pages/dashboard/Dashboard";
import { AssetDirectory } from "./pages/assets/AssetDirectory";
import { ResourceBooking } from "./pages/booking/ResourceBooking";

// Page placeholders
const DepartmentSetup = () => <div className="p-6"><h1 className="text-3xl font-bold tracking-tight">Organization Setup</h1></div>;
const MaintenanceBoard = () => <div className="p-6"><h1 className="text-3xl font-bold tracking-tight">Maintenance Board</h1></div>;
const AuditManagement = () => <div className="p-6"><h1 className="text-3xl font-bold tracking-tight">Audit Management</h1></div>;
const Login = () => <div className="flex h-screen items-center justify-center bg-card">Login Page</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="organization" element={<DepartmentSetup />} />
          <Route path="assets" element={<AssetDirectory />} />
          <Route path="booking" element={<ResourceBooking />} />
          <Route path="maintenance" element={<MaintenanceBoard />} />
          <Route path="audits" element={<AuditManagement />} />
          
          {/* Catch-all for demo */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
