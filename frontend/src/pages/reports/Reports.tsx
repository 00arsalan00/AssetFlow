import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area,
} from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { ChartCard } from "@/components/shared/ChartCard";
import { CHART_COLORS, chartTooltipStyle, chartGridStroke, chartAxisTick } from "@/lib/chart-theme";
import { staggerContainer } from "@/lib/motion";

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
    <Button variant="outline" size="sm" className="h-8 text-xs">
      <Download className="mr-1.5 h-3.5 w-3.5" /> Export
    </Button>
  );
}

export function Reports() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-container"
    >
      <PageHeader
        title="Reports & Analytics"
        description="Deep insights across assets, maintenance, bookings, and lifecycle forecasting."
        actions={
          <Button variant="outline" className="shadow-sm">
            <Download className="mr-2 h-4 w-4" /> Export All
          </Button>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2"
      >
        <ChartCard title="Asset Utilization" description="% actively used by category" action={<ExportButton />}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={utilizationData} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={chartGridStroke} />
              <XAxis type="number" domain={[0, 100]} unit="%" axisLine={false} tickLine={false} tick={chartAxisTick} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={chartAxisTick} width={72} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [`${v}%`, "Utilization"]} />
              <Bar dataKey="utilization" fill={CHART_COLORS[0]} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Maintenance Frequency" description="Monthly reported issues" action={<ExportButton />}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={maintenanceFreqData}>
              <defs>
                <linearGradient id="maintenanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[4]} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={CHART_COLORS[4]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridStroke} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={chartAxisTick} />
              <YAxis axisLine={false} tickLine={false} tick={chartAxisTick} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area type="monotone" dataKey="issues" stroke={CHART_COLORS[4]} strokeWidth={2.5} fill="url(#maintenanceGrad)" dot={{ r: 3, fill: CHART_COLORS[4], strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department Allocations" description="Assets per department" action={<ExportButton />}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptAllocationData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridStroke} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={chartAxisTick} />
              <YAxis axisLine={false} tickLine={false} tick={chartAxisTick} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="assets" fill={CHART_COLORS[1]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Idle Assets Breakdown" description="Distribution of unused assets" action={<ExportButton />} height="h-[280px]">
          <div className="flex flex-col sm:flex-row items-center h-full gap-4">
            <ResponsiveContainer width="100%" height={200} className="sm:!w-1/2 sm:!h-full">
              <PieChart>
                <Pie data={idleAssetPieData} cx="50%" cy="50%" outerRadius={75} innerRadius={42} dataKey="value" paddingAngle={3} strokeWidth={0}>
                  {idleAssetPieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 w-full space-y-2.5">
              {idleAssetPieData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="text-xs text-muted-foreground truncate flex-1">{d.name}</span>
                  <span className="text-xs font-semibold tabular-nums">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Booking Peak Hours" description="Bookings per hour / day" action={<ExportButton />}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bookingHeatmapData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridStroke} />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={chartAxisTick} />
              <YAxis axisLine={false} tickLine={false} tick={chartAxisTick} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
                <Bar key={day} dataKey={day} fill={CHART_COLORS[i]} radius={[2, 2, 0, 0]} stackId="a" />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Retirement Forecast" description="Retirements vs. replacements" action={<ExportButton />}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={retirementForecastData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridStroke} />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={chartAxisTick} />
              <YAxis axisLine={false} tickLine={false} tick={chartAxisTick} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="retiring" stroke={CHART_COLORS[4]} strokeWidth={2.5} dot={{ r: 4, fill: CHART_COLORS[4], strokeWidth: 0 }} name="Retiring" />
              <Line type="monotone" dataKey="replacing" stroke={CHART_COLORS[2]} strokeWidth={2.5} dot={{ r: 4, fill: CHART_COLORS[2], strokeWidth: 0 }} name="Replacing" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>
    </motion.div>
  );
}
