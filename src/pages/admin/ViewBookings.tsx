import { Link } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/StateIndicators';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

export default function ViewBookings() {
  const { bookings } = useBooking();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold">All Bookings</h1>
            <p className="text-muted-foreground">View all ticket sales across the system</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <EmptyState
            title="No bookings yet"
            description="There are no bookings in the system yet."
          />
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Email</TableHead>
                  <TableHead>Bus Number</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Seat</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.userEmail}</TableCell>
                    <TableCell>{booking.busNumber}</TableCell>
                    <TableCell className="text-muted-foreground">{booking.route}</TableCell>
                    <TableCell>#{booking.seatNumber}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={booking.status === 'confirmed' ? 'status-confirmed' : 'status-cancelled'}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
