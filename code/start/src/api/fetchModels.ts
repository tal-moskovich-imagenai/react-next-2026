interface Model {
  id: string;
  label: string;
}

export async function fetchModelsFn(): Promise<Model[]> {
  const res = await fetch("https://api.openai.com/v1/models", {
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
  });
  const data = await res.json();

  return (data.data as { id: string }[])
    .filter((m) => m.id.startsWith("gpt") || m.id.startsWith("o"))
    .map((m) => ({ id: m.id, label: m.id }))
    .slice(0, 6);
}

export const fetchModels = fetchModelsFn();
