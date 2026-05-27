import React, { useState } from "react";
import { Box, Text } from "ink";
import { ModelSelect } from "./ModelSelect.js";
import { Chat } from "./Chat.js";

export const App = () => {
  const [model, setModel] = useState<string | null>(null);

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

  return <Chat model={model} />;
};
