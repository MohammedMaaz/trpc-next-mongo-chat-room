import React, { useCallback, useMemo, useRef } from "react";
import { useForm, zodResolver } from "@mantine/form";
import {
  FormValues,
  getInitialValues,
  validationSchema,
} from "./msgForm.helpers";
import {
  ActionIcon,
  Box,
  Button,
  CloseButton,
  createStyles,
  FileButton,
  Image,
  Textarea,
} from "@mantine/core";
import { IconPaperclip } from "@tabler/icons-react";

const useStyles = createStyles((theme) => {
  // issue with manitine theme overrides being resolved as undefined by jest dom
  const primaryColor =
    process.env.NODE_ENV === "test"
      ? theme.colors.blue[6]
      : theme.colors.navyBlue[6];

  return {
    root: {
      backgroundColor: theme.white,
      padding: "0.75rem",
      display: "flex",
      flexDirection: "row",
      gap: "1rem",
      position: "relative",
      alignItems: "flex-start",
    },
    textIp: {
      flex: 1,
      "& textarea": {
        borderColor: primaryColor,
        "&:focus:not([data-invalid])": {
          outline: `1px solid ${primaryColor}`,
        },
      },
    },
    imgBox: {
      display: "flex",
      position: "absolute",
      bottom: "100%",
      paddingBottom: "0.75rem",
    },
    img: {
      "& img": {
        objectFit: "contain",
        minWidth: "100px",
        maxWidth: "min(600px, 70vw)",
        maxHeight: "min(600px, 70vh)",
      },
    },
  };
});

interface Props {
  onSubmit: (values: FormValues, onSuccess?: () => void) => void;
  loading?: boolean;
}

function MsgForm({ onSubmit, loading }: Props) {
  const { classes } = useStyles();
  const resetRef = useRef<() => void>(null);

  const form = useForm({
    initialValues: getInitialValues(),
    validate: zodResolver(validationSchema),
  });

  const handleSubmit = useMemo(
    () =>
      form.onSubmit((values: FormValues) => {
        onSubmit(values, () => {
          form.reset();
          resetRef.current?.();
        });
      }),
    [form, onSubmit]
  );

  const handleFileChange = useCallback(
    (file: File | null) => {
      if (file) form.setFieldValue("image", file);
    },
    [form]
  );

  const handleFileRemove = useCallback(() => {
    form.setFieldValue("image", undefined);
    resetRef.current?.();
  }, [form]);

  // Allow pasting images
  const handlePaste: React.ClipboardEventHandler<HTMLTextAreaElement> =
    useCallback(
      (e) => {
        if (e.clipboardData.files.length) {
          form.setFieldValue("image", e.clipboardData.files[0]);
          resetRef.current?.();
        }
      },
      [form]
    );

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    // Shift + Enter = new line | Enter = submit
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      {form.values.image ? (
        <Box className={classes.imgBox}>
          <Image
            alt="image to upload"
            src={URL.createObjectURL(form.values.image)}
            className={classes.img}
          />
          <CloseButton
            title="remove image"
            onClick={handleFileRemove}
            pos="relative"
            left={-16}
            top={-8}
            variant="filled"
            color="red"
            disabled={loading}
          />
        </Box>
      ) : null}

      <Textarea
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        placeholder="Enter Message ..."
        className={classes.textIp}
        autosize
        minRows={1}
        maxRows={4}
        disabled={loading}
        {...form.getInputProps("text")}
      />

      <FileButton
        disabled={loading}
        resetRef={resetRef}
        onChange={handleFileChange}
        accept="image/*"
      >
        {(props) => (
          <ActionIcon
            disabled={loading}
            variant="outline"
            color="navyBlue"
            {...props}
            size="xl"
          >
            <IconPaperclip />
          </ActionIcon>
        )}
      </FileButton>

      <Button type="submit" loading={loading} size="md" h="44">
        SEND
      </Button>
    </form>
  );
}

export default MsgForm;
