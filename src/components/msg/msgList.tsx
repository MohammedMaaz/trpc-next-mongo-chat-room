import React from "react";
import { Box, createStyles, Loader } from "@mantine/core";
import { MsgListItem } from "~/server/modules/msg/msg.model";
import ListItem from "./msgListItem";

const useStyles = createStyles(() => ({
  root: {
    overflow: "auto",
    display: "flex",
    flexDirection: "column-reverse",
    height: "100%",
    padding: "0 0.75rem",
    backgroundColor: "#D9D8D8",
  },
  loader: {
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
  },
  loaderMore: {
    position: "absolute",
    top: "1rem",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1,
  },
}));

interface Props {
  list: MsgListItem[];
  loading?: boolean;
  loadingMore?: boolean;
  containerRef?: React.RefObject<HTMLDivElement>;
}

function MsgList({ list, loading, loadingMore, containerRef }: Props) {
  const { classes } = useStyles();

  return (
    <div ref={containerRef} className={classes.root}>
      {loading ? (
        <Box className={classes.loader}>
          <Loader size="lg" />
        </Box>
      ) : (
        list.map((msg) => <ListItem key={msg._id} msg={msg} />)
      )}

      {loadingMore ? (
        <Box className={classes.loaderMore}>
          <Loader size="sm" />
        </Box>
      ) : null}
    </div>
  );
}

export default MsgList;
