import * as z from "zod";

export const validationSchema = z.object({
  text: z.string().trim().min(1, "Please enter a message"),
  image: typeof File !== "undefined" ? z.instanceof(File).optional() : z.any(),
});

export type FormValues = z.infer<typeof validationSchema>;

export const getInitialValues = (): FormValues => {
  return {
    text: "",
  };
};
