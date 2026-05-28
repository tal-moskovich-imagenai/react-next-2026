import { readdir, stat } from "fs/promises";

// Replaces the trailing @tag in the input string.
// replaceAtTag(v)           → strips it entirely   (Escape)
// replaceAtTag(v, "@dir/")  → swaps to directory   (drill)
// replaceAtTag(v, "@file ") → swaps to filename    (confirm)
export const replaceAtTag = (v: string, replacement = "") => v.replace(/@\S*$/, replacement);

const promisesCache = new Map<string, Promise<string[]>>();

export const resolvedFiles: Record<string, string[]> = {};

export function listFiles(query: string): Promise<string[]> {
  if (!promisesCache.has(query)) {
    const promise = fetchFiles(query);
    promise.then((files) => {
      resolvedFiles[query] = files;
    });
    promisesCache.set(query, promise);
  }
  return promisesCache.get(query)!;
}

async function fetchFiles(query: string): Promise<string[]> {
  const lastSlash = query.lastIndexOf("/");
  const dir = lastSlash === -1 ? "." : query.slice(0, lastSlash) || ".";
  const prefix = lastSlash === -1 ? "" : query.slice(0, lastSlash + 1);
  const filter = lastSlash === -1 ? query : query.slice(lastSlash + 1);

  const names = await readdir(dir);
  const entries = await Promise.all(
    names.map(async (name) => ({
      name,
      isDir: (await stat(`${dir}/${name}`)).isDirectory(),
    })),
  );

  return entries
    .filter((e) => e.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => Number(b.isDir) - Number(a.isDir)) // dirs first
    .slice(0, 8)
    .map((e) => `${prefix}${e.name}${e.isDir ? "/" : ""}`);
}
