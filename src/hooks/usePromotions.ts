import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPromotion, listPromotions, updatePromotion } from "@/repositories/promotions.repository";

export function usePromotions() {
  return useQuery({ queryKey: ["promotions"], queryFn: listPromotions });
}

export function usePromotionMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["promotions"] });

  return {
    createPromotion: useMutation({ mutationFn: createPromotion, onSuccess: invalidate }),
    updatePromotion: useMutation({ mutationFn: updatePromotion, onSuccess: invalidate }),
  };
}
