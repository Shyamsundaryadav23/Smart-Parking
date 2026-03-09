import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, User, Mail, Phone, Calendar, Plus } from "lucide-react";
import { parkingLots, generateSlots, reservations, users } from "@/data/mockData";

const AdminSlotDetails = () => {
  const { lotId } = useParams();
  const navigate = useNavigate();

  const lot = parkingLots.find((l) => l.id === lotId);

  const [slots, setSlots] = useState(() => {
    return generateSlots(lotId || "", lot?.totalSlots || 20);
  });

  const [selected, setSelected] = useState(null);

  // Find reservation details if the selected slot is occupied or reserved
  const selectedReservation = useMemo(() => {
    if (!selected) return null;
    if (selected.status === "available") return null;

    // Use mock data to find an active/completed reservation matching this lot and roughly the slot
    // Since mock generation is random, we'll try to find a reservation in the mock data
    // For a real app, API would fetch exactly this slot's current reservation.
    // In mock data, slot labels like S3 might map to 'lot-1-slot-3'
    const res = reservations.find(r => r.slotId === selected.id && r.status === "active");

    // Fallback: If no mock reservation exactly matches, generate a fake detail for demonstration
    // because generateSlots creates random statuses every mount.
    if (!res) {
      const mockUser = users[Math.floor(Math.random() * users.length)];
      return {
        userName: mockUser.name,
        userEmail: mockUser.email,
        userPhone: mockUser.phone,
        startTime: "2026-03-09 10:00",
        endTime: "2026-03-09 14:00",
      }
    }

    const userDetails = users.find(u => u.id === res.userId) || {};

    return {
      userName: res.userName,
      userEmail: userDetails.email || "N/A",
      userPhone: userDetails.phone || "N/A",
      startTime: res.startTime,
      endTime: res.endTime
    };
  }, [selected]);

  const updateSlotStatus = (newStatus) => {
    setSlots(currentSlots =>
      currentSlots.map(s =>
        s.id === selected.id ? { ...s, status: newStatus } : s
      )
    );
    setSelected(prev => ({ ...prev, status: newStatus }));
  };

  const addSlot = () => {
    // Find the next label number
    let maxNumber = 0;
    slots.forEach(s => {
      const numMatch = s.label.match(/\d+/);
      if (numMatch) {
        const num = parseInt(numMatch[0]);
        if (num > maxNumber) maxNumber = num;
      }
    });

    const newLabel = `S${maxNumber + 1}`;
    const newSlot = {
      id: `${lot.id}-slot-${Date.now()}`,
      lotId: lot.id,
      label: newLabel,
      status: "available",
    };

    setSlots(currentSlots => [...currentSlots, newSlot]);
  };

  if (!lot)
    return (
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
          {lot.location} • {lot.totalSlots} Total Slots
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        {[
          { label: "Available", cls: "bg-success/20 border-success" },
          { label: "Occupied", cls: "bg-destructive/20 border-destructive" },
          { label: "Reserved", cls: "bg-warning/20 border-warning" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <div className={`w-4 h-4 rounded border-2 ${s.cls}`} />
            <span className="text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slot Grid */}
        <div className="lg:col-span-2 parking-card p-5">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelected(slot)}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${selected?.id === slot.id
                  ? "ring-2 ring-primary ring-offset-2 bg-primary/20 border-2 border-primary text-primary shadow-md transform scale-105"
                  : slot.status === "available"
                    ? "slot-available hover:bg-success/30"
                    : slot.status === "occupied"
                      ? "slot-occupied hover:bg-destructive/30"
                      : "slot-reserved hover:bg-warning/30"
                  }`}
              >
                {slot.label}
              </button>
            ))}

            {/* Add Slot Button */}
            <button
              onClick={addSlot}
              className="aspect-square rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground transition-all group"
              title="Add New Slot"
            >
              <Plus className="h-6 w-6 group-hover:scale-125 transition-transform" />
            </button>
          </div>
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
                  <p className="text-sm text-muted-foreground">
                    Selected Slot
                  </p>
                  <p className="font-bold text-lg">{selected.label}</p>
                </div>
                <div className="ml-auto">
                  <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${selected.status === 'available' ? 'bg-success/20 text-success border border-success' :
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
                      onClick={() => updateSlotStatus('occupied')}
                      className="flex-1 bg-destructive/10 text-destructive hover:bg-destructive/20 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Mark Occupied
                    </button>
                    <button
                      onClick={() => updateSlotStatus('reserved')}
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
                      onClick={() => updateSlotStatus('available')}
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
                        <p className="font-medium">{selectedReservation?.userName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium text-sm">{selectedReservation?.userEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone Number</p>
                        <p className="font-medium text-sm">{selectedReservation?.userPhone}</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mt-6 mb-2">Time Interval</h3>

                  <div className="bg-muted/30 rounded-lg p-4 space-y-4 border">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-secondary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Start Time</p>
                        <p className="font-medium text-sm">{selectedReservation?.startTime}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-secondary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">End Time</p>
                        <p className="font-medium text-sm">{selectedReservation?.endTime}</p>
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
              <p className="text-sm font-medium">
                Select a slot to view details
              </p>
              <p className="text-xs mt-1 max-w-[200px]">
                Click on any occupied or reserved slot to see who booked it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSlotDetails;
