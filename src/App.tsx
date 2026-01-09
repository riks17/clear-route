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
import JourneyList from "./pages/user/JourneyList";
import SeatSelection from "./pages/user/SeatSelection";
import MyTickets from "./pages/user/MyTickets";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageLocations from "./pages/admin/ManageLocations";
import ManageBuses from "./pages/admin/ManageBuses";
import ManageJourneys from "./pages/admin/ManageJourneys";
import ManageJourney from "./pages/admin/ManageJourney";
import ViewBookings from "./pages/admin/ViewBookings";

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
              <Route path="/user/journeys" element={
                <ProtectedRoute requiredRole="user"><JourneyList /></ProtectedRoute>
              } />
              <Route path="/user/journey/:journeyId" element={
                <ProtectedRoute requiredRole="user"><SeatSelection /></ProtectedRoute>
              } />
              <Route path="/user/tickets" element={
                <ProtectedRoute requiredRole="user"><MyTickets /></ProtectedRoute>
              } />
              
              {/* Protected admin routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/locations" element={
                <ProtectedRoute requiredRole="admin"><ManageLocations /></ProtectedRoute>
              } />
              <Route path="/admin/buses" element={
                <ProtectedRoute requiredRole="admin"><ManageBuses /></ProtectedRoute>
              } />
              <Route path="/admin/journeys" element={
                <ProtectedRoute requiredRole="admin"><ManageJourneys /></ProtectedRoute>
              } />
              <Route path="/admin/journey/:journeyId" element={
                <ProtectedRoute requiredRole="admin"><ManageJourney /></ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute requiredRole="admin"><ViewBookings /></ProtectedRoute>
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
