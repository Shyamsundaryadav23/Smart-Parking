import { useState, useMemo } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parkingLots, generateSlots } from "@/data/mockData";
import { toast } from "sonner";

const ManageSlots = () => {
  const initialSlots = useMemo(
    () =>
      parkingLots.flatMap((lot) =>
        generateSlots(lot.id, lot.totalSlots).slice(0, 8)
      ),
    []
  );

  const [slots, setSlots] = useState(initialSlots);

  const cycleStatus = (id) => {
    const order = ["available", "occupied", "reserved"];

    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;

        const next = order[(order.indexOf(s.status) + 1) % 3];

        return { ...s, status: next };
      })
    );

    toast.success("Slot status updated");
  };

  const addSlot = () => {
    const lot = parkingLots[0];

    const newSlot = {
      id: `${lot.id}-slot-${Date.now()}`,
      lotId: lot.id,
      label: `S${slots.length + 1}`,
      status: "available",
    };

    setSlots([...slots, newSlot]);
    toast.success("Slot added");
  };

  const statusBadge = (status) => {
    const styles = {
      available: "bg-success/15 text-success",
      occupied: "bg-destructive/15 text-destructive",
      reserved: "bg-warning/15 text-warning",
    };

    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Slots</h1>

        <Button
          className="gradient-bg text-primary-foreground hover:opacity-90"
          onClick={addSlot}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Slot
        </Button>
      </div>

      <div className="parking-card overflow-hidden">
        <div className="overflow-x-auto">

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Slot ID
                </th>

                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Lot ID
                </th>

                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Label
                </th>

                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>

                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {slots.map((slot) => (
                <tr
                  key={slot.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs">{slot.id}</td>

                  <td className="px-4 py-3 font-mono text-xs">{slot.lotId}</td>

                  <td className="px-4 py-3 font-medium">{slot.label}</td>

                  <td className="px-4 py-3">{statusBadge(slot.status)}</td>

                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-primary hover:text-primary hover:bg-primary/10 h-8"
                      onClick={() => cycleStatus(slot.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageSlots;