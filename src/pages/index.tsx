import { useCallback } from "react";
import { FormValues } from "~/components/pages/home/msgForm.helpers";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import { uploadFileToUrl } from "~/utils/file";
import { Box, createStyles } from "@mantine/core";
import MsgForm from "~/components/pages/home/msgForm";
import MsgList from "~/components/pages/home/msgList";

const useStyles = createStyles((theme) => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
}));

export default function IndexPage() {
  const { classes } = useStyles();
  const ctx = trpc.useContext();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = trpc.msg.list.useInfiniteQuery(
    { limit: 10 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
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

  const handleSubmit = useCallback((values: FormValues) => {
    addMutation.mutate(
      { text: values.text, hasImage: !!values.image },
      {
        onSuccess: (url) => {
          if (url && values.image)
            uploadMutation.mutate({ file: values.image, url });
        },
      }
    );
  }, []);

  const list = data?.pages.map((item) => item.list).flat();

  return (
    <Box className={classes.root}>
      <MsgList list={list || []} loading={isLoading} />
      <MsgForm
        onSubmit={handleSubmit}
        loading={addMutation.isLoading || uploadMutation.isLoading}
      />
    </Box>
  );
}
