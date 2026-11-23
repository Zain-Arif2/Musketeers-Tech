import type { ApiErrorResponse, ApiValidationErrorDetail } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;
  details?: ApiValidationErrorDetail[];

  constructor(status: number, message: string, details?: ApiValidationErrorDetail[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }

  /**
   * Helper to get a dictionary of field -> message for easy form error display
   */
  getFieldErrors(): Record<string, string> {
    if (!this.details || !Array.isArray(this.details)) return {};
    return this.details.reduce<Record<string, string>>((acc, item) => {
      acc[item.field] = item.message;
      return acc;
    }, {});
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...restOptions } = options;

  let url = `${API_BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      },
      ...restOptions,
    });
  } catch (err) {
    throw new ApiError(
      0,
      err instanceof Error && err.message
        ? `Unable to connect to the server: ${err.message}`
        : "Network error: Unable to connect to the API server."
    );
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  const contentType = response.headers.get("content-type");
  let data: unknown;
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorBody = data as ApiErrorResponse | null;
    const message = errorBody?.error || response.statusText || `Request failed with status ${response.status}`;
    throw new ApiError(response.status, message, errorBody?.details);
  }

  return data as T;
}

