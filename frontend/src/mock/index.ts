import { faker } from "@faker-js/faker";

// You would need to run `npm install @faker-js/faker` to use this, but for a hackathon it's perfect.
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

// Seed for consistency
faker.seed(123);

const DEPARTMENTS = ["Engineering", "HR", "Design", "Sales", "Marketing", "IT"];
const CATEGORIES = ["Laptops", "Monitors", "Phones", "Servers", "Furniture", "Vehicles"];

export const mockEmployees: Employee[] = Array.from({ length: 100 }).map(() => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  department: faker.helpers.arrayElement(DEPARTMENTS),
  role: faker.helpers.arrayElement(["Admin", "Asset Manager", "Department Head", "Employee"]),
  status: faker.helpers.arrayElement(["Active", "Active", "Active", "Inactive"]),
  avatar: faker.image.avatar(),
}));

export const mockAssets: Asset[] = Array.from({ length: 300 }).map(() => ({
  id: faker.string.uuid(),
  tag: `AST-${faker.number.int({ min: 1000, max: 9999 })}`,
  name: faker.commerce.productName(),
  category: faker.helpers.arrayElement(CATEGORIES),
  serialNumber: faker.string.alphanumeric(10).toUpperCase(),
  acquisitionDate: faker.date.past({ years: 3 }).toISOString(),
  cost: parseFloat(faker.commerce.price({ min: 100, max: 5000 })),
  condition: faker.helpers.arrayElement(["New", "Good", "Good", "Fair", "Poor"]),
  status: faker.helpers.arrayElement(["Available", "Allocated", "Allocated", "Under Maintenance"]),
  location: faker.location.buildingNumber(),
  assigneeId: faker.helpers.maybe(() => faker.helpers.arrayElement(mockEmployees).id, { probability: 0.6 }),
  isShared: faker.datatype.boolean({ probability: 0.2 }),
}));

export const mockBookings: Booking[] = Array.from({ length: 50 }).map(() => ({
  id: faker.string.uuid(),
  assetId: faker.helpers.arrayElement(mockAssets.filter(a => a.isShared)).id || faker.string.uuid(),
  employeeId: faker.helpers.arrayElement(mockEmployees).id,
  startDate: faker.date.recent().toISOString(),
  endDate: faker.date.soon().toISOString(),
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
