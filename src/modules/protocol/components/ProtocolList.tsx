import { Stack } from "@mui/material";

import { EmptyProtocolMessage } from "./EmptyProtocolMessage";
import { useEffect, useRef } from "react";
import { ProtocolMessage } from "./ProtocolMessage";

type ProtocolTarget = "user" | "engineer";

export type ProtocolEntry = {
  id: string;
  author: string;
  target: ProtocolTarget;
  text: string;
  atRaw: string;
};

export const ProtocolList = () => {
  const protocolListRef = useRef<HTMLDivElement | null>(null);
  const orderedEntries = [] as ProtocolEntry[];

  const isEmptyList = orderedEntries.length === 0;

  useEffect(() => {
    const listNode = protocolListRef.current;
    if (!listNode) return;

    const frameId = requestAnimationFrame(() => {
      listNode.scrollTop = listNode.scrollHeight;
    });

    return () => cancelAnimationFrame(frameId);
  }, [orderedEntries.length]);

  return (
    <Stack
      ref={protocolListRef}
      spacing={1}
      sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}
    >
      {isEmptyList && <EmptyProtocolMessage />}

      {orderedEntries.map((entry) => (
        <ProtocolMessage key={entry.id} entry={entry} />
      ))}
    </Stack>
  );
};
