import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Car,
  LayoutDashboard,
  ParkingSquare,
  Grid3X3,
  CalendarCheck,
  Users,
  LogOut,
  Menu,
  ChevronLeft
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Parking Lots", path: "/admin/lots", icon: ParkingSquare },
  { label: "Manage Slots", path: "/admin/slots", icon: Grid3X3 },
  { label: "Reservations", path: "/admin/reservations", icon: CalendarCheck },
  { label: "Users", path: "/admin/users", icon: Users }
];

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
        <div className="gradient-bg rounded-lg p-2 shrink-0">
          <Car className="h-5 w-5 text-primary-foreground" />
        </div>

        {!collapsed && (
          <span className="text-lg font-bold text-sidebar-foreground">
            Admin Panel
          </span>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              location.pathname === item.path
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <item.icon className="h-5 w-5 shrink-0" />

            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border">
        <button
          onClick={() => {
            setMobileOpen(false);
            navigate("/admin");
          }}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-red-400 hover:bg-sidebar-accent"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <SidebarContent />

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-5 hidden md:flex items-center justify-center h-6 w-6 rounded-full"
          style={{ left: collapsed ? 52 : 248 }}
        >
          <ChevronLeft
            className={`h-3 w-3 ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/50"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="relative w-64 h-full flex flex-col bg-sidebar">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 h-14 flex items-center border-b px-4">
          <button
            className="md:hidden p-2 -ml-2 mr-2"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <h2 className="text-sm font-medium text-muted-foreground">
            {sidebarItems.find((i) => i.path === location.pathname)?.label ||
              "Admin"}
          </h2>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;