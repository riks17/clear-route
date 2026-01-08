import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Bus Ticket Booking</h1>
          <p className="text-muted-foreground">
            Select your portal to continue
          </p>
        </div>

        {/* Portal Selection */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* User Portal */}
          <Card className="hover:border-primary transition-colors">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Bus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Passenger</CardTitle>
              <CardDescription>
                Browse buses, book seats, and manage your tickets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/user/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/user/signup">Create Account</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Admin Portal */}
          <Card className="hover:border-admin-accent transition-colors">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-admin-accent/10 flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-admin-accent" />
              </div>
              <CardTitle>Administrator</CardTitle>
              <CardDescription>
                Manage buses, view bookings, and control operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-admin-accent hover:bg-admin-accent/90">
                <Link to="/admin/login">Admin Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Demo credentials hint */}
        <div className="text-center text-sm text-muted-foreground p-4 bg-muted rounded-lg">
          <p className="font-medium mb-1">Demo Credentials</p>
          <p>Admin: admin@busbook.com / admin123</p>
          <p>User: Any email / any password (auto-creates account)</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
