import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { FormValues } from "~/components/msg/msgForm.helpers";
import { uploadFileToUrl } from "~/utils/file";
import { trpc } from "~/utils/trpc";

export function useHandleMsgSend() {
  const ctx = trpc.useContext();

  const uploadMutation = useMutation({
    mutationFn: uploadFileToUrl,
    onSuccess: () => {
      ctx.msg.list.invalidate();
    },
  });

  const addMutation = trpc.msg.add.useMutation({
    onSuccess: ({ preSignedUrl }) => {
      if (!preSignedUrl) ctx.msg.list.invalidate();
    },
  });

  // send request to add message
  const handler = useCallback(
    (values: FormValues, onSuccess?: (id: string) => void) => {
      addMutation.mutate(
        { text: values.text, hasImage: !!values.image },
        {
          onSuccess: ({ preSignedUrl, msgId }) => {
            // send request to upload image if url is returned
            if (preSignedUrl && values.image)
              uploadMutation.mutate(
                { file: values.image, url: preSignedUrl },
                { onSuccess: () => onSuccess?.(msgId) }
              );
            else onSuccess?.(msgId);
          },
        }
      );
    },
    [addMutation.mutate, uploadMutation.mutate]
  );

  return {
    handler,
    isLoading: addMutation.isLoading || uploadMutation.isLoading,
  };
}
