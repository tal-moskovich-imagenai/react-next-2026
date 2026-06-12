import React, { useState, use, Suspense } from "react";
import { Box, Text, useInput } from "ink";
import { fetchModels } from "../api/fetchModels.js";

import { Spinner } from "./Spinner.js";

interface Props {
  onSelect: (modelId: string) => void;
}

const ModelList = ({ onSelect }: Props) => {
  const models = use(fetchModels);
  return <Spinner />;
};

export const ModelSelect = ({ onSelect }: Props) => (
  <Suspense fallback={<Spinner label="Loading models…" />}>
    <ModelList onSelect={onSelect} />
  </Suspense>
);
