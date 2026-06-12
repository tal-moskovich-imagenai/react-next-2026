import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import { Spinner } from "./Spinner.js";
import { useFilePicker } from "../hooks/useFilePicker.js";
import { FilePicker } from "./FilePicker.js";

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
    <Box>
      <Text color="green">❯ </Text>
      <Text>{value}</Text>
      <Text color="green">█</Text>
      {filePicker.active && (
        <FilePicker query={filePicker.query} cursor={filePicker.cursor} />
      )}
    </Box>
  );
};
