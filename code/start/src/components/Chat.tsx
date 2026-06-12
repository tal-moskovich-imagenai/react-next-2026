import React, { useState, useTransition } from "react";
import { Box, Static, Text, useApp, useInput } from "ink";
import { useStream } from "../hooks/useStream.js";
import { TextInput } from "./TextInput.js";
import { Attachments } from "../hooks/useFilePicker.js";

interface Message {
  role: "user" | "assistant";
  content: string;
  displayText?: string;
}

type StaticItem = { type: "header" } | { type: "message"; msg: Message };

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
  const [isPending, startTransition] = useTransition();

  useInput((input, key) => {
    if (input === "q" && !isPending) exit();
  });

  const handleSubmit = (value: string, attachments: Attachments) => {
    if (!value.trim()) return;

    const fileContext = Object.entries(attachments)
      .map(([name, content]) => `<file name="${name}">\n${content}\n</file>`)
      .join("\n\n");

    const userMsg: Message = {
      role: "user",
      content: fileContext ? `${fileContext}\n\n${value}` : value,
      displayText: value,
    };

    const nextMessages = [...messages, userMsg];

    setMessages(nextMessages);

    startTransition(async () => {
      const finalText = await send(nextMessages);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: finalText },
      ]);
    });
  };

  return (
    <>
      <Static
        items={
          [
            { type: "header" as const },
            ...messages.map((msg) => ({ type: "message" as const, msg })),
          ] satisfies StaticItem[]
        }
      >
        {(item, i) => {
          if (item.type === "header") return <Header model={model} />;
          return <MessageRow key={i} msg={item.msg} />;
        }}
      </Static>

      {!isPending && <TextInput onSubmit={handleSubmit} />}

      {isPending && (
        <MessageRow msg={{ role: "assistant", content: content ?? "" }} />
      )}
      {error && <Text color="red">Error: {error.message}</Text>}
    </>
  );
};
