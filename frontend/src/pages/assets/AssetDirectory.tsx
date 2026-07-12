import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  DataTable,
  DataTablePagination,
  DataTableEmpty,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/DataTable";
import { mockAssets } from "@/mock";
import { staggerContainer } from "@/lib/motion";

const PAGE_SIZE = 12;

const statusColors: Record<string, string> = {
  Available: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  Allocated: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  "Under Maintenance": "bg-red-500/10 text-red-700 border-red-500/20",
  Reserved: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  Retired: "bg-muted text-muted-foreground border-border",
};

const conditionColors: Record<string, string> = {
  New: "text-emerald-600",
  Good: "text-blue-600",
  Fair: "text-amber-600",
  Poor: "text-red-600",
};

export function AssetDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const filteredAssets = mockAssets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / PAGE_SIZE));
  const paginated = filteredAssets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-container"
    >
      <PageHeader
        title="Asset Directory"
        description="Manage and track all organizational assets with full lifecycle visibility."
        actions={
          <Button className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Register Asset
          </Button>
        }
      />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <DataTable
          toolbar={
            <>
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, tag, or category..."
                  className="pl-9 h-9 bg-background"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </>
          }
          footer={
            filteredAssets.length > 0 && (
              <DataTablePagination
                page={page}
                totalPages={totalPages}
                totalItems={filteredAssets.length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            )
          }
        >
          <Table className="enterprise-table">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Asset Tag</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <span className="font-mono text-xs font-medium bg-muted/60 px-2 py-1 rounded">
                      {asset.tag}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{asset.name}</TableCell>
                  <TableCell className="text-muted-foreground">{asset.category}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {asset.location}
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium ${conditionColors[asset.condition]}`}>
                      {asset.condition}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[asset.status]}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAssets.length === 0 && (
                <DataTableEmpty
                  colSpan={7}
                  variant="search"
                  title="No assets found"
                  description="Try adjusting your search or filters to find what you're looking for."
                  action={
                    <Button size="sm" onClick={() => setSearchTerm("")}>
                      Clear search
                    </Button>
                  }
                />
              )}
            </TableBody>
          </Table>
        </DataTable>
      </motion.div>
    </motion.div>
  );
}
