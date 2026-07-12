import { motion } from "framer-motion";
import {
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { staggerContainer, staggerItem } from "@/lib/motion";

const settingsSections = [
  {
    icon: Globe,
    title: "Organization Profile",
    description: "Company name, timezone, and regional settings",
    fields: [
      { label: "Organization Name", value: "Acme Corporation", type: "text" },
      { label: "Timezone", value: "Asia/Kolkata (UTC+5:30)", type: "text" },
      { label: "Currency", value: "USD ($)", type: "text" },
    ],
  },
  {
    icon: Bell,
    title: "Notification Preferences",
    description: "Configure how and when you receive alerts",
    toggles: [
      { label: "Email notifications", enabled: true },
      { label: "Maintenance alerts", enabled: true },
      { label: "Booking reminders", enabled: true },
      { label: "Audit discrepancy alerts", enabled: false },
    ],
  },
  {
    icon: Shield,
    title: "Security & Access",
    description: "Authentication and role-based access controls",
    fields: [
      { label: "Session timeout", value: "30 minutes", type: "text" },
      { label: "Two-factor authentication", value: "Enabled", type: "text" },
    ],
  },
  {
    icon: Database,
    title: "Data & Integrations",
    description: "API connections and data export settings",
    badges: ["Odoo ERP", "Slack", "Microsoft 365"],
  },
];

export function Settings() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container max-w-4xl">
      <PageHeader
        title="Settings"
        description="Configure your AssetFlow workspace, notifications, and integrations."
        actions={
          <Button className="shadow-sm">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {settingsSections.map((section) => (
          <motion.div key={section.title} variants={staggerItem}>
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{section.title}</CardTitle>
                    <CardDescription className="mt-1">{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.fields?.map((field) => (
                  <div key={field.label} className="grid gap-2 sm:grid-cols-3 sm:items-center">
                    <Label className="text-sm text-muted-foreground sm:text-right">{field.label}</Label>
                    <Input defaultValue={field.value} className="sm:col-span-2 h-9" />
                  </div>
                ))}
                {section.toggles?.map((toggle) => (
                  <div key={toggle.label} className="flex items-center justify-between py-1">
                    <span className="text-sm">{toggle.label}</span>
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        toggle.enabled ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          toggle.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
                {section.badges && (
                  <div className="flex flex-wrap gap-2">
                    {section.badges.map((b) => (
                      <Badge key={b} variant="secondary" className="px-3 py-1">
                        {b}
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      + Add Integration
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <Card className="border-border/60 shadow-sm border-dashed">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <Palette className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Appearance</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Theme customization coming in the next release.
              </p>
            </div>
            <Badge variant="outline">Soon</Badge>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
