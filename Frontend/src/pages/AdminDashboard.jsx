import { ParkingSquare, Grid3X3, CheckCircle, CalendarCheck, MapPin, Car, ArrowRight } from "lucide-react";
import { parkingLots, reservations } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stats = [
  {
    label: "Total Parking Lots",
    value: parkingLots.length,
    icon: ParkingSquare,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Total Parking Slots",
    value: parkingLots.reduce((a, l) => a + l.totalSlots, 0),
    icon: Grid3X3,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    label: "Available Slots",
    value: parkingLots.reduce((a, l) => a + l.availableSlots, 0),
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    label: "Active Reservations",
    value: reservations.filter((r) => r.status === "active").length,
    icon: CalendarCheck,
    color: "text-warning",
    bg: "bg-warning/10",
  },
];

const AdminDashboard = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8">Dashboard Overview</h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
      {stats.map((s) => (
        <div key={s.label} className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className={`rounded-lg p-2.5 ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
          </div>

          <p className="text-3xl font-bold">{s.value}</p>
          <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
        </div>
      ))}
    </div>

    <div className="mb-6">
      <h2 className="text-2xl font-bold">Parking Locations</h2>
      <p className="text-muted-foreground mt-1">
        Select a parking lot to view and manage slot details
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {parkingLots.map((lot) => (
        <div key={lot.id} className="parking-card overflow-hidden">
          <div className="hero-bg p-5">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
              <MapPin className="h-4 w-4" />
              {lot.location}
            </div>

            <h3 className="text-lg font-semibold text-primary-foreground mt-1">
              {lot.name}
            </h3>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {lot.totalSlots} Total Slots
                </span>
              </div>

              <span
                className={`text-sm font-semibold px-2.5 py-1 rounded-full ${lot.availableSlots > 10
                    ? "bg-success/15 text-success"
                    : lot.availableSlots > 3
                      ? "bg-warning/15 text-warning"
                      : "bg-destructive/15 text-destructive"
                  }`}
              >
                {lot.availableSlots} Available
              </span>
            </div>

            <Link to={`/admin/lots/${lot.id}/slots`}>
              <Button className="w-full gradient-bg text-primary-foreground hover:opacity-90">
                View Slots <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminDashboard;