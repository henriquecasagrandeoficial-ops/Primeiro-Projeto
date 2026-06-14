import { where } from "firebase/firestore";
import { subscribeCollection } from "@/services/firebase/firestore";
import type { Notification } from "@/types";

export function subscribeUserNotifications(
  userId: string,
  onChange: (notifications: Notification[]) => void,
) {
  return subscribeCollection<Notification>("notifications", onChange, [
    where("userId", "in", [userId, "all"]),
  ]);
}
