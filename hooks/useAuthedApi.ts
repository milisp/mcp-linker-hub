import { useSupabase } from "@/components/providers/supabase-provider";
import { api } from "@/lib/api";
import { useCallback } from "react";

type RequestOptions = Omit<RequestInit, 'method' | 'body'>;
type ApiResponse<T> = Promise<T>;

type ApiMethods = {
  get: <T>(url: string, options?: RequestOptions) => ApiResponse<T>;
  post: <T>(url: string, data?: any, options?: RequestOptions) => ApiResponse<T>;
  put: <T>(url: string, data?: any, options?: RequestOptions) => ApiResponse<T>;
  patch: <T>(url: string, data?: any, options?: RequestOptions) => ApiResponse<T>;
  delete: <T>(url: string, options?: RequestOptions) => ApiResponse<T>;
};

export function useAuthedApi(): ApiMethods {
  const { getAccessToken } = useSupabase();

  const get = useCallback(async <T>(url: string, options?: RequestOptions) => {
    const token = await getAccessToken();
    if (!token) throw new Error("No access token available");
    return api.get<T>(url, undefined, options, token);
  }, [getAccessToken]);

  const post = useCallback(async <T>(url: string, data?: any, options?: RequestOptions) => {
    const token = await getAccessToken();
    if (!token) throw new Error("No access token available");
    return api.post<T>(url, data, options, token);
  }, [getAccessToken]);

  const put = useCallback(async <T>(url: string, data?: any, options?: RequestOptions) => {
    const token = await getAccessToken();
    if (!token) throw new Error("No access token available");
    return api.put<T>(url, data, options, token);
  }, [getAccessToken]);

  const patch = useCallback(async <T>(url: string, data?: any, options?: RequestOptions) => {
    const token = await getAccessToken();
    if (!token) throw new Error("No access token available");
    return api.patch<T>(url, data, options, token);
  }, [getAccessToken]);

  const del = useCallback(async <T>(url: string, options?: RequestOptions) => {
    const token = await getAccessToken();
    if (!token) throw new Error("No access token available");
    return api.delete<T>(url, undefined, options, token);
  }, [getAccessToken]);

  return { get, post, put, patch, delete: del };
}