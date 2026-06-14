import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCoupon, listCoupons, updateCoupon } from "@/repositories/coupons.repository";

export function useCoupons() {
  return useQuery({ queryKey: ["coupons"], queryFn: listCoupons });
}

export function useCouponMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["coupons"] });

  return {
    createCoupon: useMutation({ mutationFn: createCoupon, onSuccess: invalidate }),
    updateCoupon: useMutation({ mutationFn: updateCoupon, onSuccess: invalidate }),
  };
}
