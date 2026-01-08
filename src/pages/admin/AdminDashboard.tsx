import { Link } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Bus, Ticket } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

export default function AdminDashboard() {
  const { buses, bookings } = useBooking();
  
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalSeats = buses.reduce((acc, bus) => acc + bus.totalSeats, 0);
  const bookedSeats = buses.reduce((acc, bus) => acc + bus.seats.filter(s => s.isBooked).length, 0);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage buses and view bookings</p>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Buses</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Bus className="h-6 w-6 text-primary" />
                {buses.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Bookings</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Ticket className="h-6 w-6 text-success" />
                {confirmedBookings}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Seats</CardDescription>
              <CardTitle className="text-3xl">{totalSeats}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Seats Booked</CardDescription>
              <CardTitle className="text-3xl">{bookedSeats}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Bus
              </CardTitle>
              <CardDescription>
                Add a new bus to the system with seat configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/admin/create-bus">Create Bus</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                View All Bookings
              </CardTitle>
              <CardDescription>
                See all ticket sales and booking statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/bookings">View Bookings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bus List with Reset Option */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Manage Buses</h2>
          {buses.length === 0 ? (
            <p className="text-muted-foreground text-sm">No buses created yet.</p>
          ) : (
            <div className="grid gap-2">
              {buses.map((bus) => {
                const bookedCount = bus.seats.filter(s => s.isBooked).length;
                return (
                  <Card key={bus.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{bus.busNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {bus.source} → {bus.destination} • {bookedCount}/{bus.totalSeats} seats booked
                        </p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/admin/bus/${bus.id}`}>Manage</Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
