import React, { createContext, useContext, useState, useCallback } from 'react';
import { Bus, BusCapacity, Booking, Seat, Location, Journey } from '@/types';

// Helper to generate realistic bus seat layout
function generateSeats(capacity: BusCapacity): Seat[] {
  const seats: Seat[] = [];
  const seatsPerRow = 4;
  const totalRows = capacity / seatsPerRow;
  const positions: Seat['position'][] = ['window-left', 'aisle-left', 'aisle-right', 'window-right'];
  
  let seatNumber = 1;
  for (let row = 1; row <= totalRows; row++) {
    for (let posIndex = 0; posIndex < 4; posIndex++) {
      seats.push({
        id: `seat-${seatNumber}`,
        seatNumber,
        isBooked: false,
        row,
        position: positions[posIndex],
      });
      seatNumber++;
    }
  }
  return seats;
}

// Helper to get position label
function getSeatPositionLabel(seat: Seat): string {
  const side = seat.position.includes('left') ? 'L' : 'R';
  const type = seat.position.includes('window') ? 'W' : 'A';
  return `Row ${seat.row}, ${type}${side}`;
}

interface BookingContextType {
  // Data
  locations: Location[];
  buses: Bus[];
  journeys: Journey[];
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  
  // Location actions
  addLocation: (name: string) => Promise<boolean>;
  
  // Bus actions
  createBus: (busNumber: string, capacity: BusCapacity) => Promise<boolean>;
  getBusById: (busId: string) => Bus | undefined;
  
  // Journey actions
  createJourney: (busId: string, sourceId: string, destinationId: string) => Promise<boolean>;
  getJourneyById: (journeyId: string) => Journey | undefined;
  getAvailableSeatsCount: (journeyId: string) => number;
  resetJourney: (journeyId: string) => Promise<boolean>;
  
  // Auto-fill helpers
  getJourneyByBus: (busId: string) => Journey | undefined;
  findBusForRoute: (sourceId: string, destinationId: string) => Bus | undefined;
  isBusAssignedToJourney: (busId: string) => boolean;
  
  // Booking actions
  bookSeat: (journeyId: string, seatNumber: number, userId: string, userEmail: string) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  getUserBookings: (userId: string) => Booking[];
}

const BookingContext = createContext<BookingContextType | null>(null);

// Mumbai commuter locations
const initialLocations: Location[] = [
  { id: 'loc-1', name: 'Thane' },
  { id: 'loc-2', name: 'Ghatkopar' },
  { id: 'loc-3', name: 'Marol Naka' },
  { id: 'loc-4', name: 'Andheri' },
  { id: 'loc-5', name: 'Saki Naka' },
];

// Initial buses (physical assets)
const initialBuses: Bus[] = [
  { id: 'bus-1', busNumber: 'MH-04-AB-1234', capacity: 20 },
  { id: 'bus-2', busNumber: 'MH-04-CD-5678', capacity: 16 },
  { id: 'bus-3', busNumber: 'MH-04-EF-9012', capacity: 28 },
];

// Initial journeys (routes users can book)
const initialJourneys: Journey[] = [
  {
    id: 'journey-1',
    busId: 'bus-1',
    busNumber: 'MH-04-AB-1234',
    sourceId: 'loc-1',
    sourceName: 'Thane',
    destinationId: 'loc-2',
    destinationName: 'Ghatkopar',
    totalSeats: 20,
    seats: generateSeats(20).map((seat, i) => ({
      ...seat,
      id: `journey-1-seat-${seat.seatNumber}`,
      isBooked: i < 3, // First 3 seats pre-booked for demo
      bookedBy: i < 3 ? 'user@example.com' : undefined,
    })),
  },
  {
    id: 'journey-2',
    busId: 'bus-2',
    busNumber: 'MH-04-CD-5678',
    sourceId: 'loc-2',
    sourceName: 'Ghatkopar',
    destinationId: 'loc-4',
    destinationName: 'Andheri',
    totalSeats: 16,
    seats: generateSeats(16).map(seat => ({
      ...seat,
      id: `journey-2-seat-${seat.seatNumber}`,
    })),
  },
  {
    id: 'journey-3',
    busId: 'bus-3',
    busNumber: 'MH-04-EF-9012',
    sourceId: 'loc-5',
    sourceName: 'Saki Naka',
    destinationId: 'loc-3',
    destinationName: 'Marol Naka',
    totalSeats: 28,
    seats: generateSeats(28).map((seat, i) => ({
      ...seat,
      id: `journey-3-seat-${seat.seatNumber}`,
      isBooked: i % 7 === 0, // Every 7th seat booked
      bookedBy: i % 7 === 0 ? 'demo@example.com' : undefined,
    })),
  },
];

// Initial bookings matching pre-booked seats
const initialBookings: Booking[] = [
  {
    id: 'booking-1',
    journeyId: 'journey-1',
    busNumber: 'MH-04-AB-1234',
    seatNumber: 1,
    userId: 'user@example.com',
    userEmail: 'user@example.com',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    route: 'Thane → Ghatkopar',
    seatPosition: 'Row 1, WL',
  },
  {
    id: 'booking-2',
    journeyId: 'journey-1',
    busNumber: 'MH-04-AB-1234',
    seatNumber: 2,
    userId: 'user@example.com',
    userEmail: 'user@example.com',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    route: 'Thane → Ghatkopar',
    seatPosition: 'Row 1, AL',
  },
];

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [buses, setBuses] = useState<Bus[]>(initialBuses);
  const [journeys, setJourneys] = useState<Journey[]>(initialJourneys);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Location actions
  const addLocation = useCallback(async (name: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const exists = locations.some(l => l.name.toLowerCase() === name.toLowerCase());
      if (exists) {
        setError('Location already exists');
        return false;
      }

      const newLocation: Location = {
        id: `loc-${Date.now()}`,
        name: name.trim(),
      };

      setLocations(prev => [...prev, newLocation]);
      return true;
    } catch {
      setError('Failed to add location');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [locations]);

  // Bus actions
  const createBus = useCallback(async (busNumber: string, capacity: BusCapacity): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const exists = buses.some(b => b.busNumber.toLowerCase() === busNumber.toLowerCase());
      if (exists) {
        setError('Bus number already exists');
        return false;
      }

      const newBus: Bus = {
        id: `bus-${Date.now()}`,
        busNumber: busNumber.trim(),
        capacity,
      };

      setBuses(prev => [...prev, newBus]);
      return true;
    } catch {
      setError('Failed to create bus');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [buses]);

  const getBusById = useCallback((busId: string): Bus | undefined => {
    return buses.find(b => b.id === busId);
  }, [buses]);

  // Journey actions
  const createJourney = useCallback(async (
    busId: string,
    sourceId: string,
    destinationId: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const bus = buses.find(b => b.id === busId);
      if (!bus) {
        setError('Bus not found');
        return false;
      }

      const source = locations.find(l => l.id === sourceId);
      const destination = locations.find(l => l.id === destinationId);
      if (!source || !destination) {
        setError('Invalid locations');
        return false;
      }

      // Check if bus is already assigned to a journey
      const existingJourney = journeys.find(j => j.busId === busId);
      if (existingJourney) {
        setError('This bus is already assigned to a journey');
        return false;
      }

      const newJourney: Journey = {
        id: `journey-${Date.now()}`,
        busId,
        busNumber: bus.busNumber,
        sourceId,
        sourceName: source.name,
        destinationId,
        destinationName: destination.name,
        totalSeats: bus.capacity,
        seats: generateSeats(bus.capacity).map(seat => ({
          ...seat,
          id: `journey-${Date.now()}-seat-${seat.seatNumber}`,
        })),
      };

      setJourneys(prev => [...prev, newJourney]);
      return true;
    } catch {
      setError('Failed to create journey');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [buses, locations, journeys]);

  const getJourneyById = useCallback((journeyId: string): Journey | undefined => {
    return journeys.find(j => j.id === journeyId);
  }, [journeys]);

  const getAvailableSeatsCount = useCallback((journeyId: string): number => {
    const journey = journeys.find(j => j.id === journeyId);
    if (!journey) return 0;
    return journey.seats.filter(s => !s.isBooked).length;
  }, [journeys]);

  const resetJourney = useCallback(async (journeyId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      // Reset all seats to available
      setJourneys(prev => prev.map(journey => {
        if (journey.id !== journeyId) return journey;
        return {
          ...journey,
          seats: journey.seats.map(s => ({ ...s, isBooked: false, bookedBy: undefined })),
        };
      }));

      // Cancel all bookings for this journey
      setBookings(prev => prev.map(b => {
        if (b.journeyId !== journeyId) return b;
        return { ...b, status: 'cancelled' };
      }));

      return true;
    } catch {
      setError('Failed to reset journey');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fill helpers
  const getJourneyByBus = useCallback((busId: string): Journey | undefined => {
    return journeys.find(j => j.busId === busId);
  }, [journeys]);

  const findBusForRoute = useCallback((sourceId: string, destinationId: string): Bus | undefined => {
    const journey = journeys.find(j => j.sourceId === sourceId && j.destinationId === destinationId);
    if (!journey) return undefined;
    return buses.find(b => b.id === journey.busId);
  }, [journeys, buses]);

  const isBusAssignedToJourney = useCallback((busId: string): boolean => {
    return journeys.some(j => j.busId === busId);
  }, [journeys]);

  // Booking actions
  const bookSeat = useCallback(async (
    journeyId: string,
    seatNumber: number,
    userId: string,
    userEmail: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const journey = journeys.find(j => j.id === journeyId);
      if (!journey) {
        setError('Journey not found');
        return false;
      }

      const seat = journey.seats.find(s => s.seatNumber === seatNumber);
      if (!seat) {
        setError('Seat not found');
        return false;
      }

      if (seat.isBooked) {
        setError('Seat is already booked');
        return false;
      }

      // Update seat
      setJourneys(prev => prev.map(j => {
        if (j.id !== journeyId) return j;
        return {
          ...j,
          seats: j.seats.map(s => {
            if (s.seatNumber !== seatNumber) return s;
            return { ...s, isBooked: true, bookedBy: userId };
          }),
        };
      }));

      // Create booking
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        journeyId,
        busNumber: journey.busNumber,
        seatNumber,
        userId,
        userEmail,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        route: `${journey.sourceName} → ${journey.destinationName}`,
        seatPosition: getSeatPositionLabel(seat),
      };

      setBookings(prev => [...prev, newBooking]);
      return true;
    } catch {
      setError('Failed to book seat');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [journeys]);

  const cancelBooking = useCallback(async (bookingId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

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
      setJourneys(prev => prev.map(journey => {
        if (journey.id !== booking.journeyId) return journey;
        return {
          ...journey,
          seats: journey.seats.map(s => {
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

  const getUserBookings = useCallback((userId: string): Booking[] => {
    return bookings.filter(b => b.userId === userId);
  }, [bookings]);

  return (
    <BookingContext.Provider value={{
      locations,
      buses,
      journeys,
      bookings,
      isLoading,
      error,
      addLocation,
      createBus,
      getBusById,
      createJourney,
      getJourneyById,
      getAvailableSeatsCount,
      resetJourney,
      getJourneyByBus,
      findBusForRoute,
      isBusAssignedToJourney,
      bookSeat,
      cancelBooking,
      getUserBookings,
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
