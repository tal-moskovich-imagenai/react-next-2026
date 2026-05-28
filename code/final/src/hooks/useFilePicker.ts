import { useState, useReducer, useTransition } from "react";
import { useInput } from "ink";
import { readFile } from "fs/promises";
import { resolvedFiles, replaceAtTag } from "../utils/fileList.js";
import { CLOSED, filePickerReducer } from "../state/filePickerReducer.js";

export type Attachments = Record<string, string>;

type SetValue = React.Dispatch<React.SetStateAction<string>>;

export const useFilePicker = (value: string, setValue: SetValue) => {
  const [attachments, setAttachments] = useState<Attachments>({});
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
        setValue((v) => replaceAtTag(v));
        dispatch({ type: "close" });
        return;
      }

      if (key.return) {
        const file = resolvedFiles[filePicker.query]?.[filePicker.cursor];
        if (!file) return;
        if (file.endsWith("/")) {
          setValue((v) => replaceAtTag(v, `@${file}`));
          dispatch({ type: "drill", path: file });
          return;
        }

        startReading(async () => {
          const content = await readFile(file, "utf-8");
          setAttachments((prev) => ({ ...prev, [file]: content }));
          setValue((v) => replaceAtTag(v, `@${file} `));
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

    if (input === "@") dispatch({ type: "open" });

    if (key.backspace || key.delete) {
      const next = value.slice(0, -1);
      setAttachments((prev) =>
        Object.fromEntries(
          Object.entries(prev).filter(([file]) => next.includes(`@${file}`)),
        ),
      );
    }
  });

  return { filePicker, attachments, isReading };
};
