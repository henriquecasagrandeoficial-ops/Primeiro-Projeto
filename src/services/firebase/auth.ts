import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/services/firebase/config";

export function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function register(email: string, password: string, displayName: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  return credential;
}

export function logout() {
  return signOut(auth);
}

export function requestPasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export function subscribeAuth(onChange: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, onChange);
}
