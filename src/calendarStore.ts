import { create } from "zustand";
import { format } from "date-fns";
import type { IInsertEvent } from "./api/mutations/createEvent.mutation";

interface CalendarState {
  open: boolean;
  selectedDate: string;
  selectedEvent: IInsertEvent | null;
  setOpen: (open: boolean) => void;
  setSelectedDate: (date: string) => void;
  setSelectedEvent: (event: IInsertEvent | null) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  open: false,
  selectedDate: format(new Date(), "yyyy-MM-dd"),
  selectedEvent: null,
  setOpen: (open) => set({ open }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setSelectedEvent: (selectedEvent) => set({ selectedEvent }),
}));
