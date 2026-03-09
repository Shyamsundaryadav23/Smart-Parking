import { useState } from "react";
import { CalendarCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reservations as initialReservations } from "@/data/mockData";
import { toast } from "sonner";

const MyReservations = () => {
  const [reservations, setReservations] = useState(
    initialReservations.filter((r) => r.userId === "u1")
  );

  const cancelReservation = (id) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "cancelled" } : r
      )
    );

    toast.success("Reservation cancelled");
  };

  const statusBadge = (status) => {
    const styles = {
      active: "bg-success/15 text-success",
      completed: "bg-primary/15 text-primary",
      cancelled: "bg-destructive/15 text-destructive",
    };

    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
          styles[status] || ""
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="gradient-bg rounded-lg p-2.5">
          <CalendarCheck className="h-5 w-5 text-primary-foreground" />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Reservations</h1>
          <p className="text-muted-foreground text-sm">
            View and manage your parking reservations
          </p>
        </div>
      </div>

      <div className="parking-card overflow-hidden">
        <div className="overflow-x-auto">

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Reservation ID
                </th>

                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Location
                </th>

                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Slot
                </th>

                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Time
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
              {reservations.map((r) => (
                <tr
                  key={r.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{r.id}</td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {r.lotName}
                  </td>

                  <td className="px-4 py-3">{r.slotLabel}</td>

                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {r.startTime} – {r.endTime}
                  </td>

                  <td className="px-4 py-3">
                    {statusBadge(r.status)}
                  </td>

                  <td className="px-4 py-3">
                    {r.status === "active" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8"
                        onClick={() => cancelReservation(r.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}
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

export default MyReservations;