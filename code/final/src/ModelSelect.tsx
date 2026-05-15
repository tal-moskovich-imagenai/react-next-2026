import React, {
  useState,
  use,
  Suspense,
  Component,
  type ReactNode,
} from "react";
import { Box, Text, useInput } from "ink";
import { modelsPromise } from "./fetchModels.js";
import { Spinner } from "./Spinner.js";

interface Props {
  onSelect: (modelId: string) => void;
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <Box borderStyle="round" borderColor="red" padding={1}>
          <Text color="red">
            ✗ Failed to load models: {this.state.error.message}
          </Text>
        </Box>
      );
    }
    return this.props.children;
  }
}

const ModelList = ({ onSelect }: Props) => {
  const models = use(modelsPromise);
  const [cursor, setCursor] = useState(0);

  useInput((input, key) => {
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
      <Text dimColor marginTop={1}>
        ↑/↓ navigate, Enter to confirm
      </Text>
    </Box>
  );
};

export const ModelSelect = ({ onSelect }: Props) => (
  <ErrorBoundary>
    <Suspense fallback={<Spinner label="Loading models…" />}>
      <ModelList onSelect={onSelect} />
    </Suspense>
  </ErrorBoundary>
);
