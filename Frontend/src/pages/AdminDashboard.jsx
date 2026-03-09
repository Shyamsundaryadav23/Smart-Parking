import { ParkingSquare, Grid3X3, CheckCircle, CalendarCheck } from "lucide-react";
import { parkingLots, reservations } from "@/data/mockData";

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

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
  </div>
);

export default AdminDashboard;