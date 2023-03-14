import * as z from "zod";
import { msgSchema } from "~/server/modules/msg/msg.model";

export const validationSchema = z.object({
  text: msgSchema.shape.text,
  image: typeof File !== "undefined" ? z.instanceof(File).optional() : z.any(),
});

export type FormValues = z.infer<typeof validationSchema>;

export const getInitialValues = (): FormValues => {
  return {
    text: "",
  };
};
