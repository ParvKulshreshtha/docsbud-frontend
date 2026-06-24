import axios from "axios";

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof (data as { message?: unknown }).message === "string"
    ) {
      const message = (data as { message?: string }).message;
      if (message) return message;
    }
    return err.message;
  }
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Request failed";
}
