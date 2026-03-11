import { useState, useEffect } from "react";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "@/lib/api";
import { toast } from "sonner";

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    API.get('/admin/reservations')
      .then(res => setReservations(res.data))
      .catch(err => console.error('failed to load reservations', err));
  }, []);

  const cancel = async (id) => {
    try {
      await API.delete(`/reservations/${id}`);
      setReservations((prev) =>
        prev.map((r) =>
          r.reservation_id === id ? { ...r, status: "cancelled" } : r
        )
      );
      toast.success("Reservation cancelled");
    } catch (err) {
      console.error(err);
      toast.error('Could not cancel');
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
        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Reservations</h1>

      <div className="parking-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Slot</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Time</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>

            <tbody>
              {reservations.map((r) => (
                <tr
                  key={r.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{r.reservation_id}</td>
                  <td className="px-4 py-3">{r.user_id}</td>

                  <td className="px-4 py-3">
                    {r.slot_id} ({r.lot_id})
                  </td>

                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {r.start_time} – {r.end_time}
                  </td>

                  <td className="px-4 py-3">{statusBadge(r.status)}</td>

                  <td className="px-4 py-3">
                    {r.status === "active" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8"
                        onClick={() => cancel(r.id)}
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

export default AdminReservations;