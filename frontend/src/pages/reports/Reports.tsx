import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area,
} from "recharts";

const COLORS = ["#7C3AED", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const utilizationData = [
  { name: "Laptops", utilization: 87 },
  { name: "Monitors", utilization: 72 },
  { name: "Phones", utilization: 95 },
  { name: "Servers", utilization: 60 },
  { name: "Furniture", utilization: 45 },
  { name: "Vehicles", utilization: 38 },
];

const maintenanceFreqData = [
  { month: "Jan", issues: 8 },
  { month: "Feb", issues: 12 },
  { month: "Mar", issues: 6 },
  { month: "Apr", issues: 15 },
  { month: "May", issues: 9 },
  { month: "Jun", issues: 11 },
  { month: "Jul", issues: 7 },
];

const deptAllocationData = [
  { name: "Engineering", assets: 120 },
  { name: "HR", assets: 45 },
  { name: "Design", assets: 60 },
  { name: "Sales", assets: 80 },
  { name: "IT", assets: 210 },
  { name: "Marketing", assets: 35 },
];

const bookingHeatmapData = [
  { hour: "8AM", Mon: 3, Tue: 5, Wed: 8, Thu: 4, Fri: 6 },
  { hour: "10AM", Mon: 7, Tue: 9, Wed: 12, Thu: 10, Fri: 8 },
  { hour: "12PM", Mon: 5, Tue: 6, Wed: 9, Thu: 7, Fri: 4 },
  { hour: "2PM", Mon: 8, Tue: 11, Wed: 10, Thu: 9, Fri: 7 },
  { hour: "4PM", Mon: 4, Tue: 6, Wed: 7, Thu: 5, Fri: 3 },
];

const retirementForecastData = [
  { year: "2025", retiring: 12, replacing: 8 },
  { year: "2026", retiring: 18, replacing: 14 },
  { year: "2027", retiring: 25, replacing: 22 },
  { year: "2028", retiring: 15, replacing: 18 },
];

const idleAssetPieData = [
  { name: "In Use", value: 220 },
  { name: "Idle > 30 days", value: 45 },
  { name: "Idle > 90 days", value: 18 },
  { name: "Unassigned", value: 17 },
];

function ExportButton() {
  return (
    <Button variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" /> Export
    </Button>
  );
}

export function Reports() {
  const tooltipStyle = { borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground mt-1">Deep insights across assets, maintenance, and bookings.</p>
        </div>
        <Button><Download className="mr-2 h-4 w-4" /> Export All Reports</Button>
      </div>

      {/* Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Asset Utilization */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Asset Utilization</CardTitle>
              <CardDescription>% of assets actively used by category</CardDescription>
            </div>
            <ExportButton />
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={utilizationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" domain={[0, 100]} unit="%" axisLine={false} tickLine={false} fontSize={11} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} fontSize={11} width={70} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Utilization"]} />
                  <Bar dataKey="utilization" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Frequency */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Maintenance Frequency</CardTitle>
              <CardDescription>Monthly reported issues trend</CardDescription>
            </div>
            <ExportButton />
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={maintenanceFreqData}>
                  <defs>
                    <linearGradient id="maintenanceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={11} />
                  <YAxis axisLine={false} tickLine={false} fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="issues" stroke="#ef4444" strokeWidth={2.5} fill="url(#maintenanceGrad)" dot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Department Allocations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Department Allocations</CardTitle>
              <CardDescription>Assets assigned per department</CardDescription>
            </div>
            <ExportButton />
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptAllocationData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} />
                  <YAxis axisLine={false} tickLine={false} fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="assets" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Idle Assets Pie */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Idle Assets Breakdown</CardTitle>
              <CardDescription>Distribution of unused assets</CardDescription>
            </div>
            <ExportButton />
          </CardHeader>
          <CardContent>
            <div className="h-60 flex items-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie data={idleAssetPieData} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="value" paddingAngle={3}>
                    {idleAssetPieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2 pl-2">
                {idleAssetPieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-muted-foreground truncate">{d.name}</span>
                    <span className="ml-auto text-xs font-semibold">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Booking Heatmap */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Booking Peak Hours</CardTitle>
              <CardDescription>Number of bookings per hour / day</CardDescription>
            </div>
            <ExportButton />
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingHeatmapData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} fontSize={11} />
                  <YAxis axisLine={false} tickLine={false} fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
                    <Bar key={day} dataKey={day} fill={COLORS[i]} radius={[2, 2, 0, 0]} stackId="a" />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Retirement Forecast */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Retirement Forecast</CardTitle>
              <CardDescription>Projected asset retirements vs. replacements</CardDescription>
            </div>
            <ExportButton />
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={retirementForecastData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} fontSize={11} />
                  <YAxis axisLine={false} tickLine={false} fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="retiring" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} name="Retiring" />
                  <Line type="monotone" dataKey="replacing" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} name="Replacing" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
