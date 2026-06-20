import React, { useState, useTransition } from "react";
import { Box, Text, Static, useInput, useApp } from "ink";
import { TextInput } from "./TextInput.js";
import { Spinner } from "./Spinner.js";
import { useStream } from "../hooks/useStream.js";

export interface Message {
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
      {msg.content ? (
        <Text>{msg.displayText ?? msg.content}</Text>
      ) : (
        <Spinner />
      )}
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

  useInput((input) => {
    if (input === "q" && !isPending) exit();
  });

  const handleSubmit = (value: string, attachments: Record<string, string>) => {
    if (!value.trim() || isPending) return;

    const fileContext = Object.entries(attachments)
      .map(([name, content]) => `<file name="${name}">\n${content}\n</file>`)
      .join("\n");

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
    <Box flexDirection="column" padding={1}>
      <Static
        items={
          [
            { type: "header" },
            ...messages.map((msg) => ({ type: "message" as const, msg })),
          ] satisfies StaticItem[]
        }
      >
        {(item, i) => {
          if (item.type === "header") return <Header key={i} model={model} />;
          return <MessageRow key={i} msg={item.msg} />;
        }}
      </Static>

      {isPending && (
        <Box flexDirection="column" marginBottom={1}>
          <Text color="green" bold>
            AI
          </Text>
          <Box paddingLeft={2}>
            {content ? <Text>{content}</Text> : <Spinner />}
          </Box>
        </Box>
      )}

      {error && <Text color="red">Error: {error.message}</Text>}
      {!isPending && <TextInput onSubmit={handleSubmit} />}
    </Box>
  );
};
