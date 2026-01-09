import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, MapPin, Bus, Navigation, FileText, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin/dashboard" className="flex items-center gap-2 font-semibold">
              <Shield className="h-5 w-5 text-admin-accent" />
              <span>Admin Panel</span>
              <Badge className="admin-indicator text-xs">ADMIN</Badge>
            </Link>
            
            <nav className="hidden md:flex items-center gap-4">
              <Link 
                to="/admin/locations" 
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5"
              >
                <MapPin className="h-4 w-4" />
                Locations
              </Link>
              <Link 
                to="/admin/buses" 
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5"
              >
                <Bus className="h-4 w-4" />
                Buses
              </Link>
              <Link 
                to="/admin/journeys" 
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5"
              >
                <Navigation className="h-4 w-4" />
                Journeys
              </Link>
              <Link 
                to="/admin/bookings" 
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5"
              >
                <FileText className="h-4 w-4" />
                Bookings
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
