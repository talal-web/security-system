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
