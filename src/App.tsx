import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { BookingProvider } from "@/context/BookingContext";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// User pages
import UserLogin from "./pages/user/UserLogin";
import UserSignup from "./pages/user/UserSignup";
import BusList from "./pages/user/BusList";
import SeatSelection from "./pages/user/SeatSelection";
import MyTickets from "./pages/user/MyTickets";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateBus from "./pages/admin/CreateBus";
import ViewBookings from "./pages/admin/ViewBookings";
import ManageBus from "./pages/admin/ManageBus";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BookingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
              
              {/* User auth routes */}
              <Route path="/user/login" element={<PublicRoute><UserLogin /></PublicRoute>} />
              <Route path="/user/signup" element={<PublicRoute><UserSignup /></PublicRoute>} />
              
              {/* Admin auth route */}
              <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
              
              {/* Protected user routes */}
              <Route path="/user/buses" element={
                <ProtectedRoute requiredRole="user"><BusList /></ProtectedRoute>
              } />
              <Route path="/user/bus/:busId" element={
                <ProtectedRoute requiredRole="user"><SeatSelection /></ProtectedRoute>
              } />
              <Route path="/user/tickets" element={
                <ProtectedRoute requiredRole="user"><MyTickets /></ProtectedRoute>
              } />
              
              {/* Protected admin routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/create-bus" element={
                <ProtectedRoute requiredRole="admin"><CreateBus /></ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute requiredRole="admin"><ViewBookings /></ProtectedRoute>
              } />
              <Route path="/admin/bus/:busId" element={
                <ProtectedRoute requiredRole="admin"><ManageBus /></ProtectedRoute>
              } />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BookingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
