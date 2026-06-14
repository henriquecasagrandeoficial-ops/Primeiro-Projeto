import { deleteDoc, limit, orderBy, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "@/services/firebase/config";
import {
  cleanUndefined,
  documentRef,
  getCollection,
  subscribeCollection,
} from "@/services/firebase/firestore";
import type { Product, ProductStatus } from "@/types";

export function subscribeProducts(onChange: (products: Product[]) => void) {
  return subscribeCollection<Product>("products", onChange, [
    orderBy("createdAt", "desc"),
    limit(100),
  ]);
}

export function listProducts() {
  return getCollection<Product>("products", [orderBy("createdAt", "desc"), limit(100)]);
}

export async function createProduct(product: Product) {
  const today = new Date().toISOString().slice(0, 10);
  const nextProduct = cleanUndefined({
    ...product,
    createdAt: product.createdAt || today,
    updatedAt: today,
  });

  await setDoc(documentRef("products", product.id), nextProduct);
}

export async function updateProduct(product: Product) {
  await updateDoc(
    documentRef("products", product.id),
    cleanUndefined({
      ...product,
      updatedAt: new Date().toISOString().slice(0, 10),
    }),
  );
}

export async function removeProduct(id: string) {
  await deleteDoc(documentRef("products", id));
}

export async function duplicateProduct(id: string, product: Product) {
  await createProduct({
    ...product,
    id,
    name: `${product.name} (cópia)`,
    createdAt: new Date().toISOString().slice(0, 10),
  });
}

export async function bulkUpdateProducts(ids: string[], status: ProductStatus) {
  const batch = writeBatch(db);

  ids.forEach((id) => {
    batch.update(documentRef("products", id), {
      status,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
  });

  await batch.commit();
}

export async function bulkDeleteProducts(ids: string[]) {
  const batch = writeBatch(db);
  ids.forEach((id) => batch.delete(documentRef("products", id)));
  await batch.commit();
}
