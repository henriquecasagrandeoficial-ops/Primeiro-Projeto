import { deleteDoc, orderBy, setDoc, updateDoc, where } from "firebase/firestore";
import {
  cleanUndefined,
  documentRef,
  getCollection,
  subscribeCollection,
} from "@/services/firebase/firestore";
import type { Notification } from "@/types";

export function listNotifications(userId?: string, admin = false) {
  if (admin) {
    return getCollection<Notification>("notifications", [orderBy("createdAt", "desc")]);
  }

  return getCollection<Notification>(
    "notifications",
    userId ? [where("userId", "in", [userId, "all"])] : [where("userId", "==", "all")],
  );
}

export function subscribeNotifications(
  onChange: (items: Notification[]) => void,
  userId?: string,
  admin = false,
) {
  if (admin) {
    return subscribeCollection<Notification>("notifications", onChange, [
      orderBy("createdAt", "desc"),
    ]);
  }

  return subscribeCollection<Notification>(
    "notifications",
    onChange,
    userId ? [where("userId", "in", [userId, "all"])] : [where("userId", "==", "all")],
  );
}

export async function createNotification(notification: Notification) {
  await setDoc(
    documentRef("notifications", notification.id),
    cleanUndefined({
      ...notification,
      userId: notification.userId ?? "all",
      createdAt: notification.createdAt || new Date().toISOString().slice(0, 10),
    }),
  );
}

export async function markNotificationRead(id: string, read = true) {
  await updateDoc(documentRef("notifications", id), { read });
}

export async function deleteNotification(id: string) {
  await deleteDoc(documentRef("notifications", id));
}
