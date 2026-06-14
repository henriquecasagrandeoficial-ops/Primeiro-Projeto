import { deleteDoc, orderBy, setDoc } from "firebase/firestore";
import { cleanUndefined, documentRef, getCollection } from "@/services/firebase/firestore";
import type { MediaAsset } from "@/types";

export function listMediaAssets() {
  return getCollection<MediaAsset>("media", [orderBy("createdAt", "desc")]);
}

export async function createMediaAsset(asset: Omit<MediaAsset, "id" | "createdAt">) {
  const id = crypto.randomUUID();
  const nextAsset: MediaAsset = {
    ...asset,
    id,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  await setDoc(documentRef("media", id), cleanUndefined(nextAsset));
  return nextAsset;
}

export async function removeMediaAsset(id: string) {
  await deleteDoc(documentRef("media", id));
}
