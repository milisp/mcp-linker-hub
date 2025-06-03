// src/hooks/useCategories.ts

import { API_V1_URL } from "@/lib/api";
import axios from "axios";
import useSWR from "swr";

export const fetcher = (url: string) =>
  axios.get(`${API_V1_URL}${url}`).then((res) => res.data);

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR(
    "/categories/simple",
    fetcher,
    {
      dedupingInterval: 60 * 60 * 1000, // 1 hour in milliseconds
    },
  );

  return {
    categories: ["all", ...(data ?? [])],
    isLoading,
    error,
    mutate,
  };
}
