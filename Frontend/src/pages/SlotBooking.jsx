import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parkingLots, generateSlots } from "@/data/mockData";
import { toast } from "sonner";

const SlotBooking = () => {
  const { lotId } = useParams();
  const navigate = useNavigate();

  const lot = parkingLots.find((l) => l.id === lotId);

  const slots = useMemo(() => {
    return generateSlots(lotId || "", lot?.totalSlots || 20);
  }, [lotId, lot?.totalSlots]);

  const [selected, setSelected] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleBook = (e) => {
    e.preventDefault();

    toast.success(`Slot ${selected?.label} booked successfully!`);

    setSelected(null);
    setStartTime("");
    setEndTime("");
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
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">{lot.name}</h1>
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
                disabled={slot.status !== "available"}
                onClick={() => setSelected(slot)}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${
                  selected?.id === slot.id
                    ? "ring-2 ring-primary ring-offset-2 bg-primary/20 border-2 border-primary text-primary"
                    : slot.status === "available"
                    ? "slot-available"
                    : slot.status === "occupied"
                    ? "slot-occupied"
                    : "slot-reserved"
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <div className="parking-card p-5">
          {selected ? (
            <form onSubmit={handleBook} className="space-y-5">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="start">Start Time</Label>

                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="start"
                    type="datetime-local"
                    className="pl-10"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end">End Time</Label>

                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="end"
                    type="datetime-local"
                    className="pl-10"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button className="w-full gradient-bg text-primary-foreground hover:opacity-90">
                Book Slot
              </Button>
            </form>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p className="text-sm">
                Select an available slot to book
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotBooking;