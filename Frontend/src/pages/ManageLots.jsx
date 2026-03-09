import { useState } from "react";
import { Plus, Trash2, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parkingLots as initialLots } from "@/data/mockData";
import { toast } from "sonner";

const ManageLots = () => {
  const [lots, setLots] = useState(initialLots);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", totalSlots: "" });

  const addLot = (e) => {
    e.preventDefault();

    const newLot = {
      id: `lot-${Date.now()}`,
      name: form.name,
      location: form.location,
      totalSlots: parseInt(form.totalSlots),
      availableSlots: parseInt(form.totalSlots),
    };

    setLots([...lots, newLot]);
    setForm({ name: "", location: "", totalSlots: "" });
    setShowForm(false);

    toast.success("Parking lot added");
  };

  const deleteLot = (id) => {
    setLots(lots.filter((l) => l.id !== id));
    toast.success("Parking lot deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Parking Lots</h1>

        <Button
          className="gradient-bg text-primary-foreground hover:opacity-90"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Lot
        </Button>
      </div>

      {showForm && (
        <div className="parking-card p-5 mb-6">
          <form onSubmit={addLot} className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Lot name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="Location"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Total Slots</Label>

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Slots"
                  value={form.totalSlots}
                  onChange={(e) =>
                    setForm({ ...form, totalSlots: e.target.value })
                  }
                  required
                />

                <Button
                  type="submit"
                  className="gradient-bg text-primary-foreground hover:opacity-90 shrink-0"
                >
                  Add
                </Button>
              </div>
            </div>

          </form>
        </div>
      )}

      <div className="parking-card overflow-hidden">
        <div className="overflow-x-auto">

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Lot ID
                </th>

                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Name
                </th>

                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Location
                </th>

                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Total Slots
                </th>

                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {lots.map((lot) => (
                <tr
                  key={lot.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs">{lot.id}</td>

                  <td className="px-4 py-3 font-medium">{lot.name}</td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {lot.location}
                  </td>

                  <td className="px-4 py-3">{lot.totalSlots}</td>

                  <td className="px-4 py-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-primary hover:text-primary hover:bg-primary/10 h-8"
                      onClick={() => window.location.href = `/admin/lots/${lot.id}/slots`}
                    >
                      <Grid3X3 className="h-4 w-4 mr-1" />
                      Layout
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8"
                      onClick={() => deleteLot(lot.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
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

export default ManageLots;