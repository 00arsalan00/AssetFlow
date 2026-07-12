import { motion } from "framer-motion";
import { Plus, GripVertical, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockMaintenance, mockAssets } from "@/mock";

const KANBAN_COLUMNS = ["Pending", "Approved", "In Progress", "Resolved"];
const PRIORITY_COLORS: Record<string, string> = {
  Low: "bg-gray-100 text-gray-800",
  Medium: "bg-blue-100 text-blue-800",
  High: "bg-yellow-100 text-yellow-800",
  Critical: "bg-red-100 text-red-800",
};

export function MaintenanceBoard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 h-full flex flex-col"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Maintenance Board</h2>
          <p className="text-muted-foreground mt-1">Track and manage asset maintenance requests.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Raise Request
        </Button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max h-full">
          {KANBAN_COLUMNS.map((column) => {
            const items = mockMaintenance.filter(m => m.status === column);
            
            return (
              <div key={column} className="w-80 flex flex-col bg-muted/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="font-semibold text-sm uppercase text-muted-foreground">{column}</h3>
                  <Badge variant="secondary">{items.length}</Badge>
                </div>
                
                <ScrollArea className="flex-1 h-[600px] pr-3">
                  <div className="space-y-3">
                    {items.map((item) => {
                      const asset = mockAssets.find(a => a.id === item.assetId);
                      return (
                        <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
                            <Badge className={PRIORITY_COLORS[item.priority] || "bg-gray-100"} variant="outline">
                              {item.priority}
                            </Badge>
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent className="p-3">
                            <h4 className="font-medium text-sm line-clamp-2">{item.description}</h4>
                            {asset && (
                              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                                <AlertTriangle className="h-3 w-3" />
                                <span>{asset.tag}</span>
                              </div>
                            )}
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-xs font-medium bg-secondary px-2 py-1 rounded">
                                {item.assignee || "Unassigned"}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
