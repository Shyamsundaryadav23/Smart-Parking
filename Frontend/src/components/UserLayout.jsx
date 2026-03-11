import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Car, LayoutDashboard, CalendarCheck, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "My Reservations", path: "/reservations", icon: CalendarCheck },
  { label: "Profile", path: "/profile", icon: Car }
];

function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate, location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">

          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="gradient-bg rounded-lg p-2">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>

            <span className="text-xl font-bold gradient-text">
              Smart Parking
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}

            <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('userId');
                  navigate("/login");
                }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ml-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="md:hidden border-t bg-card px-4 py-2 space-y-1">

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}

            <button
              onClick={() => {
                setMenuOpen(false);                localStorage.removeItem('token');
                localStorage.removeItem('userId');                navigate("/login");
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>

          </nav>
        )}

      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

    </div>
  );
}

export default UserLayout;