import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import { Spinner } from "./Spinner.js";

interface Props {
  onSubmit: (value: string, attachments: Record<string, string>) => void;
}

export const TextInput = ({ onSubmit }: Props) => {
  const [value, setValue] = useState("");

  return <Spinner />;
};
