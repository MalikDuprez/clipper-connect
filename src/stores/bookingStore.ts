// stores/bookingStore.ts
import { create } from "zustand";

export interface BookingItem {
  id: string;
  inspiration: {
    id: string;
    title: string;
    image: string;
    category: string;
    duration: string;
    price: number;
  };
  coiffeur: {
    id: string;
    name: string;
    salon: string;
    image: string;
    rating: number;
  };
  date: string;
  dateFormatted: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: Date;
}

interface BookingState {
  // Réservation en cours (pendant le flow checkout)
  currentBooking: Omit<BookingItem, "id" | "status" | "createdAt"> | null;
  
  // Toutes les réservations confirmées
  bookings: BookingItem[];
  
  // Actions
  setCurrentBooking: (booking: Omit<BookingItem, "id" | "status" | "createdAt">) => void;
  clearCurrentBooking: () => void;
  confirmBooking: () => void;
  cancelBooking: (id: string) => void;
  getUpcomingBookings: () => BookingItem[];
  getPastBookings: () => BookingItem[];
}

export const useBookingStore = create<BookingState>((set, get) => ({
  currentBooking: null,
  bookings: [],

  setCurrentBooking: (booking) => {
    set({ currentBooking: booking });
  },

  clearCurrentBooking: () => {
    set({ currentBooking: null });
  },

  confirmBooking: () => {
    const { currentBooking, bookings } = get();
    if (currentBooking) {
      const newBooking: BookingItem = {
        ...currentBooking,
        id: Date.now().toString(),
        status: "confirmed",
        createdAt: new Date(),
      };
      set({
        bookings: [newBooking, ...bookings],
        currentBooking: null,
      });
    }
  },

  cancelBooking: (id) => {
    const { bookings } = get();
    set({
      bookings: bookings.map((b) =>
        b.id === id ? { ...b, status: "cancelled" as const } : b
      ),
    });
  },

  getUpcomingBookings: () => {
    const { bookings } = get();
    return bookings.filter(
      (b) => b.status === "confirmed" || b.status === "pending"
    );
  },

  getPastBookings: () => {
    const { bookings } = get();
    return bookings.filter(
      (b) => b.status === "completed" || b.status === "cancelled"
    );
  },
}));