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
import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { eventsQueryOptions } from "../../eventQueryOptions";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { customComponents } from "./custom-components/CustomComponents";
import { useCalendarStore } from "../../calendarStore";
import { format } from "date-fns";
import { createScrollControllerPlugin } from "@schedule-x/scroll-controller";

export const CalendarIndex = () => {
  const { setOpen, selectedDate, setSelectedDate, setSelectedEvent } =
    useCalendarStore();

  const calendar = useCalendarApp({
    locale: "ru-RU",
    selectedDate,
    defaultView: viewWeek.name,
    views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
    plugins: [
      createEventModalPlugin(),
      createScrollControllerPlugin({
        initialScroll: format(new Date(), "HH:mm"),
      }),
    ],
    isDark: false,
    dayBoundaries: {
      start: "06:00",
      end: "00:00",
    },
    events: [],
    callbacks: {
      onClickDate: (date) => setSelectedDate(date),
    },
  });

  const { data: events } = useQuery(eventsQueryOptions.events());

  useEffect(() => {
    calendar?.events.set(events);
  }, [events, calendar]);

  return (
    <div>
      <ScheduleXCalendar
        calendarApp={calendar}
        customComponents={customComponents}
      />
      <Button
        variant="text"
        color="primary"
        size="large"
        className="rounded-full"
        onClick={() => {
          setSelectedEvent(null);
          setOpen(true);
        }}
        sx={{
          position: "fixed",
          right: "1rem",
          bottom: "1rem",
          color: "black",
        }}
      >
        <AddCircleOutlineSharpIcon fontSize="large" />
      </Button>
      <EventDialog />
    </div>
  );
};
