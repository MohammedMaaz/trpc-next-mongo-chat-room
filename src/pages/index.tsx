import { Box, createStyles } from "@mantine/core";
import MsgForm from "~/components/msg/msgForm";
import MsgList from "~/components/msg/msgList";
import { useOnScrollEndReached } from "../../hooks/common/useOnScrollEndReached";
import { useInfiniteMsgList } from "../../hooks/msg/useInfiniteMsgList";
import { useHandleMsgSend } from "../../hooks/msg/useHandleMsgSend";

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
    useInfiniteMsgList();

  const { handler, isLoading: isSentLoading } = useHandleMsgSend();

  // Infinite scroll handling
  const onEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

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
