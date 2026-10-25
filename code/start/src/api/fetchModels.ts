interface Model {
  id: string;
  label: string;
}

export async function fetchModelsFn(): Promise<Model[]> {
  const res = await fetch("https://api.openai.com/v1/models", {
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
  });
  const data = await res.json();

  return (data.data as { id: string; shutdown_date: string | null }[])
    .filter((m) => /^(gpt-5|o[3-9])/.test(m.id))
    .filter((m) => !m.shutdown_date)
    .filter((m) => !/-pro|codex|realtime|audio|transcribe|tts|image|search|live/.test(m.id))
    .map((m) => ({ id: m.id, label: m.id }))
    .slice(0, 6);
}

export const fetchModels = fetchModelsFn();
