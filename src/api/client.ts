import { env } from "../config/env";
import { ApiRequestError, type ApiResponse } from "../types/api";

export type GetToken = () => Promise<string>;

type RequestOptions = Readonly<{
  method?: string;
  body?: unknown;
  authenticated?: boolean;
}>;

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    const code = payload.error?.code ?? "INTERNAL_ERROR";
    const message =
      typeof payload.error?.message === "string"
        ? payload.error.message
        : `Request failed with status ${response.status}`;

    throw new ApiRequestError(response.status, code, message, payload.error?.message);
  }

  if (payload.data === undefined) {
    throw new ApiRequestError(response.status, "INTERNAL_ERROR", "Response missing data field");
  }

  return payload.data;
}

export async function apiRequest<T>(
  getToken: GetToken | undefined,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, authenticated = true } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (authenticated) {
    if (!getToken) {
      throw new ApiRequestError(401, "UNAUTHORIZED", "Authentication required");
    }

    const token = await getToken();
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  return parseResponse<T>(response);
}
