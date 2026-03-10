// import { ParkingSquare, Grid3X3, CheckCircle, CalendarCheck, MapPin, Car, ArrowRight, RefreshCw, Loader, Building2, Users, BookOpen, Zap } from "lucide-react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { useState, useEffect } from "react";
// import API from "@/lib/api";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// const AdminDashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [lots, setLots] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchStats = async () => {
//     setLoading(true);
//     try {
//       const [statsRes, lotsRes] = await Promise.all([
//         API.get('/admin/dashboard'),
//         API.get('/parking-lots'),
//       ]);
//       setStats(statsRes.data);
//       setLots(lotsRes.data);
//     } catch (err) {
//       console.error('Failed to fetch data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//     // Auto-refresh every 30 seconds
//     const interval = setInterval(fetchStats, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   if (loading || !stats) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
//       </div>
//     );
//   }

//   const slotData = [
//     { name: 'Available', value: stats.available_slots, fill: '#22c55e' },
//     { name: 'Reserved', value: stats.reserved_slots, fill: '#eab308' },
//     { name: 'Occupied', value: stats.occupied_slots, fill: '#ef4444' },
//   ];

//   const barData = [
//     { name: 'Available', slots: stats.available_slots },
//     { name: 'Reserved', slots: stats.reserved_slots },
//     { name: 'Occupied', slots: stats.occupied_slots },
//   ];

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//         <button
//           onClick={fetchStats}
//           className="p-2 hover:bg-muted rounded-lg transition-colors"
//           title="Refresh stats"
//         >
//           <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
//         </button>
//       </div>

//       {/* Key Statistics */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <div className="parking-card p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-muted-foreground text-sm">Total Lots</p>
//               <p className="text-3xl font-bold mt-1">{stats.total_lots}</p>
//             </div>
//             <Building2 className="h-8 w-8 text-primary/60" />
//           </div>
//         </div>

//         <div className="parking-card p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-muted-foreground text-sm">Total Slots</p>
//               <p className="text-3xl font-bold mt-1">{stats.total_slots}</p>
//             </div>
//             <Zap className="h-8 w-8 text-primary/60" />
//           </div>
//         </div>

//         <div className="parking-card p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-muted-foreground text-sm">Active Reservations</p>
//               <p className="text-3xl font-bold mt-1">{stats.active_reservations}</p>
//             </div>
//             <BookOpen className="h-8 w-8 text-primary/60" />
//           </div>
//         </div>

//         <div className="parking-card p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-muted-foreground text-sm">Total Users</p>
//               <p className="text-3xl font-bold mt-1">{stats.total_users}</p>
//             </div>
//             <Users className="h-8 w-8 text-primary/60" />
//           </div>
//         </div>
//       </div>
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold">Parking Locations</h2>
//         <p className="text-muted-foreground mt-1">
//           Manage parking lots and monitor slot details
//         </p>
//       </div>

//       {/* Parking Lots Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
//         {lots.map((lot) => {
//           const id = lot.lot_id || lot.id;
//           const total = lot.total_slots || lot.totalSlots;
//           const avail = lot.available_slots || lot.availableSlots;
//           return (
//             <div key={id} className="parking-card overflow-hidden">
//               <div className="hero-bg p-5">
//                 <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
//                   <MapPin className="h-4 w-4" />
//                   {lot.location}
//                 </div>

//                 <h3 className="text-lg font-semibold text-primary-foreground mt-1">
//                   {lot.name}
//                 </h3>
//               </div>

//               <div className="p-5">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-2 text-sm">
//                     <Car className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-muted-foreground">
//                       {total} Total Slots
//                     </span>
//                   </div>

//                   <span
//                     className={`text-sm font-semibold px-2.5 py-1 rounded-full ${avail > 10
//                         ? "bg-success/15 text-success"
//                         : avail > 3
//                           ? "bg-warning/15 text-warning"
//                           : "bg-destructive/15 text-destructive"
//                       }`}
//                   >
//                     {avail} Available
//                   </span>
//                 </div>

//                 <Link to={`/admin/lots/${id}/slots`}>
//                   <Button className="w-full gradient-bg text-primary-foreground hover:opacity-90">
//                     View Slots <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import {
  Building2,
  Zap,
  BookOpen,
  Users,
  MapPin,
  Car,
  ArrowRight,
  Loader,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import API from "@/lib/api";
import { getSocket } from "@/lib/socket";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [statsRes, lotsRes] = await Promise.all([
        API.get("/admin/dashboard"),
        API.get("/parking-lots"),
      ]);
      setStats(statsRes.data);
      setLots(lotsRes.data);
    } catch (err) {
      console.error("Failed to fetch initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();

    // Socket.io real-time updates
    let socket;
    try {
      socket = getSocket();

      const handleSlotUpdate = (data) => {
        // Update stats per lot
        setLots((prevLots) =>
          prevLots.map((lot) => {
            if (lot.lot_id === data.lot_id) {
              let available = lot.available_slots || lot.availableSlots || 0;
              let occupied = lot.occupied_slots || lot.occupiedSlots || 0;
              let reserved = lot.reserved_slots || lot.reservedSlots || 0;

              // Adjust counts based on status change
              if (data.status === "available") {
                available += 1;
                if (data.prev_status === "occupied") occupied -= 1;
                else if (data.prev_status === "reserved") reserved -= 1;
              } else if (data.status === "occupied") {
                occupied += 1;
                if (data.prev_status === "available") available -= 1;
                else if (data.prev_status === "reserved") reserved -= 1;
              } else if (data.status === "reserved") {
                reserved += 1;
                if (data.prev_status === "available") available -= 1;
                else if (data.prev_status === "occupied") occupied -= 1;
              }

              return {
                ...lot,
                available_slots: available,
                occupied_slots: occupied,
                reserved_slots: reserved,
              };
            }
            return lot;
          })
        );

        // Update overall dashboard stats
        setStats((prev) => {
          if (!prev) return prev;
          let available = prev.available_slots;
          let occupied = prev.occupied_slots;
          let reserved = prev.reserved_slots;

          if (data.status === "available") {
            available += 1;
            if (data.prev_status === "occupied") occupied -= 1;
            else if (data.prev_status === "reserved") reserved -= 1;
          } else if (data.status === "occupied") {
            occupied += 1;
            if (data.prev_status === "available") available -= 1;
            else if (data.prev_status === "reserved") reserved -= 1;
          } else if (data.status === "reserved") {
            reserved += 1;
            if (data.prev_status === "available") available -= 1;
            else if (data.prev_status === "occupied") occupied -= 1;
          }

          return {
            ...prev,
            available_slots: available,
            occupied_slots: occupied,
            reserved_slots: reserved,
          };
        });
      };

      socket.on("slotStatusUpdated", handleSlotUpdate);

      return () => {
        socket.off("slotStatusUpdated", handleSlotUpdate);
      };
    } catch (err) {
      console.warn("Socket.io not available:", err);
    }
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Lots" value={stats.total_lots} icon={<Building2 />} />
        <StatCard title="Total Slots" value={stats.total_slots} icon={<Zap />} />
        <StatCard title="Active Reservations" value={stats.active_reservations} icon={<BookOpen />} />
        <StatCard title="Total Users" value={stats.total_users} icon={<Users />} />
      </div>

      {/* Parking Lots */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Parking Locations</h2>
        <p className="text-muted-foreground mt-1">Manage parking lots and monitor slot details</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {lots.map((lot) => {
          const id = lot.lot_id || lot.id;
          const total = lot.total_slots || lot.totalSlots;
          const avail = lot.available_slots || lot.availableSlots;

          return (
            <div key={id} className="parking-card overflow-hidden">
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
                    <span className="text-muted-foreground">{total} Total Slots</span>
                  </div>

                  <span
                    className={`text-sm font-semibold px-2.5 py-1 rounded-full ${
                      avail > 10
                        ? "bg-success/15 text-success"
                        : avail > 3
                        ? "bg-warning/15 text-warning"
                        : "bg-destructive/15 text-destructive"
                    }`}
                  >
                    {avail} Available
                  </span>
                </div>

                <Link to={`/admin/lots/${id}/slots`}>
                  <Button className="w-full gradient-bg text-primary-foreground hover:opacity-90">
                    View Slots <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="parking-card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-muted-foreground text-sm">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className="text-primary/60">{icon}</div>
    </div>
  </div>
);

export default AdminDashboard;