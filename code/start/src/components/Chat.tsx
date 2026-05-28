import React from "react";
import { Spinner } from "./Spinner.js";

interface Props {
  model: string;
}

export const Chat = ({ model }: Props) => {
  return <Spinner />;
};
