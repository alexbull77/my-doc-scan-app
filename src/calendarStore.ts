import { create } from "zustand";
import { format } from "date-fns";
import type { IInsertEvent } from "./api/mutations/createEvent.mutation";
import { persist } from "zustand/middleware";

export enum CalendarLocale {
  EN = "en-US",
  RO = "ro-RO",
  RU = "ru-RU",
}

interface CalendarState {
  open: boolean;
  selectedDate: string;
  selectedEvent: IInsertEvent | null;
  locale: CalendarLocale;
  setOpen: (open: boolean) => void;
  setSelectedDate: (date: string) => void;
  setSelectedEvent: (event: IInsertEvent | null) => void;
  setLocale: (locale: CalendarLocale) => void;
  removeCalendarEvent: (id: string) => void;
  setRemoveCalendarEvent: (callback: (id: string) => void) => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      open: false,
      selectedDate: format(new Date(), "yyyy-MM-dd"),
      selectedEvent: null,
      locale: CalendarLocale.RU,
      setOpen: (open) => set({ open }),
      setSelectedDate: (selectedDate) => set({ selectedDate }),
      setSelectedEvent: (selectedEvent) => set({ selectedEvent }),
      setLocale: (locale) => set({ locale }),
      removeCalendarEvent: () => {},
      setRemoveCalendarEvent: (callback) => {
        set({ removeCalendarEvent: callback });
      },
    }),
    {
      name: "calendar-store",
    }
  )
);
