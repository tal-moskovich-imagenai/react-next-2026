import React, { use, Suspense } from "react";
import { Box, Text } from "ink";
import { listFiles } from "../utils/fileList.js";
import { Spinner } from "./Spinner.js";

const FileList = ({ query, cursor }: { query: string; cursor: number }) => {
  const files = use(listFiles(query));
  if (files.length === 0) return <Text dimColor> no matches</Text>;
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="yellow"
      paddingX={1}
    >
      {files.map((file, i) => (
        <Text key={file} color={i === cursor ? "green" : undefined}>
          {i === cursor ? "❯ " : "  "}
          <Text color={file.endsWith("/") ? "cyan" : undefined}>{file}</Text>
        </Text>
      ))}
    </Box>
  );
};

interface Props {
  query: string;
  cursor: number;
}

export const FilePicker = ({ query, cursor }: Props) => (
  <Box marginLeft={2}>
    <Suspense fallback={<Text dimColor> scanning…</Text>}>
      <FileList query={query} cursor={cursor} />
    </Suspense>
  </Box>
);
