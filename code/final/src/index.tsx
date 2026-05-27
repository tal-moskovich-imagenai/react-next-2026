import React from "react";
import { render } from "ink";
import { App } from "./App.js";

//
// process.stdout.write("\x1b[?1049h\x1b[2J\x1b[H"); // enter alternate screen + clear
// process.on("exit", () => process.stdout.write("\x1b[?1049l")); // restore on exit

process.stdout.write("\x1b[2J\x1b[H"); // just clear, keep scroll buffer

render(<App />);
