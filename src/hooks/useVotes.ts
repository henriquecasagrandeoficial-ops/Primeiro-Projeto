import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createVote, listVotes, updateVote } from "@/repositories/votes.repository";

export function useVotes() {
  return useQuery({ queryKey: ["votes"], queryFn: listVotes });
}

export function useVoteMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["votes"] });

  return {
    createVote: useMutation({ mutationFn: createVote, onSuccess: invalidate }),
    updateVote: useMutation({ mutationFn: updateVote, onSuccess: invalidate }),
  };
}
