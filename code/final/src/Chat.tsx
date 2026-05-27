import React, { useState, useTransition, useCallback } from "react";
import { Box, Text, Static, useInput, useApp } from "ink";
import { TextInput } from "./TextInput.js";
import { Spinner } from "./Spinner.js";
import { useStream } from "./useStream.js";

interface Message {
  role: "user" | "assistant";
  content: string;
}

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

  const handleSubmit = useCallback(
    (value: string) => {
      if (!value.trim() || isPending) return;

      const userMsg: Message = { role: "user", content: value };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);

      startTransition(async () => {
        const finalText = await send(nextMessages);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: finalText },
        ]);
      });
    },
    [isPending, messages, send],
  );

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor="cyan" paddingX={2} marginBottom={1}>
        <Text bold color="cyan">
          AI Terminal{" "}
        </Text>
        <Text dimColor>model: {model} (q to quit)</Text>
      </Box>

      <Static items={messages}>
        {(msg, i) => (
          <Box key={i} marginBottom={1} flexDirection="column">
            <Text color={msg.role === "user" ? "yellow" : "green"} bold>
              {msg.role === "user" ? "You" : "AI"}
            </Text>
            <Box paddingLeft={2}>
              <Text>{msg.content}</Text>
            </Box>
          </Box>
        )}
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
