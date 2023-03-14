import { notifications } from "@mantine/notifications";

export function globalErrorHandler(error: Error | any) {
  let message = "An unknown error occurred!";
  if (error instanceof Error || typeof error?.message === "string")
    message = error.message;
  else if (typeof error === "string") message = error;

  console.error("error: ", message, error);
  notifications.show({ title: "Error", message, color: "red" });
}
