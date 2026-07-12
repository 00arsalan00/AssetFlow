import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Package,
  Wrench,
  CalendarCheck,
  ArrowRightLeft,
  CheckCircle2,
  ClipboardCheck,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ChartCard } from "@/components/shared/ChartCard";
import {
  dashboardStats,
  departmentAllocationData,
  mockAssets,
  recentActivity,
} from "@/mock";
import { CHART_COLORS, chartTooltipStyle, chartGridStroke, chartAxisTick } from "@/lib/chart-theme";
import { staggerContainer } from "@/lib/motion";

const iconMap = {
  Package,
  ArrowRightLeft,
  Wrench,
  CalendarCheck,
  ClipboardCheck,
};

const pieData = [
  { name: "Available", value: dashboardStats.availableAssets },
  { name: "Allocated", value: dashboardStats.allocatedAssets },
  {
    name: "Maintenance",
    value: mockAssets.filter((a) => a.status === "Under Maintenance").length,
  },
  {
    name: "Reserved",
    value: mockAssets.filter((a) => a.status === "Reserved").length,
  },
];

const lineData = [
  { name: "Mon", issues: 4 },
  { name: "Tue", issues: 7 },
  { name: "Wed", issues: 3 },
  { name: "Thu", issues: 8 },
  { name: "Fri", issues: 5 },
  { name: "Sat", issues: 2 },
  { name: "Sun", issues: 1 },
];

export function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="page-container"
    >
      <PageHeader
        title="Dashboard"
        description="Real-time overview of your organization's assets, maintenance, and bookings."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          title="Available Assets"
          value={dashboardStats.availableAssets}
          icon={Package}
          accent="primary"
          trend={{ value: "+4", positive: true }}
          subtitle="from last week"
        />
        <StatCard
          title="Allocated Assets"
          value={dashboardStats.allocatedAssets}
          icon={CheckCircle2}
          accent="success"
          trend={{ value: "+12%", positive: true }}
          subtitle="from last month"
        />
        <StatCard
          title="Active Maintenance"
          value={dashboardStats.maintenanceCount}
          icon={Wrench}
          accent="danger"
          subtitle="Requires attention"
        />
        <StatCard
          title="Active Bookings"
          value={dashboardStats.activeBookings}
          icon={CalendarCheck}
          accent="warning"
          subtitle="2 pending approvals"
        />
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-7">
        <ChartCard
          title="Department Allocation"
          description="Assets assigned per department"
          className="lg:col-span-4"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentAllocationData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridStroke} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={chartAxisTick} />
              <YAxis axisLine={false} tickLine={false} tick={chartAxisTick} />
              <Tooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={chartTooltipStyle} />
              <Bar dataKey="assets" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Asset Status"
          description="Current distribution across all assets"
          className="lg:col-span-3"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 -mt-4">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <ChartCard
          title="Maintenance Trends"
          description="Issues reported over the last 7 days"
          className="lg:col-span-3"
          height="h-[260px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridStroke} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={chartAxisTick} />
              <YAxis axisLine={false} tickLine={false} tick={chartAxisTick} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line
                type="monotone"
                dataKey="issues"
                stroke={CHART_COLORS[4]}
                strokeWidth={2.5}
                dot={{ r: 4, fill: CHART_COLORS[4], strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Recent Activity"
          description="Latest actions across the system"
          className="lg:col-span-4"
          height="h-auto"
        >
          <div className="space-y-1">
            {recentActivity.map((item, i) => {
              const Icon = iconMap[item.icon];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 rounded-lg px-3 py-3 hover:bg-muted/40 transition-colors"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ChartCard>
      </div>
    </motion.div>
  );
}
