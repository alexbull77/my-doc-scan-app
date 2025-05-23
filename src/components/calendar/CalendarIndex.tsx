import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  viewDay,
  viewMonthAgenda,
  viewMonthGrid,
  viewWeek,
} from "@schedule-x/calendar";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import "@schedule-x/theme-default/dist/index.css";
import { useState } from "react";
import { format } from "date-fns";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { NoteModal } from "./NoteModal";
import { Button } from "@mui/material";

export const CalendarIndex = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  const [open, setOpen] = useState(false);

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
    events: [
      {
        id: "1",
        title: "Event 1",
        start: "2025-05-16",
        end: "2025-05-16",
      },
      {
        id: "2",
        title: "Event 2",
        start: "2025-05-16 10:00",
        end: "2025-05-16 12:00",
      },
    ],
    callbacks: {
      onClickDate: (date) => setSelectedDate(date),
      onEventClick: (event) => setSelectedEventId(event.id),
    },
  });

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
      <NoteModal
        date={selectedDate}
        eventId={selectedEventId}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};
