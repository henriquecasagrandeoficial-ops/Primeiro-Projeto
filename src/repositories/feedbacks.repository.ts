import { orderBy, setDoc, updateDoc } from "firebase/firestore";
import { cleanUndefined, documentRef, getCollection } from "@/services/firebase/firestore";
import type { Feedback, FeedbackStatus } from "@/types";

export function listFeedbacks() {
  return getCollection<Feedback>("feedbacks", [orderBy("createdAt", "desc")]);
}

export async function createFeedback(feedback: Feedback) {
  await setDoc(documentRef("feedbacks", feedback.id), cleanUndefined(feedback));
}

export async function updateFeedbackStatus(
  id: string,
  status: FeedbackStatus,
  response?: string,
) {
  await updateDoc(
    documentRef("feedbacks", id),
    cleanUndefined({
      status,
      response,
      updatedAt: new Date().toISOString().slice(0, 10),
    }),
  );
}
