import React from "react";
import { Box, Text } from "ink";

const TROLL = [
  "████████╗██████╗  ██████╗ ██╗     ██╗     ",
  "╚══██╔══╝██╔══██╗██╔═══██╗██║     ██║     ",
  "   ██║   ██████╔╝██║   ██║██║     ██║     ",
  "   ██║   ██╔══██╗██║   ██║██║     ██║     ",
  "   ██║   ██║  ██║╚██████╔╝███████╗███████╗",
  "   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝",
];

const CODE = [
  " ██████╗ ██████╗ ██████╗ ███████╗",
  "██╔════╝██╔═══██╗██╔══██╗██╔════╝",
  "██║     ██║   ██║██║  ██║█████╗  ",
  "██║     ██║   ██║██║  ██║██╔══╝  ",
  "╚██████╗╚██████╔╝██████╔╝███████╗",
  " ╚═════╝ ╚═════╝ ╚═════╝╚══════╝",
];

export const TrollCodeBanner = () => (
  <Box flexDirection="column" marginBottom={1} paddingLeft={1}>
    {TROLL.map((line, i) => (
      <Text key={i} color="green">{line}</Text>
    ))}
    {CODE.map((line, i) => (
      <Text key={i} color="cyan">{line}</Text>
    ))}
    <Box marginTop={1}>
      <Text dimColor>React in your terminal · powered by Ink 🧌</Text>
    </Box>
  </Box>
);
