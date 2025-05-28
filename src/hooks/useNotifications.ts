import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const subscribeUser = async (user_id?: string | null) => {
  if (!("serviceWorker" in navigator)) {
    console.error("Service workers are not supported in this browser.");
    return;
  }
  try {
    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        import.meta.env.VITE_PUBLIC_VAPID_KEY
      ),
    });

    await fetch(`${import.meta.env.VITE_PUSH_SERVICE_URL}/subscribe`, {
      method: "POST",
      body: JSON.stringify({
        user_id,
        subscription,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error(err);
  }
};

export const useNotifications = () => {
  const { user } = useUser();
  useEffect(() => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      subscribeUser(user?.id);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          subscribeUser(user?.id);
        }
      });
    }
  }, [user?.id]);
};
