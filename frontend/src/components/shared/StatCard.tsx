import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { staggerItem } from "@/lib/motion";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive?: boolean };
  accent?: "primary" | "success" | "warning" | "danger" | "neutral";
}

const accentStyles = {
  primary: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-600",
  warning: "bg-amber-500/10 text-amber-600",
  danger: "bg-red-500/10 text-red-600",
  neutral: "bg-muted text-muted-foreground",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accent = "primary",
}: StatCardProps) {
  return (
    <motion.div variants={staggerItem}>
      <Card className="group relative overflow-hidden border-border/60 shadow-sm hover:shadow-md hover:border-border transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-3 min-w-0">
              <p className="text-[13px] font-medium text-muted-foreground tracking-wide">
                {title}
              </p>
              <p className="text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums">
                {value}
              </p>
              {(subtitle || trend) && (
                <div className="flex items-center gap-2 text-xs">
                  {trend && (
                    <span
                      className={cn(
                        "font-medium",
                        trend.positive ? "text-emerald-600" : "text-muted-foreground"
                      )}
                    >
                      {trend.value}
                    </span>
                  )}
                  {subtitle && (
                    <span className="text-muted-foreground">{subtitle}</span>
                  )}
                </div>
              )}
            </div>
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
                accentStyles[accent]
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
