import React, { use, Suspense } from "react";
import { Box, Text } from "ink";
import { listFiles } from "../utils/fileList.js";
import { Spinner } from "./Spinner.js";

const FileList = ({ query, cursor }: { query: string; cursor: number }) => {
  const files = use(listFiles(query));
  return <Spinner label={` scanning…`} />;
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
