import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ClipboardCheck, Plus, User, CheckCircle2, AlertTriangle, Clock, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/DataTable";
import { mockAudits, mockEmployees, mockAssets } from "@/mock";

const statusConfig: Record<string, { color: string; icon: typeof Clock }> = {
  Planned: { color: "bg-blue-500/10 text-blue-700 border-blue-500/20", icon: Clock },
  Ongoing: { color: "bg-amber-500/10 text-amber-700 border-amber-500/20", icon: ClipboardCheck },
  Completed: { color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20", icon: CheckCircle2 },
};

const discrepancies = mockAssets
  .filter((a) => a.condition === "Poor")
  .slice(0, 10)
  .map((a, i) => ({
    id: i + 1,
    assetTag: a.tag,
    assetName: a.name,
    expectedLocation: `Floor ${faker_floor(i)}, Office ${100 + i}`,
    actualLocation: a.location,
    severity: i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low",
    resolvedStatus: i % 2 === 0 ? "Open" : "Resolved",
  }));

function faker_floor(i: number) {
  return (i % 5) + 1;
}

const severityColors: Record<string, string> = {
  High: "bg-red-500/10 text-red-700 border-red-500/20",
  Medium: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  Low: "bg-muted text-muted-foreground border-border",
};

const workflowSteps = [
  { step: 1, label: "Create Audit Cycle", description: "Define scope and schedule" },
  { step: 2, label: "Assign Auditors", description: "Assign team members" },
  { step: 3, label: "Field Verification", description: "Physical verification" },
  { step: 4, label: "Discrepancy Report", description: "Review findings" },
  { step: 5, label: "Close Cycle", description: "Finalize and archive" },
];

export function AuditManagement() {
  const activeAudit = mockAudits.find((a) => a.status === "Ongoing") ?? mockAudits[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      <PageHeader
        title="Audit Management"
        description="Manage audit cycles, assign auditors, and track discrepancies."
        actions={
          <Button className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> New Audit Cycle
          </Button>
        }
      />

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Audit Workflow</CardTitle>
          <CardDescription>
            Current cycle: <span className="font-medium text-foreground">{activeAudit.name}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-0 overflow-x-auto pb-2 scrollbar-thin">
            {workflowSteps.map((s, i) => {
              const isActive = i === 2;
              const isDone = i < 2;
              return (
                <div key={s.step} className="flex items-center min-w-[120px] sm:min-w-[140px] flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.08 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                        isDone
                          ? "bg-primary border-primary text-primary-foreground"
                          : isActive
                          ? "bg-amber-500 border-amber-500 text-white ring-4 ring-amber-500/20"
                          : "bg-muted border-border text-muted-foreground"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="h-5 w-5" /> : s.step}
                    </motion.div>
                    <p
                      className={`mt-2 text-xs font-medium text-center ${
                        isActive ? "text-amber-600" : isDone ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </p>
                    <p className="text-[10px] text-center text-muted-foreground hidden sm:block mt-0.5">
                      {s.description}
                    </p>
                  </div>
                  {i < workflowSteps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 mt-[-28px] ${isDone ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <DataTable>
        <Table className="enterprise-table">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Audit Name</TableHead>
              <TableHead>Auditor</TableHead>
              <TableHead className="hidden sm:table-cell">Start Date</TableHead>
              <TableHead>Discrepancies</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAudits.slice(0, 10).map((audit) => {
              const emp = mockEmployees.find((e) => e.id === audit.auditorId);
              const cfg = statusConfig[audit.status];
              return (
                <TableRow key={audit.id}>
                  <TableCell className="font-medium">{audit.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm truncate max-w-[140px]">{emp?.name ?? "Unassigned"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                    {format(new Date(audit.dateStarted), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    {audit.discrepanciesCount > 0 ? (
                      <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-500/20">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {audit.discrepanciesCount}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                        None
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cfg.color}>{audit.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8">
                      View <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DataTable>

      <DataTable
        toolbar={
          <div>
            <h3 className="font-semibold text-sm">Discrepancy Report</h3>
            <p className="text-xs text-muted-foreground">Assets flagged during the current audit cycle</p>
          </div>
        }
      >
        <Table className="enterprise-table">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Asset Tag</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Expected</TableHead>
              <TableHead className="hidden md:table-cell">Actual</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discrepancies.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="text-muted-foreground text-xs">{d.id}</TableCell>
                <TableCell>
                  <span className="font-mono text-xs bg-muted/60 px-2 py-0.5 rounded">{d.assetTag}</span>
                </TableCell>
                <TableCell className="font-medium max-w-[160px] truncate">{d.assetName}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{d.expectedLocation}</TableCell>
                <TableCell className="hidden md:table-cell text-sm">{d.actualLocation}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={severityColors[d.severity]}>{d.severity}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      d.resolvedStatus === "Open"
                        ? "bg-red-500/10 text-red-700 border-red-500/20"
                        : "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                    }
                  >
                    {d.resolvedStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
    </motion.div>
  );
}
