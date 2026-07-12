import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ClipboardCheck, Plus, User, CheckCircle2, AlertTriangle, Clock, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { mockAudits, mockEmployees, mockAssets } from "@/mock";

const statusConfig: Record<string, { color: string; icon: typeof Clock }> = {
  Planned: { color: "bg-blue-100 text-blue-800", icon: Clock },
  Ongoing: { color: "bg-amber-100 text-amber-800", icon: ClipboardCheck },
  Completed: { color: "bg-green-100 text-green-800", icon: CheckCircle2 },
};

const discrepancies = mockAssets
  .filter((a) => a.condition === "Poor")
  .slice(0, 8)
  .map((a, i) => ({
    id: i + 1,
    assetTag: a.tag,
    assetName: a.name,
    expectedLocation: "Office Floor 3",
    actualLocation: a.location,
    severity: i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low",
    resolvedStatus: i % 2 === 0 ? "Open" : "Resolved",
  }));

const severityColors: Record<string, string> = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-amber-100 text-amber-800",
  Low: "bg-gray-100 text-gray-700",
};

const workflowSteps = [
  { step: 1, label: "Create Audit Cycle", description: "Define scope and schedule" },
  { step: 2, label: "Assign Auditors", description: "Assign team members to audit zones" },
  { step: 3, label: "Field Verification", description: "Physical asset verification" },
  { step: 4, label: "Discrepancy Report", description: "Document and review findings" },
  { step: 5, label: "Close Cycle", description: "Finalize and archive audit" },
];

export function AuditManagement() {
  const activeAudit = mockAudits.find((a) => a.status === "Ongoing") ?? mockAudits[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audit Management</h2>
          <p className="text-muted-foreground mt-1">Manage audit cycles, assign auditors, and track discrepancies.</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />New Audit Cycle</Button>
      </div>

      {/* Workflow Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Audit Workflow</CardTitle>
          <CardDescription>Current audit cycle: <strong>{activeAudit.name}</strong></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-0 overflow-x-auto pb-2">
            {workflowSteps.map((s, i) => {
              const isActive = i === 2;
              const isDone = i < 2;
              return (
                <div key={s.step} className="flex items-center min-w-[140px] flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                        isDone
                          ? "bg-primary border-primary text-white"
                          : isActive
                          ? "bg-amber-500 border-amber-500 text-white ring-4 ring-amber-200"
                          : "bg-muted border-border text-muted-foreground"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="h-5 w-5" /> : s.step}
                    </div>
                    <p className={`mt-2 text-xs font-medium text-center ${isActive ? "text-amber-600" : isDone ? "text-primary" : "text-muted-foreground"}`}>
                      {s.label}
                    </p>
                    <p className="text-xs text-center text-muted-foreground hidden sm:block">{s.description}</p>
                  </div>
                  {i < workflowSteps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 mt-[-24px] ${isDone ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Audit Cycles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Audit Cycles</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Audit Name</TableHead>
                <TableHead>Auditor</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Discrepancies</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAudits.slice(0, 8).map((audit) => {
                const emp = mockEmployees.find((e) => e.id === audit.auditorId);
                const cfg = statusConfig[audit.status];
                return (
                  <TableRow key={audit.id}>
                    <TableCell className="font-medium">{audit.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{emp?.name ?? "Unassigned"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(audit.dateStarted), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {audit.discrepanciesCount > 0 ? (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {audit.discrepanciesCount}
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">None</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={cfg.color}>{audit.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Discrepancy Report */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Discrepancy Report</CardTitle>
          <CardDescription>Assets flagged during the current audit cycle</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Asset Tag</TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Expected Location</TableHead>
                <TableHead>Actual Location</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discrepancies.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="text-muted-foreground text-sm">{d.id}</TableCell>
                  <TableCell className="font-mono text-xs">{d.assetTag}</TableCell>
                  <TableCell className="font-medium">{d.assetName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{d.expectedLocation}</TableCell>
                  <TableCell className="text-sm">{d.actualLocation}</TableCell>
                  <TableCell>
                    <Badge className={severityColors[d.severity]}>{d.severity}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={d.resolvedStatus === "Open" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                      {d.resolvedStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
