import { readdir, stat } from "fs/promises";

const cache = new Map<string, Promise<string[]>>();

export const resolvedFiles: Record<string, string[]> = {};

export function listFiles(query: string): Promise<string[]> {
  if (!cache.has(query)) {
    const promise = fetchFiles(query);
    promise.then((files) => {
      resolvedFiles[query] = files;
    });
    cache.set(query, promise);
  }
  return cache.get(query)!;
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
