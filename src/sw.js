import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", () => {
  console.log("Service Worker installing...");
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
  console.log("Service Worker activated!");
});

self.addEventListener("push", (event) => {
  event.waitUntil(
    (async () => {
      let data = {
        title: "Default title",
        body: "Default body",
      };

      if (event.data) {
        try {
          data = event.data.json();
        } catch {
          data.body = event.data.text();
        }
      }

      console.log("📨 Push Received:", data);

      await self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
      });
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("🔔 Notification clicked:", event.notification);

  event.notification.close();

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({
        includeUncontrolled: true,
        type: "window",
      });

      if (allClients.length > 0) {
        allClients[0].focus();
      } else {
        self.clients.openWindow("/");
      }
    })()
  );
});
