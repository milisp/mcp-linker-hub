export const API_V1_URL =
  process.env.NEXT_PUBLIC_API_URL + "/api/v1" || "http://localhost:8000/api/v1";
import axios from "axios";

export * from "./servers";

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
): Promise<T> {
  try {
    const response = await axios({
      url,
      method: options?.method || "GET",
      headers: {
        "Content-Type": "application/json",
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
