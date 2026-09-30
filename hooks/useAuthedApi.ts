import { api } from "@/lib/api";
import { useCallback } from "react";

type RequestOptions = Omit<RequestInit, "method" | "body">;
type ApiResponse<T> = Promise<T>;

type ApiMethods = {
  get: <T>(url: string, options?: RequestOptions) => ApiResponse<T>;
  post: <T>(
    url: string,
    data?: any,
    options?: RequestOptions,
  ) => ApiResponse<T>;
  put: <T>(url: string, data?: any, options?: RequestOptions) => ApiResponse<T>;
  patch: <T>(
    url: string,
    data?: any,
    options?: RequestOptions,
  ) => ApiResponse<T>;
  delete: <T>(url: string, options?: RequestOptions) => ApiResponse<T>;
};

export function useAuthedApi(): ApiMethods {
  const get = useCallback(async <T>(url: string, options?: RequestOptions) => {
    return api.get<T>(url, undefined, options);
  }, []);

  const post = useCallback(
    async <T>(url: string, data?: any, options?: RequestOptions) => {
      return api.post<T>(url, data, options);
    },
    [],
  );

  const put = useCallback(
    async <T>(url: string, data?: any, options?: RequestOptions) => {
      return api.put<T>(url, data, options);
    },
    [],
  );

  const patch = useCallback(
    async <T>(url: string, data?: any, options?: RequestOptions) => {
      return api.patch<T>(url, data, options);
    },
    [],
  );

  const del = useCallback(async <T>(url: string, options?: RequestOptions) => {
    return api.delete<T>(url, undefined, options);
  }, []);

  return { get, post, put, patch, delete: del };
}
