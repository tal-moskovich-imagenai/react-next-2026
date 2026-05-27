import React, { useState } from "react";
import { Box } from "ink";
import { ModelSelect } from "./components/ModelSelect.js";
import { Chat } from "./components/Chat.js";
import { TrollCodeBanner } from "./components/TrollCodeBanner.js";

export const App = () => {
  const [model, setModel] = useState<string | null>(null);

  if (!model) {
    return (
      <Box flexDirection="column" padding={1}>
        <TrollCodeBanner />
        <ModelSelect onSelect={setModel} />
      </Box>
    );
  }

  return <Chat model={model} />;
};
