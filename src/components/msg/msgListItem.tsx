import React, { useCallback } from "react";
import {
  ActionIcon,
  Box,
  createStyles,
  getStylesRef,
  Image,
  Loader,
  Modal,
  Text,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { MsgListItem } from "~/server/modules/msg/msg.model";
import { formattedDateTime } from "~/utils/dateTime";
import { useHandleMessageDelete } from "../../../hooks/msg/useHandleMessageDelete";
import { useDisclosure } from "@mantine/hooks";

interface StyleProps {
  hasImage: boolean;
}

const useStyles = createStyles((theme, { hasImage }: StyleProps) => ({
  root: {
    marginBottom: "0.75rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  innerBox: {
    minWidth: hasImage ? 110 : "unset",
    maxWidth: hasImage ? "min(600px, 75%)" : "75%",
    position: "relative",
    paddingRight: "2rem",

    [`&:hover .${getStylesRef("delete")}`]: {
      visibility: "visible",
      opacity: 1,
    },
  },
  img: {
    cursor: "pointer",
    "& img": {
      maxHeight: 500,
      objectFit: "cover",
    },
  },
  textBox: {
    backgroundColor: theme.white,
    padding: "0.625rem 0.75rem",
    color: theme.colors.dark[6],
    whiteSpace: "pre-line",
  },
  timestamp: {
    marginTop: "0.25rem",
    fontSize: theme.fontSizes.xs,
    color: theme.colors.dark[4],
  },
  delete: {
    ref: getStylesRef("delete"),
    visibility: "hidden",
    transition: "opacity 0.3s",
    opacity: 0,
    position: "absolute",
    right: 0,
    top: 0,

    "&:hover svg": {
      stroke: theme.colors.red[6],
    },
  },
  loader: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  fullImg: {
    maxWidth: "80vw",
    maxHeight: "80vh",
    objectFit: "contain",
  },
}));

interface Props {
  msg: MsgListItem;
}

function MsgListItem({ msg }: Props) {
  const { classes } = useStyles({ hasImage: !!msg.hasImage });
  const [opened, { open, close }] = useDisclosure(false);

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
          <Image
            src={msg.imgUrl}
            className={classes.img}
            alt={msg.text}
            onClick={open}
            withPlaceholder
          />
        ) : null}

        {isLoading ? (
          <Loader size="sm" className={classes.loader} />
        ) : (
          <ActionIcon className={classes.delete}>
            <IconTrash onClick={handleDelete} color="gray" />
          </ActionIcon>
        )}
      </Box>

      <Text className={classes.timestamp}>
        {formattedDateTime(msg.createdAt)}
      </Text>

      {msg.imgUrl ? (
        <Modal opened={opened} onClose={close} centered size="auto">
          <img src={msg.imgUrl} alt={msg.text} className={classes.fullImg} />
        </Modal>
      ) : null}
    </Box>
  );
}

export default MsgListItem;
