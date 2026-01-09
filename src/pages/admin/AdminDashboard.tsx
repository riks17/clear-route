import { Link } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Bus, MapPin, Navigation, Ticket } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

export default function AdminDashboard() {
  const { locations, buses, journeys, bookings } = useBooking();
  
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalSeats = journeys.reduce((acc, journey) => acc + journey.totalSeats, 0);
  const bookedSeats = journeys.reduce((acc, journey) => acc + journey.seats.filter(s => s.isBooked).length, 0);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage locations, buses, and journeys</p>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Locations</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                {locations.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Buses</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Bus className="h-6 w-6 text-primary" />
                {buses.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Journeys</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Navigation className="h-6 w-6 text-success" />
                {journeys.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Seats Booked</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Ticket className="h-6 w-6 text-success" />
                {bookedSeats}/{totalSeats}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Three Main Sections */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Locations Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Locations
              </CardTitle>
              <CardDescription>
                Manage pickup and drop points
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {locations.length} locations configured
              </div>
              <Button asChild className="w-full">
                <Link to="/admin/locations">Manage Locations</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Buses Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bus className="h-5 w-5" />
                Buses
              </CardTitle>
              <CardDescription>
                Physical bus assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {buses.length} buses registered
              </div>
              <Button asChild className="w-full">
                <Link to="/admin/buses">Manage Buses</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Journeys Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Journeys
              </CardTitle>
              <CardDescription>
                Routes users can book
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {journeys.length} active journeys
              </div>
              <Button asChild className="w-full">
                <Link to="/admin/journeys">Manage Journeys</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* View Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              All Bookings
            </CardTitle>
            <CardDescription>
              {confirmedBookings} active bookings across all journeys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/admin/bookings">View All Bookings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
