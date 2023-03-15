import { useCallback, useState } from "react";
import { trpc } from "~/utils/trpc";

export const useHandleMessageDelete = () => {
  const ctx = trpc.useContext();
  const [isLoading, setIsLoading] = useState(false);

  const deleteMutation = trpc.msg.delete.useMutation({
    onSuccess: () => {
      ctx.msg.list.invalidate();
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const handler = useCallback((id: string) => {
    setIsLoading(true);
    deleteMutation.mutate(id);
  }, []);

  return { handler, isLoading };
};
