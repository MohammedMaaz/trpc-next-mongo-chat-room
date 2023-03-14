import { Box, Loader } from "@mantine/core";
import React from "react";
import { MsgListItem } from "~/server/modules/msg/msg.model";
import ListItem from "./msgListItem";

interface Props {
  list: MsgListItem[];
  loading?: boolean;
}

function MsgList({ list, loading }: Props) {
  return (
    <Box>
      {loading ? (
        <Box>
          <Loader />
        </Box>
      ) : null}
      {list.map((msg) => (
        <ListItem key={msg._id} msg={msg} />
      ))}
    </Box>
  );
}

export default MsgList;
