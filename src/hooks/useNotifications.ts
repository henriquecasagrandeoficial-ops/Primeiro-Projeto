import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import {
  createNotification,
  deleteNotification,
  listNotifications,
  markNotificationRead,
  subscribeNotifications,
} from "@/repositories/notifications.repository";

export function useNotifications(userId?: string, admin = false) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => ["notifications", userId ?? "all", admin],
    [admin, userId],
  );
  const query = useQuery({
    queryKey,
    queryFn: () => listNotifications(userId, admin),
  });

  useEffect(() => {
    return subscribeNotifications((items) => {
      queryClient.setQueryData(queryKey, items);
    }, userId, admin);
  }, [admin, queryClient, queryKey, userId]);

  return query;
}

export function useNotificationMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });

  return {
    createNotification: useMutation({ mutationFn: createNotification, onSuccess: invalidate }),
    markRead: useMutation({
      mutationFn: ({ id, read = true }: { id: string; read?: boolean }) =>
        markNotificationRead(id, read),
      onSuccess: invalidate,
    }),
    removeNotification: useMutation({ mutationFn: deleteNotification, onSuccess: invalidate }),
  };
}
