import axios from "axios";
export * from "./servers";

export const API_V1_URL =
  (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000") + "/api/v1";


export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function handleApiRequest<T>(
  url: string,
  options?: RequestInit,
  access_token?: string,
): Promise<T> {
  try {
    const response = await axios({
      url,
      method: options?.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(access_token && {
          Authorization: `Bearer ${access_token}`,
        }),
        ...options?.headers,
      },
      data: options?.body,
      ...((options as any)?.next && {
        headers: {
          ...options?.headers,
          "Cache-Control": `s-maxage=${(options as any).next.revalidate}`,
        },
      }),
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        `API request failed: ${error.response?.statusText || error.message}`,
        error.response?.status,
      );
    }
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

function createApiMethod(method: string) {
  return async function<T>(
    url: string,
    dataOrOptions?: any,
    maybeOptions?: Omit<RequestInit, 'method' | 'body'>,
    access_token?: string
  ): Promise<T> {
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);
    const options = hasBody
      ? { ...maybeOptions, method, body: dataOrOptions ? JSON.stringify(dataOrOptions) : undefined }
      : { ...dataOrOptions, method };

    return handleApiRequest<T>(`${API_V1_URL}${url}`, options, access_token);
  };
}

export const api = {
  get: createApiMethod('GET'),
  post: createApiMethod('POST'),
  put: createApiMethod('PUT'),
  patch: createApiMethod('PATCH'),
  delete: createApiMethod('DELETE'),
};
