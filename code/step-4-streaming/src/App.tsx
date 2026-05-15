import React, { useState, useOptimistic, useTransition } from "react";
import { Box, Text, useInput, useApp } from "ink";
import { TextInput } from "./TextInput.js";
import { Spinner } from "./Spinner.js";
import { useStream } from "./useStream.js";

interface Message {
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
}

export const App = () => {
  const { exit } = useApp();
  const [model] = useState("gpt-4o-mini");
  const [messages, setMessages] = useState<Message[]>([]);
  const { content, error, send } = useStream(model);
  const [isPending, startTransition] = useTransition();

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (current, newMessage: Message) => [
      ...current,
      { ...newMessage, pending: true },
    ],
  );

  useInput((input) => {
    if (input === "q" && !isPending) exit();
  });

  const handleSubmit = (value: string) => {
    if (!value.trim() || isPending) return;

    startTransition(async () => {
      const userMsg: Message = { role: "user", content: value };

      addOptimisticMessage(userMsg);

      const history = [...messages, userMsg];
      const finalText = await send(history);

      setMessages((prev) => [
        ...prev,
        userMsg,
        { role: "assistant", content: finalText },
      ]);
    });
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor="cyan" paddingX={2} marginBottom={1}>
        <Text bold color="cyan">
          AI Terminal{" "}
        </Text>
        <Text dimColor>model: {model} (q to quit)</Text>
      </Box>

      {optimisticMessages.map((msg, i) => (
        <Box key={i} marginBottom={1} flexDirection="column">
          <Text color={msg.role === "user" ? "yellow" : "green"} bold>
            {msg.role === "user" ? "You" : "AI"}
            {msg.pending && <Text dimColor> sending…</Text>}
          </Text>
          <Box paddingLeft={2}>
            <Text dimColor={msg.pending}>{msg.content}</Text>
          </Box>
        </Box>
      ))}

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

      {error && (
        <Box>
          <Text color="red">Error: {error.message}</Text>
        </Box>
      )}

      {!isPending && <TextInput onSubmit={handleSubmit} />}
    </Box>
  );
};
