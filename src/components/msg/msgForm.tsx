import React, { useCallback, useRef } from "react";
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
  TextInput,
} from "@mantine/core";
import { IconPaperclip } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.white,
    padding: "0.75rem",
    display: "flex",
    flexDirection: "row",
    gap: "1rem",
  },
  textIp: {
    flex: 1,
  },
}));

interface Props {
  onSubmit: (values: FormValues) => void;
  loading?: boolean;
}

function MsgForm({ onSubmit, loading }: Props) {
  const { classes } = useStyles();
  const resetRef = useRef<() => void>(null);

  const form = useForm({
    initialValues: getInitialValues(),
    validate: zodResolver(validationSchema),
  });

  const handleSubmit = useCallback(
    (values: FormValues) => {
      onSubmit(values);
      form.reset();
    },
    [onSubmit]
  );

  const onFileChange = useCallback((file: File | null) => {
    if (file) form.setFieldValue("image", file);
  }, []);

  const onFileRemove = useCallback(() => {
    form.setFieldValue("image", undefined);
    resetRef.current?.();
  }, []);

  return (
    <form className={classes.root} onSubmit={form.onSubmit(handleSubmit)}>
      {form.values.image ? (
        <Box p={12} pb={0} pos="relative">
          <Image
            alt="image to upload"
            w={160}
            h={140}
            src={URL.createObjectURL(form.values.image)}
            fit="contain"
          />
          <CloseButton
            title="remove image"
            onClick={onFileRemove}
            pos="absolute"
            right={-12}
            top={-12}
          />
        </Box>
      ) : null}

      <TextInput
        placeholder="Enter Message ..."
        className={classes.textIp}
        {...form.getInputProps("text")}
      />

      <FileButton resetRef={resetRef} onChange={onFileChange} accept="image/*">
        {(props) => (
          <ActionIcon variant="outline" {...props}>
            <IconPaperclip />
          </ActionIcon>
        )}
      </FileButton>

      <Button type="submit" loading={loading}>
        SEND
      </Button>
    </form>
  );
}

export default MsgForm;
