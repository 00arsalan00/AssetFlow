import { faker } from "@faker-js/faker";
import { format } from "date-fns";

export type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: "Admin" | "Asset Manager" | "Department Head" | "Employee";
  status: "Active" | "Inactive";
  avatar: string;
};

export type Asset = {
  id: string;
  tag: string;
  name: string;
  category: string;
  serialNumber: string;
  acquisitionDate: string;
  cost: number;
  condition: "New" | "Good" | "Fair" | "Poor";
  status: "Available" | "Allocated" | "Reserved" | "Under Maintenance" | "Retired";
  location: string;
  departmentId?: string;
  assigneeId?: string;
  isShared: boolean;
};

export type Booking = {
  id: string;
  assetId: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
};

export type Maintenance = {
  id: string;
  assetId: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Pending" | "Approved" | "In Progress" | "Resolved";
  assignee?: string;
  dateLogged: string;
};

export type Audit = {
  id: string;
  name: string;
  dateStarted: string;
  status: "Planned" | "Ongoing" | "Completed";
  auditorId: string;
  discrepanciesCount: number;
};

export type Department = {
  id: string;
  name: string;
  head: string;
  employees: number;
  parent: string | null;
  status: "Active" | "Inactive";
};

export type AssetCategory = {
  id: string;
  name: string;
  icon: string;
  count: number;
  description: string;
};

export type NotifType = "asset" | "maintenance" | "booking" | "transfer" | "audit";

export type Notification = {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: Date;
  read: boolean;
};

export type ActivityLog = {
  id: string;
  user: string;
  role: string;
  action: "Create" | "Update" | "Delete" | "Allocate" | "Transfer" | "Login" | "Approve";
  entity: string;
  entityId: string;
  timestamp: Date;
  ip: string;
  status: "Success" | "Failed";
};

faker.seed(123);

export const DEPARTMENTS_LIST = ["Engineering", "HR", "Design", "Sales", "Marketing", "IT"];
export const CATEGORIES = ["Laptops", "Monitors", "Phones", "Servers", "Furniture", "Vehicles"];

const SHARED_ASSET_NAMES = [
  "Conference Room Alpha",
  "Design Studio",
  "Boardroom Executive",
  "Training Room B",
  "Company Van #3",
  "Projector Suite",
  "Meeting Pod 7",
  "Innovation Lab",
];

export const mockEmployees: Employee[] = Array.from({ length: 100 }).map(() => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  department: faker.helpers.arrayElement(DEPARTMENTS_LIST),
  role: faker.helpers.arrayElement(["Admin", "Asset Manager", "Department Head", "Employee"]),
  status: faker.helpers.arrayElement(["Active", "Active", "Active", "Inactive"]),
  avatar: faker.image.avatar(),
}));

export const mockAssets: Asset[] = Array.from({ length: 300 }).map((_, i) => {
  const isShared = i < 40 || faker.datatype.boolean({ probability: 0.15 });
  return {
    id: faker.string.uuid(),
    tag: `AST-${faker.number.int({ min: 1000, max: 9999 })}`,
    name: isShared
      ? faker.helpers.arrayElement(SHARED_ASSET_NAMES)
      : faker.commerce.productName(),
    category: faker.helpers.arrayElement(CATEGORIES),
    serialNumber: faker.string.alphanumeric(10).toUpperCase(),
    acquisitionDate: faker.date.past({ years: 3 }).toISOString(),
    cost: parseFloat(faker.commerce.price({ min: 100, max: 5000 })),
    condition: faker.helpers.arrayElement(["New", "Good", "Good", "Fair", "Poor"]),
    status: faker.helpers.arrayElement([
      "Available",
      "Allocated",
      "Allocated",
      "Under Maintenance",
      "Reserved",
    ]),
    location: `Floor ${faker.number.int({ min: 1, max: 5 })}, ${faker.location.buildingNumber()}`,
    assigneeId: faker.helpers.maybe(() => faker.helpers.arrayElement(mockEmployees).id, {
      probability: 0.6,
    }),
    isShared,
  };
});

const sharedAssets = mockAssets.filter((a) => a.isShared);

export const mockBookings: Booking[] = Array.from({ length: 50 }).map(() => ({
  id: faker.string.uuid(),
  assetId: faker.helpers.arrayElement(sharedAssets).id,
  employeeId: faker.helpers.arrayElement(mockEmployees).id,
  startDate: faker.date.recent({ days: 3 }).toISOString(),
  endDate: faker.date.soon({ days: 5 }).toISOString(),
  status: faker.helpers.arrayElement(["Upcoming", "Ongoing", "Completed", "Cancelled"]),
}));

export const mockMaintenance: Maintenance[] = Array.from({ length: 100 }).map(() => ({
  id: faker.string.uuid(),
  assetId: faker.helpers.arrayElement(mockAssets).id,
  description: faker.lorem.sentence(),
  priority: faker.helpers.arrayElement(["Low", "Medium", "High", "Critical"]),
  status: faker.helpers.arrayElement(["Pending", "Approved", "In Progress", "Resolved"]),
  dateLogged: faker.date.recent({ days: 30 }).toISOString(),
  assignee: faker.person.fullName(),
}));

export const mockAudits: Audit[] = Array.from({ length: 20 }).map(() => ({
  id: faker.string.uuid(),
  name: `Audit Q${faker.helpers.arrayElement([1, 2, 3, 4])} 2026`,
  dateStarted: faker.date.recent({ days: 60 }).toISOString(),
  status: faker.helpers.arrayElement(["Planned", "Ongoing", "Completed"]),
  auditorId: faker.helpers.arrayElement(mockEmployees).id,
  discrepanciesCount: faker.number.int({ min: 0, max: 5 }),
}));

export const mockDepartments: Department[] = [
  { id: "1", name: "Engineering", head: "Alice Johnson", employees: 34, parent: null, status: "Active" },
  { id: "2", name: "Human Resources", head: "Bob Smith", employees: 12, parent: null, status: "Active" },
  { id: "3", name: "Design", head: "Carol White", employees: 8, parent: null, status: "Active" },
  { id: "4", name: "Sales", head: "David Brown", employees: 22, parent: null, status: "Active" },
  { id: "5", name: "IT Infrastructure", head: "Eva Green", employees: 15, parent: "Engineering", status: "Active" },
  { id: "6", name: "Quality Assurance", head: "Frank Miller", employees: 9, parent: "Engineering", status: "Inactive" },
  { id: "7", name: "Marketing", head: "Grace Lee", employees: 18, parent: null, status: "Active" },
  { id: "8", name: "Finance", head: "Henry Park", employees: 11, parent: null, status: "Active" },
];

export const mockAssetCategories: AssetCategory[] = [
  { id: "1", name: "Laptops", icon: "💻", count: 120, description: "Portable computing devices" },
  { id: "2", name: "Monitors", icon: "🖥️", count: 95, description: "Display units for workstations" },
  { id: "3", name: "Mobile Phones", icon: "📱", count: 60, description: "Corporate mobile devices" },
  { id: "4", name: "Servers", icon: "🗄️", count: 18, description: "Data center hardware" },
  { id: "5", name: "Furniture", icon: "🪑", count: 200, description: "Office furniture and fixtures" },
  { id: "6", name: "Vehicles", icon: "🚗", count: 12, description: "Company fleet vehicles" },
];

export const mockNotifications: Notification[] = [
  { id: "1", type: "asset", title: "Asset Assigned", message: "MacBook Pro M3 has been assigned to you.", time: new Date(Date.now() - 5 * 60000), read: false },
  { id: "2", type: "maintenance", title: "Maintenance Approved", message: "Your maintenance request for Projector A has been approved.", time: new Date(Date.now() - 30 * 60000), read: false },
  { id: "3", type: "booking", title: "Booking Confirmed", message: "Conference Room B is booked for tomorrow 10AM–12PM.", time: new Date(Date.now() - 2 * 3600000), read: false },
  { id: "4", type: "transfer", title: "Transfer Approved", message: "Asset AST-2048 transfer to HR dept has been approved.", time: new Date(Date.now() - 4 * 3600000), read: true },
  { id: "5", type: "audit", title: "Audit Discrepancy Found", message: "3 assets are missing from their expected locations.", time: new Date(Date.now() - 6 * 3600000), read: false },
  { id: "6", type: "booking", title: "Booking Reminder", message: "Your booking for Design Studio starts in 30 minutes.", time: new Date(Date.now() - 8 * 3600000), read: true },
  { id: "7", type: "asset", title: "Overdue Return", message: "Laptop AST-1023 is overdue for return. Please submit it.", time: new Date(Date.now() - 24 * 3600000), read: true },
  { id: "8", type: "maintenance", title: "Maintenance Rejected", message: "Request for Monitor repair rejected: Insufficient details.", time: new Date(Date.now() - 2 * 24 * 3600000), read: true },
  { id: "9", type: "transfer", title: "Transfer Request Pending", message: "You have a pending transfer request to review.", time: new Date(Date.now() - 3 * 24 * 3600000), read: true },
  { id: "10", type: "asset", title: "New Asset Available", message: "Dell XPS 15 is now available for allocation.", time: new Date(Date.now() - 4 * 24 * 3600000), read: true },
  { id: "11", type: "audit", title: "Audit Cycle Started", message: "Q2 2026 audit cycle has begun. Review your assigned zone.", time: new Date(Date.now() - 5 * 24 * 3600000), read: false },
  { id: "12", type: "booking", title: "Booking Cancelled", message: "Meeting room reservation for Friday was cancelled.", time: new Date(Date.now() - 6 * 24 * 3600000), read: true },
];

const ACTIONS: ActivityLog["action"][] = ["Create", "Update", "Delete", "Allocate", "Transfer", "Login", "Approve"];
const ENTITIES = ["Asset", "Employee", "Department", "Booking", "Audit", "Maintenance"];
const IPS = ["192.168.1.10", "192.168.1.22", "10.0.0.5", "172.16.0.8", "192.168.2.45"];

export const mockActivityLogs: ActivityLog[] = Array.from({ length: 50 }, (_, i) => {
  const emp = mockEmployees[i % mockEmployees.length];
  return {
    id: String(i + 1),
    user: emp.name,
    role: emp.role,
    action: ACTIONS[i % ACTIONS.length],
    entity: ENTITIES[i % ENTITIES.length],
    entityId: `AST-${1000 + i}`,
    timestamp: new Date(Date.now() - i * 3600000 * 2),
    ip: IPS[i % IPS.length],
    status: i % 7 === 0 ? "Failed" : "Success",
  };
});

export const dashboardStats = {
  availableAssets: mockAssets.filter((a) => a.status === "Available").length,
  allocatedAssets: mockAssets.filter((a) => a.status === "Allocated").length,
  maintenanceCount: mockMaintenance.filter(
    (m) => m.status === "Pending" || m.status === "In Progress"
  ).length,
  activeBookings: mockBookings.filter((b) => b.status === "Ongoing").length,
};

export const departmentAllocationData = DEPARTMENTS_LIST.map((name) => ({
  name,
  assets: mockAssets.filter(
    (a) =>
      mockEmployees.find((e) => e.id === a.assigneeId)?.department === name
  ).length || faker.number.int({ min: 20, max: 80 }),
}));

export const recentActivity = [
  { icon: "Package" as const, text: "New MacBook Pro M3 registered by Admin", time: "2 hours ago", color: "text-blue-600" },
  { icon: "ArrowRightLeft" as const, text: "Asset AST-1042 transferred to HR Dept", time: "4 hours ago", color: "text-primary" },
  { icon: "Wrench" as const, text: "Maintenance request raised for Projector A", time: "Yesterday", color: "text-red-600" },
  { icon: "CalendarCheck" as const, text: "Conference Room B booked by John Doe", time: "Yesterday", color: "text-emerald-600" },
  { icon: "ClipboardCheck" as const, text: "Q2 audit cycle started — 12 zones assigned", time: "2 days ago", color: "text-amber-600" },
];

export function formatTimeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return format(date, "MMM dd");
}
