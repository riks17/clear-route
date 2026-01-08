import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Bus, Ticket, LogOut, User } from 'lucide-react';

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
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
            <Link to="/user/buses" className="flex items-center gap-2 font-semibold">
              <Bus className="h-5 w-5 text-primary" />
              <span>Bus Booking</span>
            </Link>
            
            <nav className="flex items-center gap-4">
              <Link 
                to="/user/buses" 
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5"
              >
                <Bus className="h-4 w-4" />
                Browse Buses
              </Link>
              <Link 
                to="/user/tickets" 
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5"
              >
                <Ticket className="h-4 w-4" />
                My Tickets
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
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
