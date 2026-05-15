interface Model {
  id: string;
  label: string;
}

// Create the promise ONCE, outside the component.
// React's use() reads the same promise instance on every render —
// it only fetches once, not once per render.
export const modelsPromise: Promise<Model[]> = fetch(
  "https://api.openai.com/v1/models",
  { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } },
)
  .then((r) => r.json())
  .then((data) =>
    (data.data as { id: string }[])
      .filter((m) => m.id.startsWith("gpt") || m.id.startsWith("o"))
      .map((m) => ({ id: m.id, label: m.id }))
      .slice(0, 6),
  );
