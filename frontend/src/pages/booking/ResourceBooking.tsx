import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users, Building, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockBookings, mockAssets, mockEmployees } from "@/mock";

export function ResourceBooking() {
  const upcomingBookings = mockBookings.filter(b => b.status === "Upcoming" || b.status === "Ongoing").slice(0, 6);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Resource Booking</h2>
          <p className="text-muted-foreground mt-1">Book meeting rooms, vehicles, and shared equipment.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Booking
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {upcomingBookings.map((booking) => {
          const asset = mockAssets.find(a => a.id === booking.assetId);
          const employee = mockEmployees.find(e => e.id === booking.employeeId);
          
          if (!asset || !employee) return null;

          return (
            <Card key={booking.id} className="relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className={`absolute top-0 left-0 w-1 h-full ${booking.status === 'Ongoing' ? 'bg-primary' : 'bg-muted-foreground'}`} />
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{asset.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Building className="h-3 w-3" /> {asset.location}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={booking.status === 'Ongoing' ? "bg-primary/10 text-primary border-primary/20" : ""}>
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-foreground/70" />
                    <span>{format(new Date(booking.startDate), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-foreground/70" />
                    <span>
                      {format(new Date(booking.startDate), "hh:mm a")} - {format(new Date(booking.endDate), "hh:mm a")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-4 border-t">
                    <Users className="h-4 w-4 text-foreground/70" />
                    <span className="font-medium text-foreground">{employee.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
