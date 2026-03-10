import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    API.get(`/users/${userId}`)
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.error('Failed to load profile', err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      })
      .finally(() => setLoading(false));
  }, [userId, navigate]);

  const handleChange = (field) => (e) => {
    setUser(u => ({ ...u, [field]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { name, phone } = user;
      await API.put(`/users/${userId}`, { name, phone });
      alert('Profile updated');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={user.name}
            onChange={handleChange('name')}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={user.email} disabled />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={user.phone}
            onChange={handleChange('phone')}
          />
        </div>
        <Button type="submit">Save changes</Button>
      </form>
    </div>
  );
};

export default Profile;