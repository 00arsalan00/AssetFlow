import { motion } from "framer-motion";
import { Plus, GripVertical, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/shared/PageHeader";
import { mockMaintenance, mockAssets } from "@/mock";
import { staggerContainer, staggerItem } from "@/lib/motion";

const KANBAN_COLUMNS = ["Pending", "Approved", "In Progress", "Resolved"] as const;

const PRIORITY_COLORS: Record<string, string> = {
  Low: "bg-muted text-muted-foreground border-border",
  Medium: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  High: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  Critical: "bg-red-500/10 text-red-700 border-red-500/20",
};

const columnAccent: Record<string, string> = {
  Pending: "border-t-amber-400",
  Approved: "border-t-blue-400",
  "In Progress": "border-t-primary",
  Resolved: "border-t-emerald-400",
};

export function MaintenanceBoard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-container h-full flex flex-col"
    >
      <PageHeader
        title="Maintenance Board"
        description="Track and manage asset maintenance requests with a visual Kanban workflow."
        actions={
          <Button className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Raise Request
          </Button>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-x-auto pb-4 -mx-1 px-1"
      >
        <div className="flex gap-4 min-w-max h-full">
          {KANBAN_COLUMNS.map((column) => {
            const items = mockMaintenance.filter((m) => m.status === column);

            return (
              <motion.div
                key={column}
                variants={staggerItem}
                className={`w-[280px] sm:w-[300px] flex flex-col rounded-xl border border-border/60 bg-muted/30 border-t-[3px] ${columnAccent[column]}`}
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className="font-semibold text-sm">{column}</h3>
                  <Badge variant="secondary" className="text-xs tabular-nums">
                    {items.length}
                  </Badge>
                </div>

                <ScrollArea className="flex-1 h-[calc(100vh-280px)] sm:h-[600px] px-3 pb-3">
                  <div className="space-y-3">
                    {items.slice(0, 12).map((item) => {
                      const asset = mockAssets.find((a) => a.id === item.assetId);
                      return (
                        <Card
                          key={item.id}
                          className="cursor-grab border-border/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 active:cursor-grabbing"
                        >
                          <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${PRIORITY_COLORS[item.priority]}`}
                            >
                              {item.priority}
                            </Badge>
                            <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                          </CardHeader>
                          <CardContent className="p-3">
                            <h4 className="font-medium text-sm leading-snug line-clamp-2">
                              {item.description}
                            </h4>
                            {asset && (
                              <div className="flex items-center gap-1.5 mt-2.5 text-xs text-muted-foreground">
                                <AlertTriangle className="h-3 w-3" />
                                <span className="font-mono">{asset.tag}</span>
                              </div>
                            )}
                            <div className="mt-3">
                              <span className="text-xs font-medium bg-secondary/80 px-2.5 py-1 rounded-md">
                                {item.assignee || "Unassigned"}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
