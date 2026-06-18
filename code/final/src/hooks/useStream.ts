import { useState } from "react";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { Message } from "../components/Chat.js";

export const useStream = (model = "gpt-4o-mini") => {
  const [content, setContent] = useState("");
  const [error, setError] = useState<Error | null>(null);

  const send = async (messages: Message[]): Promise<string> => {
    setContent("");
    setError(null);

    let accumulated = "";

    const { textStream } = streamText({
      model: openai(model),
      messages,
      onError: ({ error }) => setError(error as Error),
    });

    for await (const chunk of textStream) {
      accumulated += chunk;
      setContent(accumulated);
    }

    return accumulated;
  };

  return { content, error, send };
};
