import { readdir, stat } from "fs/promises";

export const fileListCache = new Map<string, Promise<string[]>>();

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

export const listFiles = (query: string): Promise<string[]> => {
  if (!fileListCache.has(query)) {
    const { dir, prefix, filter } = parseQuery(query);
    fileListCache.set(
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
  return fileListCache.get(query)!;
};
