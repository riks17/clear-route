// Core domain types for Bus Ticket Booking System

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Bus {
  id: string;
  busNumber: string;
  source: string;
  destination: string;
  totalSeats: number;
  seats: Seat[];
}

export interface Seat {
  id: string;
  seatNumber: number;
  isBooked: boolean;
  bookedBy?: string;
}

export interface Booking {
  id: string;
  busId: string;
  busNumber: string;
  seatNumber: number;
  userId: string;
  userEmail: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  route: string;
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
  source: string;
  destination: string;
  totalSeats: number;
}
