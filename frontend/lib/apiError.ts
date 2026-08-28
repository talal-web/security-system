import axios from "axios";

export function getApiErrorMessage(error: unknown): string {
  // Axios error
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }

  // Normal JS error
  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error occurred";
}

export function getApiErrorStatus(error: unknown): number | undefined {
  if (axios.isAxiosError(error)) {
    return error.response?.status;
  }

  return undefined;
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
