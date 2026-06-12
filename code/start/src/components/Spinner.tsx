import React, { useState, useEffect } from "react";
import { Text } from "ink";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export const Spinner = ({ label }: { label?: string }) => {
  const [frame, setFrame] = useState(0);

  setInterval(() => {
    setFrame((prev) => (prev + 1) % FRAMES.length);
  }, 80);

  return (
    <Text color="cyan">
      {FRAMES[frame]} {label ?? "Thinking..."}
    </Text>
  );
};
