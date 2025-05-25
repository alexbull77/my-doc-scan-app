import { queryOptions } from "@tanstack/react-query";
import { fetchEvents } from "./api/queries/fetchEvents.query";

export const eventsQueryOptions = {
  all: ["allEvents"],

  events: () =>
    queryOptions({
      queryKey: [...eventsQueryOptions.all, "events"],
      queryFn: fetchEvents,
      initialData: [],
    }),
};
