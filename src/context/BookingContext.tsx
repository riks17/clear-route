import React, { createContext, useContext, useState, useCallback } from 'react';
import { Bus, Booking, Seat } from '@/types';

interface BookingContextType {
  buses: Bus[];
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  createBus: (busNumber: string, source: string, destination: string, totalSeats: number) => Promise<boolean>;
  bookSeat: (busId: string, seatNumber: number, userId: string, userEmail: string) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  resetBus: (busId: string) => Promise<boolean>;
  getUserBookings: (userId: string) => Booking[];
  getBusById: (busId: string) => Bus | undefined;
  getAvailableSeatsCount: (busId: string) => number;
}

const BookingContext = createContext<BookingContextType | null>(null);

// Initial mock data
const initialBuses: Bus[] = [
  {
    id: 'bus-1',
    busNumber: 'BUS-001',
    source: 'New York',
    destination: 'Boston',
    totalSeats: 20,
    seats: Array.from({ length: 20 }, (_, i) => ({
      id: `bus-1-seat-${i + 1}`,
      seatNumber: i + 1,
      isBooked: i < 3, // First 3 seats pre-booked for demo
      bookedBy: i < 3 ? 'demo@example.com' : undefined,
    })),
  },
  {
    id: 'bus-2',
    busNumber: 'BUS-002',
    source: 'Boston',
    destination: 'Philadelphia',
    totalSeats: 16,
    seats: Array.from({ length: 16 }, (_, i) => ({
      id: `bus-2-seat-${i + 1}`,
      seatNumber: i + 1,
      isBooked: false,
    })),
  },
  {
    id: 'bus-3',
    busNumber: 'BUS-003',
    source: 'Philadelphia',
    destination: 'Washington DC',
    totalSeats: 24,
    seats: Array.from({ length: 24 }, (_, i) => ({
      id: `bus-3-seat-${i + 1}`,
      seatNumber: i + 1,
      isBooked: i % 5 === 0, // Every 5th seat booked
      bookedBy: i % 5 === 0 ? 'demo@example.com' : undefined,
    })),
  },
];

const initialBookings: Booking[] = [
  {
    id: 'booking-1',
    busId: 'bus-1',
    busNumber: 'BUS-001',
    seatNumber: 1,
    userId: 'demo@example.com',
    userEmail: 'demo@example.com',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    route: 'New York → Boston',
  },
  {
    id: 'booking-2',
    busId: 'bus-1',
    busNumber: 'BUS-001',
    seatNumber: 2,
    userId: 'demo@example.com',
    userEmail: 'demo@example.com',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    route: 'New York → Boston',
  },
];

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [buses, setBuses] = useState<Bus[]>(initialBuses);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBus = useCallback(async (
    busNumber: string,
    source: string,
    destination: string,
    totalSeats: number
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newBus: Bus = {
        id: `bus-${Date.now()}`,
        busNumber,
        source,
        destination,
        totalSeats,
        seats: Array.from({ length: totalSeats }, (_, i) => ({
          id: `bus-${Date.now()}-seat-${i + 1}`,
          seatNumber: i + 1,
          isBooked: false,
        })),
      };

      setBuses(prev => [...prev, newBus]);
      return true;
    } catch {
      setError('Failed to create bus');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const bookSeat = useCallback(async (
    busId: string,
    seatNumber: number,
    userId: string,
    userEmail: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const bus = buses.find(b => b.id === busId);
      if (!bus) {
        setError('Bus not found');
        return false;
      }

      const seat = bus.seats.find(s => s.seatNumber === seatNumber);
      if (!seat) {
        setError('Seat not found');
        return false;
      }

      if (seat.isBooked) {
        setError('Seat is already booked');
        return false;
      }

      // Update seat
      setBuses(prev => prev.map(b => {
        if (b.id !== busId) return b;
        return {
          ...b,
          seats: b.seats.map(s => {
            if (s.seatNumber !== seatNumber) return s;
            return { ...s, isBooked: true, bookedBy: userId };
          }),
        };
      }));

      // Create booking
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        busId,
        busNumber: bus.busNumber,
        seatNumber,
        userId,
        userEmail,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        route: `${bus.source} → ${bus.destination}`,
      };

      setBookings(prev => [...prev, newBooking]);
      return true;
    } catch {
      setError('Failed to book seat');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [buses]);

  const cancelBooking = useCallback(async (bookingId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) {
        setError('Booking not found');
        return false;
      }

      if (booking.status === 'cancelled') {
        setError('Booking is already cancelled');
        return false;
      }

      // Update booking status
      setBookings(prev => prev.map(b => {
        if (b.id !== bookingId) return b;
        return { ...b, status: 'cancelled' };
      }));

      // Free the seat
      setBuses(prev => prev.map(bus => {
        if (bus.id !== booking.busId) return bus;
        return {
          ...bus,
          seats: bus.seats.map(s => {
            if (s.seatNumber !== booking.seatNumber) return s;
            return { ...s, isBooked: false, bookedBy: undefined };
          }),
        };
      }));

      return true;
    } catch {
      setError('Failed to cancel booking');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [bookings]);

  const resetBus = useCallback(async (busId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Reset all seats to available
      setBuses(prev => prev.map(bus => {
        if (bus.id !== busId) return bus;
        return {
          ...bus,
          seats: bus.seats.map(s => ({ ...s, isBooked: false, bookedBy: undefined })),
        };
      }));

      // Cancel all bookings for this bus
      setBookings(prev => prev.map(b => {
        if (b.busId !== busId) return b;
        return { ...b, status: 'cancelled' };
      }));

      return true;
    } catch {
      setError('Failed to reset bus');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserBookings = useCallback((userId: string): Booking[] => {
    return bookings.filter(b => b.userId === userId);
  }, [bookings]);

  const getBusById = useCallback((busId: string): Bus | undefined => {
    return buses.find(b => b.id === busId);
  }, [buses]);

  const getAvailableSeatsCount = useCallback((busId: string): number => {
    const bus = buses.find(b => b.id === busId);
    if (!bus) return 0;
    return bus.seats.filter(s => !s.isBooked).length;
  }, [buses]);

  return (
    <BookingContext.Provider value={{
      buses,
      bookings,
      isLoading,
      error,
      createBus,
      bookSeat,
      cancelBooking,
      resetBus,
      getUserBookings,
      getBusById,
      getAvailableSeatsCount,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
