import { Box, createStyles, Loader } from "@mantine/core";
import React from "react";
import { MsgListItem } from "~/server/modules/msg/msg.model";
import ListItem from "./msgListItem";

const useStyles = createStyles((theme) => ({
  root: {
    overflow: "auto",
    display: "flex",
    flexDirection: "column-reverse",
    height: "100%",
    padding: "0 0.75rem",
    backgroundColor: "#D9D8D8",
  },
}));

interface Props {
  list: MsgListItem[];
  loading?: boolean;
}

function MsgList({ list, loading }: Props) {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      {loading ? (
        <Box>
          <Loader />
        </Box>
      ) : null}
      {list.map((msg) => (
        <ListItem key={msg._id} msg={msg} />
      ))}
    </div>
  );
}

export default MsgList;
