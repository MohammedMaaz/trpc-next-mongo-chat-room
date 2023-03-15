import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { FormValues } from "~/components/msg/msgForm.helpers";
import { uploadFileToUrl } from "~/utils/file";
import { trpc } from "~/utils/trpc";

export function useHandleMessageSend() {
  const ctx = trpc.useContext();

  const uploadMutation = useMutation({
    mutationFn: uploadFileToUrl,
    onSuccess: () => {
      ctx.msg.list.invalidate();
    },
  });

  const addMutation = trpc.msg.add.useMutation({
    onSuccess: (url) => {
      if (!url) ctx.msg.list.invalidate();
    },
  });

  // send request to add message
  const handler = useCallback((values: FormValues) => {
    addMutation.mutate(
      { text: values.text, hasImage: !!values.image },
      {
        onSuccess: (url) => {
          // send request to upload image if url is returned
          if (url && values.image)
            uploadMutation.mutate({ file: values.image, url });
        },
      }
    );
  }, []);

  return {
    handler,
    isLoading: addMutation.isLoading || uploadMutation.isLoading,
  };
}
