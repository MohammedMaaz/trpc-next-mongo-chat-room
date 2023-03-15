import { useCallback } from "react";
import { Box, createStyles } from "@mantine/core";
import MsgForm from "~/components/msg/msgForm";
import MsgList from "~/components/msg/msgList";
import { useOnScrollEndReached } from "../../hooks/common/useOnScrollEndReached";
import { useInfiniteMessagesList } from "../../hooks/msg/useInfiniteMessagesList";
import { useHandleMessageSend } from "../../hooks/msg/useHandleMessageSend";

const useStyles = createStyles(() => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
}));

export default function IndexPage() {
  const { classes } = useStyles();

  const { list, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteMessagesList();

  const { handler, isLoading: isSentLoading } = useHandleMessageSend();

  // Infinite scroll handling
  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const { ref } = useOnScrollEndReached(onEndReached, { direction: "up" });

  return (
    <Box className={classes.root}>
      <MsgList
        containerRef={ref as React.RefObject<HTMLDivElement>}
        list={list || []}
        loading={isLoading}
        loadingMore={isFetchingNextPage}
      />
      <MsgForm onSubmit={handler} loading={isSentLoading} />
    </Box>
  );
}
