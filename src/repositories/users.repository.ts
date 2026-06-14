import { doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { collectionRef, cleanUndefined, documentRef } from "@/services/firebase/firestore";
import type { RegisterDTO, User } from "@/types";

type UserDocument = Omit<User, "id"> & {
  updatedAt?: string;
};

export async function getUserProfile(id: string) {
  const snapshot = await getDoc(documentRef("users", id));
  if (!snapshot.exists()) return null;

  return { id: snapshot.id, ...snapshot.data() } as User;
}

export async function listUsers() {
  const snapshot = await getDocs(query(collectionRef("users"), orderBy("createdAt", "desc")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as User);
}

export async function createUserProfile(
  id: string,
  dto: RegisterDTO,
  email: string,
  avatar = "",
) {
  const today = new Date().toISOString().slice(0, 10);
  const profile: UserDocument = {
    name: dto.fullName,
    fullName: dto.fullName,
    email,
    phone: dto.phone,
    avatar,
    avatarUrl: avatar,
    role: "client",
    createdAt: today,
    updatedAt: today,
    marketingConsent: dto.marketingConsent,
    preferences: {
      notifications: true,
      theme: "light",
    },
  };

  await setDoc(doc(collectionRef("users"), id), profile);
  return { id, ...profile };
}

export async function updateUserProfile(id: string, data: Partial<User>) {
  const profile = { ...data };
  delete profile.id;
  const nextData = cleanUndefined({
    ...profile,
    updatedAt: new Date().toISOString().slice(0, 10),
  });

  await updateDoc(documentRef("users", id), nextData);
}
