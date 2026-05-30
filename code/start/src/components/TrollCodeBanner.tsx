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

const TrollDoll: React.FC = () => (
  <Box flexDirection="column" marginLeft={3}>
    {/* Rainbow hair */}
    <Box>
      <Text color="yellow">{"▓  "}</Text>
      <Text color="magenta">{"▓  "}</Text>
      <Text color="blue">{"▓  "}</Text>
      <Text color="cyan">{"▓"}</Text>
    </Box>
    <Box>
      <Text color="yellow">{"▓▓"}</Text>
      <Text color="magenta">{"▓▓▓"}</Text>
      <Text color="blue">{"▓▓"}</Text>
      <Text color="cyan">{"▓▓▓"}</Text>
    </Box>
    {/* Face */}
    <Text color="green">{"╭────────╮"}</Text>
    <Box>
      <Text color="green">{"│ "}</Text>
      <Text color="white" bold>{"●"}</Text>
      <Text color="green">{"    "}</Text>
      <Text color="white" bold>{"●"}</Text>
      <Text color="green">{" │"}</Text>
    </Box>
    <Text color="green">{"│  ╰──╯  │"}</Text>
    <Text color="green">{"╰────────╯"}</Text>
    {/* Body */}
    <Text color="green">{"╭──────────╮"}</Text>
    <Text color="green">{"─┤          ├─"}</Text>
    <Text color="green">{"╰──╮    ╭──╯"}</Text>
    <Text color="green">{"   │    │"}</Text>
  </Box>
);

export const TrollCodeBanner: React.FC = () => (
  <Box flexDirection="column" paddingLeft={1}>
    <Box flexDirection="row" alignItems="flex-start">
      <Box flexDirection="column">
        {TROLL.map((line, i) => (
          <Text key={i} color="green">{line}</Text>
        ))}
        {CODE.map((line, i) => (
          <Text key={i} color="cyan">{line}</Text>
        ))}
      </Box>
      <TrollDoll />
    </Box>
    <Box marginTop={1}>
      <Text dimColor>React in your terminal · powered by Ink 🧌</Text>
    </Box>
  </Box>
);
