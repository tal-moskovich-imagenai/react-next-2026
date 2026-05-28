import React, { useState } from "react";
import { Box, Text, useApp } from "ink";
import { useStream } from "../hooks/useStream.js";
import { TextInput } from "./TextInput.js";

interface Message {
  role: "user" | "assistant";
  content: string;
  displayText?: string;
}

type StaticItem = { kind: "header" } | { kind: "message"; msg: Message };

// ── Sub-components ────────────────────────────────────────────────────────────

const Header = ({ model }: { model: string }) => (
  <Box borderStyle="round" borderColor="cyan" paddingX={2} marginBottom={1}>
    <Text bold color="cyan">
      AI Terminal{" "}
    </Text>
    <Text dimColor>model: {model} · q to quit</Text>
  </Box>
);

const MessageRow = ({ msg }: { msg: Message }) => (
  <Box marginBottom={1} flexDirection="column">
    <Text color={msg.role === "user" ? "yellow" : "green"} bold>
      {msg.role === "user" ? "You" : "AI"}
    </Text>
    <Box paddingLeft={2}>
      <Text>{msg.displayText ?? msg.content}</Text>
    </Box>
  </Box>
);

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  model: string;
}

export const Chat = ({ model }: Props) => {
  const { exit } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const { content, error, send } = useStream(model);

  const handleSubmit = (value: string) => {};

  return <TextInput onSubmit={handleSubmit} />;
};
