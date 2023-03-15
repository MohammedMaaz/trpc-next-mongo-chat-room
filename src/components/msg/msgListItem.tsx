import React, { useCallback } from "react";
import {
  ActionIcon,
  Box,
  createStyles,
  getStylesRef,
  Image,
  Loader,
  Text,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { MsgListItem } from "~/server/modules/msg/msg.model";
import { formattedDateTime } from "~/utils/dateTime";
import { useHandleMessageDelete } from "../../../hooks/msg/useHandleMessageDelete";

const useStyles = createStyles((theme) => ({
  root: {
    maxWidth: "min(75%, 600px)",
    position: "relative",
    paddingRight: "2rem",
    marginBottom: "1rem",

    [`&:hover .${getStylesRef("delete")}`]: {
      visibility: "visible",
      opacity: 1,
    },
  },
  innerBox: {},
  img: {
    width: "100%",
    maxHeight: "400px",
  },
  textBox: {
    width: "100%",
    backgroundColor: theme.white,
    padding: "0.75rem",
  },
  timestamp: {
    marginTop: "0.375rem",
    fontSize: theme.fontSizes.xs,
  },
  delete: {
    ref: getStylesRef("delete"),
    visibility: "hidden",
    transition: "opacity 0.3s",
    opacity: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  loader: {
    position: "absolute",
    right: 0,
    top: 0,
  },
}));

interface Props {
  msg: MsgListItem;
}

function MsgListItem({ msg }: Props) {
  const { classes } = useStyles();

  const { handler, isLoading } = useHandleMessageDelete();

  const handleDelete = useCallback(() => {
    handler(msg._id);
  }, [handler, msg._id]);

  return (
    <Box className={classes.root}>
      <Box className={classes.innerBox}>
        <Box className={classes.textBox}>
          <Text>{msg.text}</Text>
        </Box>
        {msg.hasImage ? (
          <Image src={msg.imgUrl} className={classes.img} withPlaceholder />
        ) : null}
      </Box>

      <Text className={classes.timestamp}>
        {formattedDateTime(msg.createdAt)}
      </Text>

      {isLoading ? (
        <Loader size="sm" className={classes.loader} />
      ) : (
        <ActionIcon className={classes.delete}>
          <IconTrash onClick={handleDelete} />
        </ActionIcon>
      )}
    </Box>
  );
}

export default MsgListItem;
