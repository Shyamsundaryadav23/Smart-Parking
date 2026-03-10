import { useState, useEffect } from "react";
import { Trash2, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "@/lib/api";
import { toast } from "sonner";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('failed to load users', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await API.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.user_id !== userId));
      toast.success('User deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete user');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No users found
        </div>
      )}

      {!loading && users.length > 0 && (
        <div className="parking-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">User ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phone</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.user_id || u.id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs">{u.user_id || u.id}</td>
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.phone || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8"
                        onClick={() => deleteUser(u.user_id || u.id)}
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
      )}
    </div>
  );
};

export default ManageUsers;