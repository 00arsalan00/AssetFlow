import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { staggerItem } from "@/lib/motion";

interface ChartCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  height?: string;
}

export function ChartCard({
  title,
  description,
  action,
  children,
  className,
  height = "h-[280px]",
}: ChartCardProps) {
  return (
    <motion.div variants={staggerItem} className={className}>
      <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-[15px] font-semibold">{title}</CardTitle>
            {description && (
              <CardDescription className="text-xs">{description}</CardDescription>
            )}
          </div>
          {action}
        </CardHeader>
        <CardContent>
          <div className={height}>{children}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
