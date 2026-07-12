import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Tag, Users, Plus, MoreHorizontal, Search, Edit, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockEmployees as initialEmployees } from "@/mock";

// --- Mock Initial state ---
const INITIAL_DEPARTMENTS = [
  { id: "1", name: "Engineering", head: "Alice Johnson", employees: 34, parent: null, status: "Active" },
  { id: "2", name: "Human Resources", head: "Bob Smith", employees: 12, parent: null, status: "Active" },
  { id: "3", name: "Design", head: "Carol White", employees: 8, parent: null, status: "Active" },
  { id: "4", name: "Sales", head: "David Brown", employees: 22, parent: null, status: "Active" },
  { id: "5", name: "IT Infrastructure", head: "Eva Green", employees: 15, parent: "Engineering", status: "Active" },
  { id: "6", name: "Quality Assurance", head: "Frank Miller", employees: 9, parent: "Engineering", status: "Inactive" },
];

const INITIAL_CATEGORIES = [
  { id: "1", name: "Laptops", icon: "💻", count: 120, description: "Portable computing devices" },
  { id: "2", name: "Monitors", icon: "🖥️", count: 95, description: "Display units for workstations" },
  { id: "3", name: "Mobile Phones", icon: "📱", count: 60, description: "Corporate mobile devices" },
  { id: "4", name: "Servers", icon: "🗄️", count: 18, description: "Data center hardware" },
  { id: "5", name: "Furniture", icon: "🪑", count: 200, description: "Office furniture and fixtures" },
  { id: "6", name: "Vehicles", icon: "🚗", count: 12, description: "Company fleet vehicles" },
];

type TabType = "departments" | "categories" | "employees";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function DialogModal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md bg-background border rounded-xl shadow-lg overflow-hidden pb-4"
          >
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-bold text-foreground">{title}</h3>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// --- Sub-components ---
interface DeptTabProps {
  departments: typeof INITIAL_DEPARTMENTS;
  onAdd: (newDept: any) => void;
}

function DepartmentsTab({ departments, onAdd }: DeptTabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [head, setHead] = useState("");
  const [parent, setParent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !head) return;
    onAdd({
      id: String(departments.length + 1),
      name,
      head,
      employees: 0,
      parent: parent || null,
      status: "Active",
    });
    setName("");
    setHead("");
    setParent("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Department Hierarchy</h3>
        <Button size="sm" onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />Add Department
        </Button>
      </div>

      <DialogModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Department">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Department Name</label>
            <Input placeholder="e.g. Finance, Marketing" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Department Head</label>
            <Input placeholder="e.g. John Doe" value={head} onChange={(e) => setHead(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Reporting Parent Department (Optional)</label>
            <Input placeholder="e.g. Engineering" value={parent} onChange={(e) => setParent(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Create Department</Button>
          </div>
        </form>
      </DialogModal>

      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Head</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <div className="p-1.5 rounded bg-primary/10">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  {dept.name}
                </TableCell>
                <TableCell>{dept.head}</TableCell>
                <TableCell>{dept.parent ?? <span className="text-muted-foreground text-xs">Root</span>}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{dept.employees}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={dept.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                    {dept.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface CategoriesTabProps {
  categories: typeof INITIAL_CATEGORIES;
  onAdd: (newCat: any) => void;
}

function CategoriesTab({ categories, onAdd }: CategoriesTabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📦");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAdd({
      id: String(categories.length + 1),
      name,
      icon,
      count: 0,
      description,
    });
    setName("");
    setIcon("📦");
    setDescription("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Asset Categories</h3>
        <Button size="sm" onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />Add Category
        </Button>
      </div>

      <DialogModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Asset Category">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Category Name</label>
            <Input placeholder="e.g. Printers, Network Switches" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Icon (Emoji)</label>
            <Input placeholder="e.g. 🖨️, 🔌" value={icon} onChange={(e) => setIcon(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description</label>
            <Input placeholder="Short description..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Create Category</Button>
          </div>
        </form>
      </DialogModal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <div className="text-3xl">{cat.icon}</div>
              <div>
                <CardTitle className="text-base">{cat.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{cat.description}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">{cat.count}</span>
                <span className="text-xs text-muted-foreground">Total Assets</span>
              </div>
              <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="outline" className="w-full"><Edit className="mr-1 h-3 w-3" />Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface EmpTabProps {
  employees: typeof initialEmployees;
  onAdd: (newEmp: any) => void;
}

function EmployeeDirectoryTab({ employees, onAdd }: DeptTabProps & any) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [role, setRole] = useState("Employee");

  const filtered = employees.filter(
    (e: any) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 15);

  const roleColors: Record<string, string> = {
    Admin: "bg-purple-100 text-purple-800",
    "Asset Manager": "bg-blue-100 text-blue-800",
    "Department Head": "bg-amber-100 text-amber-800",
    Employee: "bg-gray-100 text-gray-700",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    onAdd({
      id: String(employees.length + 1),
      name,
      email,
      department,
      role,
      status: "Active",
      avatar: `https://i.pravatar.cc/150?u=${email}`,
    });
    setName("");
    setEmail("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-lg font-semibold">Employee Directory</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-8 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button size="sm" onClick={() => setIsOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />Add Employee
          </Button>
        </div>
      </div>

      <DialogModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Employee to Directory">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Employee Name</label>
            <Input placeholder="e.g. Jane Miller" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email Address</label>
            <Input type="email" placeholder="e.g. jane@assertflow.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full h-10 px-3 border rounded-lg bg-background text-sm"
            >
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Design">Design</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">System Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-10 px-3 border rounded-lg bg-background text-sm"
            >
              <option value="Employee">Employee</option>
              <option value="Department Head">Department Head</option>
              <option value="Asset Manager">Asset Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Add User</Button>
          </div>
        </form>
      </DialogModal>

      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((emp: any) => (
              <TableRow key={emp.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={emp.avatar} alt={emp.name} />
                      <AvatarFallback>{emp.name.split(" ").map((n: any) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{emp.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{emp.email}</TableCell>
                <TableCell>{emp.department}</TableCell>
                <TableCell>
                  <Badge className={roleColors[emp.role] ?? "bg-gray-100"} variant="outline">
                    {emp.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={emp.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                    {emp.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// --- Main Page ---
export function OrganizationSetup() {
  const [activeTab, setActiveTab] = useState<TabType>("departments");
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [employees, setEmployees] = useState(initialEmployees);

  const tabs: { key: TabType; label: string; icon: typeof Building2 }[] = [
    { key: "departments", label: "Departments", icon: Building2 },
    { key: "categories", label: "Asset Categories", icon: Tag },
    { key: "employees", label: "Employee Directory", icon: Users },
  ];

  const handleAddDept = (newDept: any) => setDepartments(prev => [...prev, newDept]);
  const handleAddCat = (newCat: any) => setCategories(prev => [...prev, newCat]);
  const handleAddEmp = (newEmp: any) => setEmployees(prev => [...prev, newEmp]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Organization Setup</h2>
        <p className="text-muted-foreground mt-1">Manage departments, asset categories, and your employee directory.</p>
      </div>

      {/* Tab Bar */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {activeTab === "departments" && (
          <DepartmentsTab departments={departments} onAdd={handleAddDept} />
        )}
        {activeTab === "categories" && (
          <CategoriesTab categories={categories} onAdd={handleAddCat} />
        )}
        {activeTab === "employees" && (
          <EmployeeDirectoryTab employees={employees} onAdd={handleAddEmp} />
        )}
      </motion.div>
    </motion.div>
  );
}

