import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMediaAsset,
  listMediaAssets,
  removeMediaAsset,
} from "@/repositories/media.repository";
import { deleteImage, uploadImage } from "@/services/firebase/storage";
import type { MediaUsage } from "@/types";

export function useMediaAssets() {
  return useQuery({
    queryKey: ["media"],
    queryFn: listMediaAssets,
  });
}

export function useMediaMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["media"] });

  return {
    uploadMedia: useMutation({
      mutationFn: async ({
        file,
        usage,
        uploadedBy,
      }: {
        file: File;
        usage: MediaUsage;
        uploadedBy?: string;
      }) => {
        const url = await uploadImage(`${usage}s`, file);
        return createMediaAsset({
          name: file.name,
          url,
          type: file.type,
          size: file.size,
          usage,
          uploadedBy,
        });
      },
      onSuccess: invalidate,
    }),
    removeMedia: useMutation({
      mutationFn: async ({ id, url }: { id: string; url: string }) => {
        await removeMediaAsset(id);
        await deleteImage(url).catch(() => undefined);
      },
      onSuccess: invalidate,
    }),
  };
}
