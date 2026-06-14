import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFeedback,
  listFeedbacks,
  updateFeedbackStatus,
} from "@/repositories/feedbacks.repository";
import type { FeedbackStatus } from "@/types";

export function useFeedbacks() {
  return useQuery({ queryKey: ["feedbacks"], queryFn: listFeedbacks });
}

export function useFeedbackMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["feedbacks"] });

  return {
    createFeedback: useMutation({ mutationFn: createFeedback, onSuccess: invalidate }),
    updateStatus: useMutation({
      mutationFn: ({
        id,
        status,
        response,
      }: {
        id: string;
        status: FeedbackStatus;
        response?: string;
      }) => updateFeedbackStatus(id, status, response),
      onSuccess: invalidate,
    }),
  };
}
