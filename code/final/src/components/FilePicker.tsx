import React, { use, Suspense } from "react";
import { Box, Text } from "ink";
import { readdir, stat } from "fs/promises";

const cache = new Map<string, Promise<string[]>>();

// "src/Com" → { dir: "src", prefix: "src/", filter: "Com" }
// "../ut"   → { dir: "..",  prefix: "../",  filter: "ut"  }
// "App"     → { dir: ".",   prefix: "",     filter: "App" }
const parseQuery = (query: string) => {
  const lastSlash = query.lastIndexOf("/");
  return lastSlash === -1
    ? { dir: ".", prefix: "", filter: query }
    : {
        dir: query.slice(0, lastSlash) || ".",
        prefix: query.slice(0, lastSlash + 1),
        filter: query.slice(lastSlash + 1),
      };
};

const listFiles = (query: string): Promise<string[]> => {
  if (!cache.has(query)) {
    const { dir, prefix, filter } = parseQuery(query);
    cache.set(
      query,
      readdir(dir)
        .then((entries) =>
          Promise.all(
            entries.map((e) =>
              stat(`${dir}/${e}`).then((s) => ({ name: e, isDir: s.isDirectory() }))
            )
          )
        )
        .then((entries) =>
          entries
            .filter((e) => e.name.toLowerCase().includes(filter.toLowerCase()))
            .sort((a, b) => Number(b.isDir) - Number(a.isDir)) // dirs first
            .slice(0, 8)
            .map((e) => `${prefix}${e.name}${e.isDir ? "/" : ""}`)
        ),
    );
  }
  return cache.get(query)!;
};

// Exported so TextInput can read the resolved value on Enter without re-fetching
export { cache as fileListCache };

const FileList = ({ query, cursor }: { query: string; cursor: number }) => {
  const files = use(listFiles(query));
  if (files.length === 0) return <Text dimColor>  no matches</Text>;
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="yellow" paddingX={1}>
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
    <Suspense fallback={<Text dimColor>  scanning…</Text>}>
      <FileList query={query} cursor={cursor} />
    </Suspense>
  </Box>
);
