import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import { FilePicker } from "./FilePicker.js";
import { useFilePicker } from "../hooks/useFilePicker.js";

interface Props {
  onSubmit: (value: string, attachments: Record<string, string>) => void;
}

export const TextInput = ({ onSubmit }: Props) => {
  const [value, setValue] = useState("");
  const { filePicker, attachments, isReading } = useFilePicker(value, setValue);

  useInput((input, key) => {
    if (filePicker.active || isReading) return;

    if (key.return) {
      onSubmit(value, attachments);
      setValue("");
      return;
    }

    if (key.backspace || key.delete) {
      setValue((v) => v.slice(0, -1));
      return;
    }
    if (input && !key.ctrl && !key.meta) {
      setValue((v) => v + input);
    }
  });

  return (
    <Box flexDirection="column">
      <Box>
        <Text color="green">❯ </Text>
        <Text>{value}</Text>
        {isReading && <Text color="yellow"> reading…</Text>}
        {!isReading && Object.keys(attachments).length > 0 && (
          <Text color="yellow"> [{Object.keys(attachments).join(", ")}]</Text>
        )}
        <Text color="green">█</Text>
      </Box>

      {filePicker.active && (
        <FilePicker query={filePicker.query} cursor={filePicker.cursor} />
      )}
    </Box>
  );
};
