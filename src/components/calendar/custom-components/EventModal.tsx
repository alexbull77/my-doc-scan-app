import { Button, CircularProgress } from "@mui/material";
import { format, parse } from "date-fns";
import { useCalendarStore } from "../../../calendarStore";
import type { IFetchedEvent } from "../../../api/queries/fetchEvents.query";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useMutation } from "@tanstack/react-query";
import { eventsQueryOptions } from "../../../eventQueryOptions";
import { toast } from "sonner";
import { deleteEvent } from "../../../api/mutations/deleteEvent.mutation";
import { useRef } from "react";

export const EventModal: React.FC<{ calendarEvent: IFetchedEvent }> = ({
  calendarEvent,
}) => {
  {
    const modalRef = useRef<HTMLDivElement>(null);

    const { setSelectedEvent, setOpen, removeCalendarEvent } =
      useCalendarStore();

    const { mutate: handleDeleteEvent, isPending: deletePending } = useMutation(
      {
        mutationKey: eventsQueryOptions.all,
        mutationFn: deleteEvent,
        onSuccess: (id) => {
          if (!id) return;
          toast.success("Event deleted");
          modalRef.current?.remove();
          removeCalendarEvent(id);
        },
      }
    );

    if (!calendarEvent.start || !calendarEvent.end) return null;

    const startDate = parse(
      calendarEvent.start,
      "yyyy-MM-dd HH:mm",
      new Date()
    );
    const endDate = parse(calendarEvent.end, "yyyy-MM-dd HH:mm", new Date());

    return (
      <div
        ref={modalRef}
        className=" absolute bg-white p-4 rounded-2xl shadow-lg text-gray-900 space-y-5"
      >
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
        <div className="flex justify-end gap-x-2">
          <Button
            variant="text"
            size="small"
            endIcon={<EditOutlinedIcon />}
            disabled={deletePending}
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
          <Button
            size="small"
            disabled={deletePending}
            endIcon={
              deletePending ? (
                <CircularProgress size={18} />
              ) : (
                <DeleteOutlineIcon />
              )
            }
            color="error"
            onClick={() => handleDeleteEvent(calendarEvent.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    );
  }
};
