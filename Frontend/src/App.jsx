import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import UserLayout from "./components/UserLayout";
import AdminLayout from "./components/AdminLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import SlotBooking from "./pages/SlotBooking";
import MyReservations from "./pages/MyReservations";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManageLots from "./pages/ManageLots";
import AdminReservations from "./pages/AdminReservations";
import ManageUsers from "./pages/ManageUsers";
import AdminSlotDetails from "./pages/AdminSlotDetails";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminLogin />} />

            {/* User */}
            <Route element={<UserLayout />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/slots/:lotId" element={<SlotBooking />} />
              <Route path="/reservations" element={<MyReservations />} />
            </Route>

            {/* Admin */}
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/lots" element={<ManageLots />} />
              <Route path="/admin/lots/:lotId/slots" element={<AdminSlotDetails />} />
              <Route path="/admin/reservations" element={<AdminReservations />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;