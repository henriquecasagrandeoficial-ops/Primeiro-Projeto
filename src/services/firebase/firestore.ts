import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  type DocumentData,
  type QueryConstraint,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/services/firebase/config";

export const timestamp = serverTimestamp;

export function collectionRef(path: string) {
  return collection(db, path);
}

export function documentRef(path: string, id: string) {
  return doc(db, path, id);
}

export async function getDocument<T>(path: string, id: string) {
  const snapshot = await getDoc(documentRef(path, id));

  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as T;
}

export async function getCollection<T>(
  path: string,
  constraints: QueryConstraint[] = [orderBy("createdAt", "desc")],
) {
  const snapshot = await getDocs(query(collectionRef(path), ...constraints));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T);
}

export function subscribeCollection<T>(
  path: string,
  onChange: (items: T[]) => void,
  constraints: QueryConstraint[] = [orderBy("createdAt", "desc")],
) {
  return onSnapshot(query(collectionRef(path), ...constraints), (snapshot) => {
    onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T));
  });
}

export function cleanUndefined<T extends DocumentData>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}
