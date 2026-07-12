import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockAssets } from "@/mock";

const statusColors: Record<string, string> = {
  "Available": "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400",
  "Allocated": "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-400",
  "Under Maintenance": "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-400",
  "Reserved": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export function AssetDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredAssets = mockAssets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Asset Directory</h2>
          <p className="text-muted-foreground mt-1">Manage and track all organizational assets.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Register Asset
        </Button>
      </div>

      <div className="bg-card border rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or tag..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>
        
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Tag</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.slice(0, 10).map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.tag}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>{asset.condition}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[asset.status] || "bg-gray-100 text-gray-800"}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAssets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No assets found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </motion.div>
  );
}
