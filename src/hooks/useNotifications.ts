import { useEffect } from "react";
import type { IFetchedEvent } from "../api/queries/fetchEvents.query";
import { isAfter, parse } from "date-fns";

export const useNotifications = (events: IFetchedEvent[]) => {
  useEffect(() => {
    if (!("Notification" in window)) return;

    const scheduleNotifications = () => {
      const now = new Date();

      events?.forEach((event) => {
        if (!event.start) return;

        const eventStart = parse(event.start, "yyyy-MM-dd HH:mm", new Date());
        const timeUntilEvent = eventStart.getTime() - now.getTime();

        // Notify 10 minutes before
        const notificationLeadTime = 10 * 60 * 1000;

        if (
          isAfter(eventStart, new Date()) &&
          timeUntilEvent < notificationLeadTime
        ) {
          new Notification(event.title, {
            body: `Starts at ${eventStart.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`,
            icon: "/pwa-icon-192.png",
            badge: "/pwa-icon-192.png",
          });
        }
      });
    };

    if (Notification.permission === "granted") {
      scheduleNotifications();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          scheduleNotifications();
        }
      });
    }
  }, [events]);
};
