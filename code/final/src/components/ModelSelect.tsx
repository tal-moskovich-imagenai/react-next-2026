import { useState, use, Suspense } from "react";
import { Box, Text, useInput } from "ink";
import { modelsPromise } from "../api/fetchModels.js";
import { Spinner } from "./Spinner.js";

interface Props {
  onSelect: (modelId: string) => void;
}

const ModelList = ({ onSelect }: Props) => {
  const models = use(modelsPromise);
  const [cursor, setCursor] = useState(0);

  useInput((_input, key) => {
    if (key.upArrow) setCursor((prev) => Math.max(0, prev - 1));
    if (key.downArrow)
      setCursor((prev) => Math.min(models.length - 1, prev + 1));
    if (key.return) onSelect(models[cursor].id);
  });

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="yellow"
      padding={1}
    >
      <Text bold color="yellow">
        Select a model:
      </Text>
      {models.map((model, i) => (
        <Box key={model.id}>
          <Text color={i === cursor ? "green" : undefined}>
            {i === cursor ? "❯ " : "  "}
            {model.label}
          </Text>
        </Box>
      ))}
      <Box marginTop={1}>
        <Text dimColor>↑/↓ navigate · Enter to confirm</Text>
      </Box>
    </Box>
  );
};

export const ModelSelect = ({ onSelect }: Props) => (
  <Suspense fallback={<Spinner label="Loading models…" />}>
    <ModelList onSelect={onSelect} />
  </Suspense>
);
