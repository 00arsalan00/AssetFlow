import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Tag, Users, Plus, MoreHorizontal, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  DataTable,
  DataTablePagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/DataTable";
import { mockEmployees, mockDepartments, mockAssetCategories } from "@/mock";
import { cn } from "@/lib/utils";

type TabType = "departments" | "categories" | "employees";

const PAGE_SIZE = 10;

function DepartmentsTab() {
  return (
    <DataTable
      toolbar={
        <div className="flex w-full items-center justify-between">
          <h3 className="font-semibold text-sm">Department Hierarchy</h3>
          <Button size="sm" className="h-8">
            <Plus className="mr-2 h-4 w-4" /> Add Department
          </Button>
        </div>
      }
    >
      <Table className="enterprise-table">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Department</TableHead>
            <TableHead>Head</TableHead>
            <TableHead className="hidden sm:table-cell">Parent</TableHead>
            <TableHead>Employees</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockDepartments.map((dept) => (
            <TableRow key={dept.id}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{dept.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm">{dept.head}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {dept.parent ?? <span className="text-muted-foreground text-xs">Root</span>}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="tabular-nums">{dept.employees}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    dept.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {dept.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataTable>
  );
}

function CategoriesTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm">Asset Categories</h3>
        <Button size="sm" className="h-8">
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockAssetCategories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="group border-border/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer">
              <CardHeader className="pb-2 flex flex-row items-center gap-3">
                <div className="text-3xl">{cat.icon}</div>
                <div className="min-w-0">
                  <CardTitle className="text-base">{cat.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-semibold text-primary tabular-nums">{cat.count}</span>
                  <span className="text-xs text-muted-foreground">Total Assets</span>
                </div>
                <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="outline" className="w-full h-8">
                    <Edit className="mr-1 h-3 w-3" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EmployeeDirectoryTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = mockEmployees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const roleColors: Record<string, string> = {
    Admin: "bg-primary/10 text-primary border-primary/20",
    "Asset Manager": "bg-blue-500/10 text-blue-700 border-blue-500/20",
    "Department Head": "bg-amber-500/10 text-amber-700 border-amber-500/20",
    Employee: "bg-muted text-muted-foreground border-border",
  };

  return (
    <DataTable
      toolbar={
        <>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-9 h-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Button size="sm" className="h-9 shrink-0">
            <Plus className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        </>
      }
      footer={
        <DataTablePagination
          page={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      }
    >
      <Table className="enterprise-table">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Employee</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-border/60">
                    <AvatarImage src={emp.avatar} alt={emp.name} />
                    <AvatarFallback className="text-xs">
                      {emp.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{emp.name}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground text-sm truncate max-w-[200px]">
                {emp.email}
              </TableCell>
              <TableCell className="text-sm">{emp.department}</TableCell>
              <TableCell>
                <Badge variant="outline" className={roleColors[emp.role]}>
                  {emp.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    emp.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {emp.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataTable>
  );
}

export function OrganizationSetup() {
  const [activeTab, setActiveTab] = useState<TabType>("departments");

  const tabs: { key: TabType; label: string; icon: typeof Building2 }[] = [
    { key: "departments", label: "Departments", icon: Building2 },
    { key: "categories", label: "Categories", icon: Tag },
    { key: "employees", label: "Employees", icon: Users },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      <PageHeader
        title="Organization Setup"
        description="Manage departments, asset categories, and your employee directory."
      />

      <div className="flex border-b border-border/60 overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 sm:px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {activeTab === "departments" && <DepartmentsTab />}
        {activeTab === "categories" && <CategoriesTab />}
        {activeTab === "employees" && <EmployeeDirectoryTab />}
      </motion.div>
    </motion.div>
  );
}
