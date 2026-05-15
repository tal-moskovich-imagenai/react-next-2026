import React, { useState, useOptimistic, useTransition } from "react";
import { Box, Text, Static, useInput, useApp } from "ink";
import { TextInput } from "./TextInput.js";
import { Spinner } from "./Spinner.js";
import { useStream } from "./useStream.js";
import { ModelSelect } from "./ModelSelect.js";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const App = () => {
  const { exit } = useApp();
  const [model, setModel] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { content, error, send } = useStream(model ?? "gpt-4o-mini");
  const [isPending, startTransition] = useTransition();

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (current, newMessage: Message) => [...current, newMessage],
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

  if (!model) {
    return (
      <Box flexDirection="column" padding={1}>
        <Box borderStyle="round" borderColor="cyan" paddingX={2} marginBottom={1}>
          <Text bold color="cyan">AI Terminal</Text>
        </Box>
        <ModelSelect onSelect={setModel} />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor="cyan" paddingX={2} marginBottom={1}>
        <Text bold color="cyan">AI Terminal </Text>
        <Text dimColor>model: {model} (q to quit)</Text>
      </Box>

      {/* Committed messages — rendered once to stdout, never re-diffed.
          The longer the conversation, the bigger the benefit. */}
      <Static items={optimisticMessages}>
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

      {/* Live streaming region — only this area diffs on every token */}
      {isPending && (
        <Box flexDirection="column" marginBottom={1}>
          <Text color="green" bold>AI</Text>
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
