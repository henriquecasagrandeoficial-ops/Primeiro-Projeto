import { orderBy, setDoc, updateDoc } from "firebase/firestore";
import { cleanUndefined, documentRef, getCollection } from "@/services/firebase/firestore";
import type { Coupon } from "@/types";

export function listCoupons() {
  return getCollection<Coupon>("coupons", [orderBy("validUntil", "asc")]);
}

export async function createCoupon(coupon: Coupon) {
  await setDoc(
    documentRef("coupons", coupon.id),
    cleanUndefined({
      ...coupon,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    }),
  );
}

export async function updateCoupon(coupon: Coupon) {
  await updateDoc(
    documentRef("coupons", coupon.id),
    cleanUndefined({ ...coupon, updatedAt: new Date().toISOString().slice(0, 10) }),
  );
}
