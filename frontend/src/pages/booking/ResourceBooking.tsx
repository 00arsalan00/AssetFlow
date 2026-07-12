import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { mockBookings, mockAssets, mockEmployees } from "@/mock";
import { staggerContainer, staggerItem } from "@/lib/motion";

const statusStyles: Record<string, string> = {
  Ongoing: "bg-primary/10 text-primary border-primary/20",
  Upcoming: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  Completed: "bg-muted text-muted-foreground",
  Cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

export function ResourceBooking() {
  const upcomingBookings = mockBookings
    .filter((b) => b.status === "Upcoming" || b.status === "Ongoing")
    .slice(0, 9);

  const stats = {
    ongoing: mockBookings.filter((b) => b.status === "Ongoing").length,
    upcoming: mockBookings.filter((b) => b.status === "Upcoming").length,
    completed: mockBookings.filter((b) => b.status === "Completed").length,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      <PageHeader
        title="Resource Booking"
        description="Book meeting rooms, vehicles, and shared equipment across your organization."
        actions={
          <Button className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> New Booking
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Ongoing", value: stats.ongoing, color: "text-primary" },
          { label: "Upcoming", value: stats.upcoming, color: "text-blue-600" },
          { label: "Completed", value: stats.completed, color: "text-emerald-600" },
        ].map((s) => (
          <Card key={s.label} className="border-border/60 shadow-sm">
            <CardContent className="p-4 sm:p-5 text-center">
              <p className={`text-2xl sm:text-3xl font-semibold tabular-nums ${s.color}`}>{s.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {upcomingBookings.length === 0 ? (
        <EmptyState
          variant="bookings"
          title="No upcoming bookings"
          description="Schedule a meeting room, vehicle, or shared equipment to get started."
          action={
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Booking
            </Button>
          }
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {upcomingBookings.map((booking) => {
            const asset = mockAssets.find((a) => a.id === booking.assetId);
            const employee = mockEmployees.find((e) => e.id === booking.employeeId);
            if (!asset || !employee) return null;

            return (
              <motion.div key={booking.id} variants={staggerItem}>
                <Card className="group relative overflow-hidden border-border/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
                  <div
                    className={`absolute top-0 left-0 w-1 h-full ${
                      booking.status === "Ongoing" ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <CardTitle className="text-base truncate">{asset.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{asset.location}</span>
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={statusStyles[booking.status]}>
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 shrink-0 text-foreground/60" />
                        <span>{format(new Date(booking.startDate), "EEE, MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0 text-foreground/60" />
                        <span>
                          {format(new Date(booking.startDate), "hh:mm a")} –{" "}
                          {format(new Date(booking.endDate), "hh:mm a")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 pt-3 border-t border-border/60">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback className="text-[10px]">
                          {employee.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.department}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
