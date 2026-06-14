import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  bulkDeleteProducts,
  bulkUpdateProducts,
  createProduct,
  duplicateProduct,
  listProducts,
  removeProduct,
  subscribeProducts,
  updateProduct,
} from "@/repositories/products.repository";
import type { Product, ProductStatus } from "@/types";

export function useProducts() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["products"],
    queryFn: listProducts,
  });

  useEffect(() => {
    return subscribeProducts((products) => {
      queryClient.setQueryData(["products"], products);
    });
  }, [queryClient]);

  return query;
}

export function useProductMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["products"] });

  return {
    createProduct: useMutation({
      mutationFn: createProduct,
      onSuccess: invalidate,
    }),
    updateProduct: useMutation({
      mutationFn: updateProduct,
      onSuccess: invalidate,
    }),
    removeProduct: useMutation({
      mutationFn: removeProduct,
      onSuccess: invalidate,
    }),
    duplicateProduct: useMutation({
      mutationFn: ({ id, product }: { id: string; product: Product }) =>
        duplicateProduct(id, product),
      onSuccess: invalidate,
    }),
    bulkUpdateProducts: useMutation({
      mutationFn: ({ ids, status }: { ids: string[]; status: ProductStatus }) =>
        bulkUpdateProducts(ids, status),
      onSuccess: invalidate,
    }),
    bulkDeleteProducts: useMutation({
      mutationFn: bulkDeleteProducts,
      onSuccess: invalidate,
    }),
  };
}
