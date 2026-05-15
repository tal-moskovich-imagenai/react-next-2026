import React from "react";
import { Box, Text } from "ink";

export const App = () => {
  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor="cyan" paddingX={2} marginBottom={1}>
        <Text bold color="cyan">
          React Terminal Demo
        </Text>
      </Box>
      <Text>Hello from your terminal React app!</Text>
    </Box>
  );
};
