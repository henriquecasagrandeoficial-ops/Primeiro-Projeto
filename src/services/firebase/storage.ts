import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/services/firebase/config";

export async function uploadImage(path: string, file: File) {
  const extension = file.name.split(".").pop() ?? "jpg";
  const fileRef = ref(storage, `${path}/${crypto.randomUUID()}.${extension}`);
  await uploadBytes(fileRef, file, { contentType: file.type });
  return getDownloadURL(fileRef);
}

export async function deleteImage(url: string) {
  await deleteObject(ref(storage, url));
}
