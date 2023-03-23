import { Box, createStyles } from "@mantine/core";
import MsgForm from "~/components/msg/msgForm";
import MsgList from "~/components/msg/msgList";
import { useOnScrollEndReached } from "../../hooks/common/useOnScrollEndReached";
import { useInfiniteMsgList } from "../../hooks/msg/useInfiniteMsgList";
import { useHandleMsgSend } from "../../hooks/msg/useHandleMsgSend";
import React, { useEffect, useRef } from "react";

const useStyles = createStyles(() => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
}));

const IndexPage: React.FC = () => {
  const { classes } = useStyles();
  const lastMsgIdRef = useRef("");

  const { list, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteMsgList();

  const { handler, isLoading: isSentLoading } = useHandleMsgSend();

  // Infinite scroll handling
  const onEndReached = (): void => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const { ref } = useOnScrollEndReached(onEndReached, { direction: "up" });

  const onSubmit: typeof handler = (values, onSuccess) => {
    handler(values, (id) => {
      onSuccess?.(id);
      // Save last sent message id to use it in useEffect
      lastMsgIdRef.current = id;
    });
  };

  // Scroll to bottom on new message
  const latestId = list?.[0]?._id;
  const listElem = ref.current;
  useEffect(() => {
    if (latestId === lastMsgIdRef.current && listElem) {
      listElem.scrollTop = listElem.scrollHeight;
      lastMsgIdRef.current = "";
    }
  }, [latestId, listElem]);

  return (
    <Box className={classes.root}>
      <MsgList
        containerRef={ref as React.RefObject<HTMLDivElement>}
        list={list || []}
        loading={isLoading}
        loadingMore={isFetchingNextPage}
      />
      <MsgForm onSubmit={onSubmit} loading={isSentLoading} />
    </Box>
  );
};

export default IndexPage;
