// import { useState, useMemo, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, Clock, CheckCircle, User, Mail, Phone, Calendar, Plus, RefreshCw, Loader } from "lucide-react";
// import API from "@/lib/api";
// import { useSlotMonitoring } from "@/hooks/useSlotMonitoring";
// import { initSocket } from "@/lib/socket";

// const AdminSlotDetails = () => {
//   const { lotId } = useParams();
//   const navigate = useNavigate();
//   const socketInitialized = useRef(false);

//   // Initialize socket connection only once
//   useEffect(() => {
//     if (!socketInitialized.current) {
//       initSocket();
//       socketInitialized.current = true;
//     }
//   }, []);

//   const [lot, setLot] = useState(null);
//   const { slots, loading: loadingSlots, refetch, updateSlotStatus } = useSlotMonitoring(lotId, 5000);
//   const [reservations, setReservations] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selected, setSelected] = useState(null);

//   // fetch lot info, reservations, and users
//   useEffect(() => {
//     API.get('/parking-lots')
//       .then(res => {
//         const found = res.data.find(
//           (l) => l.lot_id === lotId || l.id === lotId
//         );
//         setLot(found);
//       })
//       .catch(console.error);

//     API.get('/admin/reservations')
//       .then(res => setReservations(res.data))
//       .catch(console.error);

//     API.get('/admin/users')
//       .then(res => setUsers(res.data))
//       .catch(console.error);
//   }, [lotId]);

//   // determine reservation info for selected slot, using fetched reservations
//   const selectedReservation = useMemo(() => {
//     if (!selected) return null;
//     if (selected.status === "available") return null;
//     const res = reservations.find(r => r.slot_id === (selected.slot_id || selected.id) && r.status === 'active');
//     return res || null;
//   }, [selected, reservations]);

//   // Map users by user_id for quick lookup
//   const usersMap = useMemo(() => {
//     const map = {};
//     users.forEach(user => {
//       map[user.user_id] = user;
//     });
//     return map;
//   }, [users]);

//   // Get user details for the selected reservation
//   const reservationUser = useMemo(() => {
//     if (!selectedReservation) return null;
//     return usersMap[selectedReservation.user_id] || null;
//   }, [selectedReservation, usersMap]);

//   // Update slot status with API call and UI update
//   const handleSlotStatusUpdate = async (newStatus) => {
//     try {
//       const slotId = selected.slot_id || selected.id;
//       await API.put(`/admin/slots/${slotId}`, { status: newStatus });
//       updateSlotStatus(slotId, newStatus);
//       setSelected(prev => ({ ...prev, status: newStatus }));
//     } catch (err) {
//       console.error('Failed to update slot status:', err);
//     }
//   };

//   // Create a new slot and refresh
//   const handleAddSlot = async () => {
//     try {
//       const nextSlotNumber = slots.length + 1;
//       await API.post('/admin/slots', {
//         lot_id: lot.lot_id || lot.id,
//         slot_number: nextSlotNumber,
//       });
//       refetch();
//     } catch (err) {
//       console.error('Failed to add slot:', err);
//     }
//   };

//   if (!lot)
//     return (
//       <div className="text-center py-20 text-muted-foreground">
//         Parking lot not found.
//       </div>
//     );

//   return (
//     <div>
//       <button
//         onClick={() => navigate("/admin/lots")}
//         className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
//       >
//         <ArrowLeft className="h-4 w-4" /> Back to Manage Lots
//       </button>

//       <div className="mb-6">
//         <h1 className="text-2xl md:text-3xl font-bold">{lot.name} - Slot View</h1>
//         <p className="text-muted-foreground mt-1">
//           {lot.location} • {lot.total_slots || lot.totalSlots} Total Slots
//         </p>
//       </div>

//       {/* Legend */}
//       <div className="flex flex-wrap gap-4 mb-6">
//         {[
//           { label: "Available", cls: "bg-success/20 border-success" },
//           { label: "Occupied", cls: "bg-destructive/20 border-destructive" },
//           { label: "Reserved", cls: "bg-warning/20 border-warning" },
//         ].map((s) => (
//           <div key={s.label} className="flex items-center gap-2 text-sm">
//             <div className={`w-4 h-4 rounded border-2 ${s.cls}`} />
//             <span className="text-muted-foreground">{s.label}</span>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Slot Grid */}
//         <div className="lg:col-span-2 parking-card p-5">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="font-semibold text-sm">Parking Slots</h3>
//             <button
//               onClick={() => refetch()}
//               className="p-1.5 hover:bg-muted rounded transition-colors"
//               title="Refresh slots"
//             >
//               <RefreshCw className={`h-4 w-4 ${loadingSlots ? 'animate-spin' : ''}`} />
//             </button>
//           </div>
          
//           {loadingSlots ? (
//             <div className="flex items-center justify-center py-12">
//               <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
//             </div>
//           ) : (
//             <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
//               {slots.map((slot) => {
//                 const id = slot.slot_id || slot.id;
//                 return (
//                 <button
//                   key={id}
//                   onClick={() => setSelected(slot)}
//                   className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${selected && (selected.slot_id || selected.id) === id
//                     ? "ring-2 ring-primary ring-offset-2 bg-primary/20 border-2 border-primary text-primary shadow-md transform scale-105"
//                     : slot.status === "available"
//                       ? "slot-available hover:bg-success/30"
//                       : slot.status === "occupied"
//                         ? "slot-occupied hover:bg-destructive/30"
//                         : "slot-reserved hover:bg-warning/30"
//                     }`}
//                 >
//                   {slot.slot_number}
//                 </button>
//               )})}

//               {/* Add Slot Button */}
//               <button
//                 onClick={handleAddSlot}
//                 className="aspect-square rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground transition-all group"
//                 title="Add New Slot"
//               >
//                 <Plus className="h-6 w-6 group-hover:scale-125 transition-transform" />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Details Panel */}
//         <div className="parking-card p-5">
//           {selected ? (
//             <div className="space-y-6">
//               <div className="flex items-center gap-3 pb-4 border-b">
//                 <div className="gradient-bg rounded-lg p-2.5">
//                   <CheckCircle className="h-5 w-5 text-primary-foreground" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">
//                     Selected Slot
//                   </p>
//                   <p className="font-bold text-lg">Slot {selected.slot_number}</p>
//                 </div>
//                 <div className="ml-auto">
//                   <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${selected.status === 'available' ? 'bg-success/20 text-success border border-success' :
//                     selected.status === 'occupied' ? 'bg-destructive/20 text-destructive border border-destructive' :
//                       'bg-warning/20 text-warning border border-warning'
//                     }`}>
//                     {selected.status}
//                   </span>
//                 </div>
//               </div>

//               {selected.status === "available" ? (
//                 <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-3">
//                   <CheckCircle className="h-12 w-12 text-success/50" />
//                   <p>This slot is currently available.</p>
//                   <p className="text-sm">No active reservations.</p>

//                   <div className="mt-8 flex gap-3 w-full">
//                     <button
//                       onClick={() => handleSlotStatusUpdate('occupied')}
//                       className="flex-1 bg-destructive/10 text-destructive hover:bg-destructive/20 py-2 rounded-lg text-sm font-semibold transition-colors"
//                     >
//                       Mark Occupied
//                     </button>
//                     <button
//                       onClick={() => handleSlotStatusUpdate('reserved')}
//                       className="flex-1 bg-warning/10 text-warning hover:bg-warning/20 py-2 rounded-lg text-sm font-semibold transition-colors"
//                     >
//                       Mark Reserved
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                   <div className="flex justify-end mb-4">
//                     <button
//                       onClick={() => handleSlotStatusUpdate('available')}
//                       className="bg-success/10 text-success hover:bg-success/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
//                     >
//                       Mark as Available
//                     </button>
//                   </div>

//                   <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">Reservation Details</h3>

//                   <div className="bg-muted/30 rounded-lg p-4 space-y-4 border">
//                     <div className="flex items-start gap-3">
//                       <User className="h-5 w-5 text-primary mt-0.5" />
//                       <div>
//                         <p className="text-xs text-muted-foreground">User Name</p>
//                         <p className="font-medium">{reservationUser?.name || selectedReservation?.user_id}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       <Mail className="h-5 w-5 text-primary mt-0.5" />
//                       <div>
//                         <p className="text-xs text-muted-foreground">Email</p>
//                         <p className="font-medium text-sm">{reservationUser?.email || 'N/A'}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       <Phone className="h-5 w-5 text-primary mt-0.5" />
//                       <div>
//                         <p className="text-xs text-muted-foreground">Phone Number</p>
//                         <p className="font-medium text-sm">{reservationUser?.phone || 'N/A'}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mt-6 mb-2">Time Interval</h3>

//                   <div className="bg-muted/30 rounded-lg p-4 space-y-4 border">
//                     <div className="flex items-start gap-3">
//                       <Calendar className="h-5 w-5 text-secondary mt-0.5" />
//                       <div>
//                         <p className="text-xs text-muted-foreground">Start Time</p>
//                         <p className="font-medium text-sm">{selectedReservation?.start_time}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       <Clock className="h-5 w-5 text-secondary mt-0.5" />
//                       <div>
//                         <p className="text-xs text-muted-foreground">End Time</p>
//                         <p className="font-medium text-sm">{selectedReservation?.end_time}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center text-center py-20 text-muted-foreground">
//               <div className="bg-muted rounded-full p-4 mb-4">
//                 <Clock className="h-8 w-8 text-muted-foreground/50" />
//               </div>
//               <p className="text-sm font-medium">
//                 Select a slot to view details
//               </p>
//               <p className="text-xs mt-1 max-w-[200px]">
//                 Click on any occupied or reserved slot to see who booked it.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSlotDetails;

import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, User, Mail, Phone, Calendar, Plus, RefreshCw, Loader } from "lucide-react";
import API from "@/lib/api";
import { useSlotMonitoring } from "@/hooks/useSlotMonitoring";
import { initSocket } from "@/lib/socket";

const AdminSlotDetails = () => {
  const { lotId } = useParams();
  const navigate = useNavigate();
  const socketInitialized = useRef(false);

  useEffect(() => {
    if (!socketInitialized.current) {
      initSocket();
      socketInitialized.current = true;
    }
  }, []);

  const [lot, setLot] = useState(null);
  const { slots, loading: loadingSlots, refetch, updateSlotStatus } = useSlotMonitoring(lotId, 5000);
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);

  // Fetch lot, reservations, users
  useEffect(() => {
    API.get("/parking-lots")
      .then(res => setLot(res.data.find(l => l.lot_id === lotId || l.id === lotId)))
      .catch(console.error);

    API.get("/admin/reservations")
      .then(res => setReservations(res.data))
      .catch(console.error);

    API.get("/admin/users")
      .then(res => setUsers(res.data))
      .catch(console.error);
  }, [lotId]);

  const selectedReservation = useMemo(() => {
    if (!selected || selected.status === "available") return null;
    return reservations.find(r => r.slot_id === (selected.slot_id || selected.id) && r.status === 'active') || null;
  }, [selected, reservations]);

  const usersMap = useMemo(() => {
    const map = {};
    users.forEach(user => { map[user.user_id] = user; });
    return map;
  }, [users]);

  const reservationUser = useMemo(() => {
    if (!selectedReservation) return null;
    return usersMap[selectedReservation.user_id] || null;
  }, [selectedReservation, usersMap]);

  const handleSlotStatusUpdate = async (newStatus) => {
    try {
      const slotId = selected.slot_id || selected.id;
      await API.put(`/admin/slots/${slotId}`, { status: newStatus });
      updateSlotStatus(slotId, newStatus);
      setSelected(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error('Failed to update slot status:', err);
    }
  };

  const handleAddSlot = async () => {
    try {
      const nextNumber = slots.length + 1;
      const nextLabel = `S-${nextNumber}`;
      await API.post('/admin/slots', {
        lot_id: lot.lot_id || lot.id,
        slot_number: nextNumber,
        label: nextLabel,
      });
      refetch();
    } catch (err) {
      console.error('Failed to add slot:', err);
    }
  };

  if (!lot) return (
    <div className="text-center py-20 text-muted-foreground">
      Parking lot not found.
    </div>
  );

  return (
    <div>
      <button
        onClick={() => navigate("/admin/lots")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Manage Lots
      </button>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">{lot.name} - Slot View</h1>
        <p className="text-muted-foreground mt-1">
          {lot.location} • {lot.total_slots || lot.totalSlots} Total Slots
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        {[ 
          { label: "Available", cls: "bg-success/20 border-success" },
          { label: "Occupied", cls: "bg-destructive/20 border-destructive" },
          { label: "Reserved", cls: "bg-warning/20 border-warning" }
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <div className={`w-4 h-4 rounded border-2 ${s.cls}`} />
            <span className="text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slot Grid */}
        <div className="lg:col-span-2 parking-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Parking Slots</h3>
            <button
              onClick={() => refetch()}
              className="p-1.5 hover:bg-muted rounded transition-colors"
              title="Refresh slots"
            >
              <RefreshCw className={`h-4 w-4 ${loadingSlots ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingSlots ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {slots.map(slot => {
                const id = slot.slot_id || slot.id;
                return (
                  <button
                    key={id}
                    onClick={() => setSelected(slot)}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${selected && (selected.slot_id || selected.id) === id
                      ? "ring-2 ring-primary ring-offset-2 bg-primary/20 border-2 border-primary text-primary shadow-md transform scale-105"
                      : slot.status === "available"
                        ? "slot-available hover:bg-success/30"
                        : slot.status === "occupied"
                          ? "slot-occupied hover:bg-destructive/30"
                          : "slot-reserved hover:bg-warning/30"
                      }`}
                  >
                    {slot.label || slot.slot_number}
                  </button>
                );
              })}

              {/* Add Slot Button */}
              <button
                onClick={handleAddSlot}
                className="aspect-square rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground transition-all group"
                title="Add New Slot"
              >
                <Plus className="h-6 w-6 group-hover:scale-125 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="parking-card p-5">
          {selected ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="gradient-bg rounded-lg p-2.5">
                  <CheckCircle className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Selected Slot</p>
                  <p className="font-bold text-lg">{selected.label || selected.slot_number}</p>
                </div>
                <div className="ml-auto">
                  <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                    selected.status === 'available' ? 'bg-success/20 text-success border border-success' :
                    selected.status === 'occupied' ? 'bg-destructive/20 text-destructive border border-destructive' :
                    'bg-warning/20 text-warning border border-warning'
                  }`}>
                    {selected.status}
                  </span>
                </div>
              </div>

              {selected.status === "available" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-3">
                  <CheckCircle className="h-12 w-12 text-success/50" />
                  <p>This slot is currently available.</p>
                  <p className="text-sm">No active reservations.</p>

                  <div className="mt-8 flex gap-3 w-full">
                    <button
                      onClick={() => handleSlotStatusUpdate('occupied')}
                      className="flex-1 bg-destructive/10 text-destructive hover:bg-destructive/20 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Mark Occupied
                    </button>
                    <button
                      onClick={() => handleSlotStatusUpdate('reserved')}
                      className="flex-1 bg-warning/10 text-warning hover:bg-warning/20 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Mark Reserved
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => handleSlotStatusUpdate('available')}
                      className="bg-success/10 text-success hover:bg-success/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Mark as Available
                    </button>
                  </div>

                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">Reservation Details</h3>

                  <div className="bg-muted/30 rounded-lg p-4 space-y-4 border">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">User Name</p>
                        <p className="font-medium">{reservationUser?.name || selectedReservation?.user_id}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium text-sm">{reservationUser?.email || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone Number</p>
                        <p className="font-medium text-sm">{reservationUser?.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mt-6 mb-2">Time Interval</h3>

                  <div className="bg-muted/30 rounded-lg p-4 space-y-4 border">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-secondary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Start Time</p>
                        <p className="font-medium text-sm">{selectedReservation?.start_time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-secondary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">End Time</p>
                        <p className="font-medium text-sm">{selectedReservation?.end_time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 text-muted-foreground">
              <div className="bg-muted rounded-full p-4 mb-4">
                <Clock className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium">Select a slot to view details</p>
              <p className="text-xs mt-1 max-w-[200px]">Click on any occupied or reserved slot to see who booked it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSlotDetails;