import { notifications } from "@mantine/notifications";

export function globalErrorHandler(error: Error | unknown): void {
  let message = "An unknown error occurred!";

  if (typeof error === "string") message = error;
  if (error instanceof Error) message = error.message;

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    message = error.message;
  }

  console.error("error: ", message, error);
  notifications.show({ title: "Error", message, color: "red" });
}
