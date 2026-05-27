export interface PickerState {
  active: boolean;
  query: string;
  cursor: number;
}

export type PickerAction =
  | { type: "open" }
  | { type: "close" }
  | { type: "up" }
  | { type: "down" }
  | { type: "type"; char: string }
  | { type: "backspace" };

export const CLOSED: PickerState = { active: false, query: "", cursor: 0 };

export const pickerReducer = (
  state: PickerState,
  action: PickerAction,
): PickerState => {
  switch (action.type) {
    case "open":
      return { active: true, query: "", cursor: 0 };
    case "close":
      return CLOSED;
    case "up":
      return { ...state, cursor: Math.max(0, state.cursor - 1) };
    case "down":
      return { ...state, cursor: Math.min(7, state.cursor + 1) };
    case "type":
      return { ...state, query: state.query + action.char, cursor: 0 };
    case "backspace":
      return state.query.length > 0
        ? { ...state, query: state.query.slice(0, -1) }
        : CLOSED;
  }
};
