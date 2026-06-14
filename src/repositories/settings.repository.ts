import { setDoc } from "firebase/firestore";
import { documentRef, getDocument } from "@/services/firebase/firestore";
import type { Settings } from "@/types";

export function getSettings() {
  return getDocument<Settings>("settings", "main");
}

export async function updateSettings(settings: Settings) {
  await setDoc(documentRef("settings", "main"), {
    ...settings,
    updatedAt: new Date().toISOString().slice(0, 10),
  });
}
