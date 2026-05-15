import { useState, useCallback } from "react";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const useStream = (model = "gpt-4o-mini") => {
  const [content, setContent] = useState("");
  const [error, setError] = useState<Error | null>(null);

  const send = useCallback(
    async (messages: Message[]): Promise<string> => {
      setContent("");
      setError(null);

      let accumulated = "";

      const { textStream } = streamText({
        model: openai(model),
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        onError: ({ error }) => setError(error as Error),
      });

      for await (const chunk of textStream) {
        accumulated += chunk;
        setContent(accumulated);
      }

      return accumulated;
    },
    [model],
  );

  return { content, error, send };
};
