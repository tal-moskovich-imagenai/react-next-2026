import React, { useState, useReducer, useTransition } from "react";
import { Box, Text, useInput } from "ink";
import { readFile } from "fs/promises";
import { FilePicker } from "./FilePicker.js";
import { resolvedFiles } from "../utils/fileList.js";
import { CLOSED, filePickerReducer } from "../state/filePickerReducer.js";

interface Props {
  onSubmit: (value: string, attachments: Record<string, string>) => void;
}

export const TextInput = ({ onSubmit }: Props) => {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<Record<string, string>>({});
  const [filePicker, dispatch] = useReducer(filePickerReducer, CLOSED);
  const [isReading, startReading] = useTransition();

  useInput((input, key) => {
    if (isReading) return;
    if (filePicker.active) {
      if (key.upArrow) {
        dispatch({ type: "up" });
        return;
      }
      if (key.downArrow) {
        dispatch({ type: "down" });
        return;
      }

      if (key.escape) {
        setValue((v) => v.replace(/@\S*$/, ""));
        dispatch({ type: "close" });
        return;
      }

      if (key.return) {
        const file =
          resolvedFiles[filePicker.query]?.[filePicker.cursor];
        if (!file) return;

        if (file.endsWith("/")) {
          setValue((v) => v.replace(/@\S*$/, `@${file}`));
          dispatch({ type: "drill", path: file });
          return;
        }

        startReading(async () => {
          const content = await readFile(file, "utf-8");
          setAttachments((prev) => ({ ...prev, [file]: content }));
          setValue((v) => v.replace(/@\S*$/, `@${file} `));
          dispatch({ type: "close" });
        });
        return;
      }

      if (key.backspace || key.delete) {
        dispatch({ type: "backspace" });
        return;
      }
      if (input && !key.ctrl && !key.meta)
        dispatch({ type: "type", char: input });
      return;
    }

    if (key.return) {
      onSubmit(value, attachments);
      setValue("");
      setAttachments({});
      return;
    }

    if (key.backspace || key.delete) {
      const next = value.slice(0, -1);
      setValue(next);
      setAttachments((prev) =>
        Object.fromEntries(
          Object.entries(prev).filter(([file]) => next.includes(`@${file}`)),
        ),
      );
      return;
    }

    if (input === "@") {
      setValue((v) => v + "@");
      dispatch({ type: "open" });
      return;
    }
    if (input && !key.ctrl && !key.meta) setValue((v) => v + input);
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
        <FilePicker
          query={filePicker.query}
          cursor={filePicker.cursor}
        />
      )}
    </Box>
  );
};
