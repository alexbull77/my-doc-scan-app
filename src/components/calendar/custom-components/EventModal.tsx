import { Button } from "@mui/material";
import { format, parse } from "date-fns";
import { useCalendarStore } from "../../../calendarStore";
import type { IFetchedEvent } from "../../../api/queries/fetchEvents.query";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

export const EventModal: React.FC<{ calendarEvent: IFetchedEvent }> = ({
  calendarEvent,
}) => {
  {
    const { setSelectedEvent, setOpen } = useCalendarStore();

    if (!calendarEvent.start || !calendarEvent.end) return null;

    const startDate = parse(
      calendarEvent.start,
      "yyyy-MM-dd HH:mm",
      new Date()
    );
    const endDate = parse(calendarEvent.end, "yyyy-MM-dd HH:mm", new Date());

    return (
      <div className="absolute bg-white p-4 rounded-2xl shadow-lg text-gray-900 space-y-5">
        {/* Title */}
        <div className="flex space-x-3 items-center sx__has-icon sx__event-modal__title font-semibold text-lg">
          <div
            className="sx__event-modal__color-icon sx__event-icon w-5 h-5 rounded-full"
            style={{ backgroundColor: "var(--sx-color-primary-container)" }}
          />
          <span className="">{calendarEvent.title}</span>
        </div>

        {/* Time */}
        <div className="flex items-center space-x-3 sx__has-icon sx__event-modal__time text-gray-700 text-sm">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="sx__event-icon w-5 h-5 stroke-current text-gray-700"
          >
            <path
              d="M12 8V12L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <div>
            {format(startDate, "PPP, HH:mm")} – {format(endDate, "PPP, HH:mm")}
          </div>
        </div>

        {/* Description */}
        <div className="flex items-center space-x-3 sx__has-icon sx__event-modal__description text-gray-700 text-sm">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="sx__event-icon w-5 h-5 stroke-current text-gray-700"
          >
            <rect
              x="4"
              y="4"
              width="16"
              height="16"
              rx="3"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M16 10L8 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M16 14L8 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div>{calendarEvent.description || "No description"}</div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="text"
            size="small"
            endIcon={<EditOutlinedIcon />}
            onClick={() => {
              setOpen(true);
              setSelectedEvent({
                id: calendarEvent.id.toString(),
                title: calendarEvent.title || "",
                description: calendarEvent.description || "",
                start: calendarEvent.start,
                end: calendarEvent.end,
                images: { data: calendarEvent.images || [] },
              });
            }}
          >
            Edit
          </Button>
        </div>
      </div>
    );
  }
};
