import { useState, useEffect } from "react";
import { CalendarCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "@/lib/api";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const { notifyReservationCancelled } = useNotifications();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      API.get(`/users/${userId}/reservations`)
        .then(res => setReservations(res.data))
        .catch(err => console.error('Failed to load reservations', err));
    }
  }, []);

  const cancelReservation = async (id) => {
    try {
      await API.delete(`/reservations/${id}`);
      setReservations((prev) =>
        prev.map((r) => (r.reservation_id === id ? { ...r, status: 'cancelled' } : r))
      );
      notifyReservationCancelled();
    } catch (err) {
      console.error(err);
      toast.error('Could not cancel reservation');
    }
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
                  <td className="px-4 py-3 font-medium">{r.reservation_id}</td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {r.lotName || r.lot_id}
                  </td>

                  <td className="px-4 py-3">{r.slot_id}</td>

                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {r.start_time} – {r.end_time}
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