import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || 'Registration failed');
    }
  };

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const fields = [
    { id: "name", label: "Full Name", type: "text", placeholder: "John Doe", icon: User },
    { id: "email", label: "Email", type: "email", placeholder: "you@example.com", icon: Mail },
    { id: "phone", label: "Phone Number", type: "tel", placeholder: "+1 234 567 890", icon: Phone },
    { id: "password", label: "Password", type: "password", placeholder: "••••••••", icon: Lock },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex gradient-bg rounded-2xl p-3 mb-4">
            <Car className="h-8 w-8 text-primary-foreground" />
          </div>

          <h1 className="text-3xl font-bold gradient-text">Create Account</h1>
          <p className="text-muted-foreground mt-2">
            Join Smart Parking today
          </p>
        </div>

        <div className="parking-card p-8">
          <form onSubmit={handleRegister} className="space-y-4">

            {fields.map((f) => (
              <div key={f.id} className="space-y-2">

                <Label htmlFor={f.id}>{f.label}</Label>

                <div className="relative">
                  <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    id={f.id}
                    type={f.type}
                    placeholder={f.placeholder}
                    className="pl-10"
                    value={form[f.id]}
                    onChange={update(f.id)}
                  />
                </div>

              </div>
            ))}

            <Button
              type="submit"
              className="w-full gradient-bg text-primary-foreground hover:opacity-90 transition-opacity mt-2"
            >
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?
            </span>{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;