import React, { useState } from "react";
import { Box, Text } from "ink";
import { TextInput } from "./TextInput.js";

export const App = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = (value: string) => {
    if (value.trim()) {
      setMessages((prev) => [...prev, value]);
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor="cyan" paddingX={2} marginBottom={1}>
        <Text bold color="cyan">
          React Terminal Demo
        </Text>
      </Box>

      {messages.map((msg, i) => (
        <Text key={i} dimColor>
          {">"} {msg}
        </Text>
      ))}

      <TextInput onSubmit={handleSubmit} />
    </Box>
  );
};
