import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  viewDay,
  viewMonthAgenda,
  viewMonthGrid,
  viewWeek,
} from "@schedule-x/calendar";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import "@schedule-x/theme-default/dist/index.css";
import { useEffect } from "react";
import { EventDialog } from "./EventDialog";
import { IconButton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { eventsQueryOptions } from "../../eventQueryOptions";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { customComponents } from "./custom-components/CustomComponents";
import { useCalendarStore } from "../../calendarStore";
import { format } from "date-fns";
import { createScrollControllerPlugin } from "@schedule-x/scroll-controller";
import { useUser } from "@clerk/clerk-react";
import { MobileDrawer } from "../MobileDrawer";
import { useNotifications } from "../../hooks/useNotifications";
import { useTranslation } from "react-i18next";

export const CalendarIndex = () => {
  const {
    setOpen,
    selectedDate,
    setSelectedDate,
    setSelectedEvent,
    locale,
    setRemoveCalendarEvent,
  } = useCalendarStore();

  const { user } = useUser();

  const calendar = useCalendarApp({
    locale,
    selectedDate,
    defaultView: viewWeek.name,
    theme: "",
    views: [viewMonthGrid, viewMonthAgenda, viewDay, viewWeek],
    plugins: [
      createEventModalPlugin(),
      createScrollControllerPlugin({
        initialScroll: format(new Date(), "HH:mm"),
      }),
    ],
    isDark: false,
    events: [],
    callbacks: {
      onClickDate: (date) => setSelectedDate(date),
    },
  });

  useEffect(() => {
    if (!calendar) return;
    setRemoveCalendarEvent(calendar.events.remove);
  }, [calendar, setRemoveCalendarEvent]);

  const { data: events } = useQuery(eventsQueryOptions.events());

  const { t } = useTranslation();
  useNotifications();

  useEffect(() => {
    calendar?.events.set(events);
  }, [events, calendar]);

  return (
    <div className="h-[100dvh] w-[10dvw] calendar-wrapper">
      <div className="h-[10dvh] w-[100dvw] flex gap-x-4 justify-between items-center drop-shadow-xl bg-white border-b border-[#6F8537] px-4">
        <MobileDrawer />
        <div className="text-lg text-gray-800">{t("calendar")}</div>
        <img className="w-10 h-10 rounded-full" src={user?.imageUrl} />
      </div>
      <ScheduleXCalendar
        calendarApp={calendar}
        customComponents={customComponents}
      />
      <IconButton
        onClick={() => {
          setSelectedEvent(null);
          setOpen(true);
        }}
        sx={{
          position: "fixed",
          right: "1rem",
          bottom: "1rem",
          width: "fit",
          color: "#6F8537",
          backgroundColor: "#E4EACE",
        }}
      >
        <AddCircleOutlineSharpIcon fontSize="large" />
      </IconButton>
      <EventDialog />
    </div>
  );
};
