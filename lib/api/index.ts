export * from "./servers";
export const API_V1_URL = "/api/v1";
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
  _legacyToken?: string,
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(
      body?.detail || `Request failed (${response.status})`,
      response.status,
    );
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}
function createApiMethod(method: string) {
  return async function <T>(
    url: string,
    dataOrOptions?: unknown,
    maybeOptions?: Omit<RequestInit, "method" | "body">,
    _legacyToken?: string,
  ): Promise<T> {
    const hasBody = ["POST", "PUT", "PATCH"].includes(method);
    const options = hasBody
      ? {
          ...maybeOptions,
          method,
          body:
            dataOrOptions === undefined
              ? undefined
              : JSON.stringify(dataOrOptions),
        }
      : {
          ...(dataOrOptions as RequestInit | undefined),
          ...maybeOptions,
          method,
        };
    return handleApiRequest<T>(`${API_V1_URL}${url}`, options);
  };
}
export const api = {
  get: createApiMethod("GET"),
  post: createApiMethod("POST"),
  put: createApiMethod("PUT"),
  patch: createApiMethod("PATCH"),
  delete: createApiMethod("DELETE"),
};
