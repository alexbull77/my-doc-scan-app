import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  viewDay,
  viewMonthAgenda,
  viewMonthGrid,
  viewWeek,
} from "@schedule-x/calendar";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import "@schedule-x/theme-default/dist/index.css";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { EventDialog } from "./EventDialog";
import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { eventsQueryOptions } from "../../eventQueryOptions";

export const CalendarIndex = () => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  const [selectedEventId, setSelectedEventId] = useState<
    number | string | null
  >(null);

  const calendar = useCalendarApp({
    locale: "ru-RU",
    selectedDate,
    defaultView: viewWeek.name,
    views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
    plugins: [createEventModalPlugin(), createDragAndDropPlugin()],
    isDark: false,
    dayBoundaries: {
      start: "06:00",
      end: "00:00",
    },
    events: [],
    callbacks: {
      onClickDate: (date) => setSelectedDate(date),
      onEventClick: (event) => setSelectedEventId(event.id),
    },
  });

  const { data: events } = useQuery(eventsQueryOptions.events());

  useEffect(() => {
    calendar?.events.set(events);
  }, [events, calendar]);

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
      <Button
        variant="text"
        color="primary"
        size="large"
        className="rounded-full"
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          right: "1rem",
          bottom: "1rem",
          color: "black",
        }}
      >
        <AddCircleOutlineSharpIcon fontSize="large" />
      </Button>
      <EventDialog
        date={selectedDate}
        eventId={selectedEventId}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};
