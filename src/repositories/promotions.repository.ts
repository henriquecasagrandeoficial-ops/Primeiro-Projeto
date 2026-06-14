import { orderBy, setDoc, updateDoc } from "firebase/firestore";
import { cleanUndefined, documentRef, getCollection } from "@/services/firebase/firestore";
import type { Promotion } from "@/types";

export function listPromotions() {
  return getCollection<Promotion>("promotions", [orderBy("validUntil", "desc")]);
}

export async function createPromotion(promotion: Promotion) {
  const today = new Date().toISOString().slice(0, 10);
  await setDoc(
    documentRef("promotions", promotion.id),
    cleanUndefined({ ...promotion, createdAt: today, updatedAt: today }),
  );
}

export async function updatePromotion(promotion: Promotion) {
  await updateDoc(
    documentRef("promotions", promotion.id),
    cleanUndefined({ ...promotion, updatedAt: new Date().toISOString().slice(0, 10) }),
  );
}
