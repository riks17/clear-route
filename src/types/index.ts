// Core domain types for Bus Ticket Booking System
// Updated domain model: Bus → Journey → Booking

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

// Physical locations for pickup/drop
export interface Location {
  id: string;
  name: string;
}

// Physical bus with fixed capacity
export type BusCapacity = 16 | 20 | 28 | 40;

export interface Bus {
  id: string;
  busNumber: string;
  capacity: BusCapacity;
}

// Seat within a journey (linked to bus capacity)
export interface Seat {
  id: string;
  seatNumber: number;
  isBooked: boolean;
  bookedBy?: string;
  // Seat position for realistic layout
  row: number;
  position: 'window-left' | 'aisle-left' | 'aisle-right' | 'window-right';
}

// Journey: What users see and book (Bus assigned to a route)
export interface Journey {
  id: string;
  busId: string;
  busNumber: string;
  sourceId: string;
  sourceName: string;
  destinationId: string;
  destinationName: string;
  seats: Seat[];
  totalSeats: number;
}

// Booking tied to a journey
export interface Booking {
  id: string;
  journeyId: string;
  busNumber: string;
  seatNumber: number;
  userId: string;
  userEmail: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  route: string;
  // Seat position for display
  seatPosition: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateBusFormData {
  busNumber: string;
  capacity: BusCapacity;
}

export interface CreateJourneyFormData {
  busId: string;
  sourceId: string;
  destinationId: string;
}
