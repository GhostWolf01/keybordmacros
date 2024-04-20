import { invoke } from "@tauri-apps/api";
import { ActionFunction } from "./actionFunction";

export interface IMouseMoveParams {
  sensitivity: number;
  times: number;
  rate: number;
}

export const mouseMove = new ActionFunction<IMouseMoveParams>(
  async (params: IMouseMoveParams) => {
    await invoke<boolean>("mouse_move", {
      sensitivity: params.sensitivity,
      times: params.times,
      rate: params.rate,
    });
  },
  [
    {
      name: "Sensitivity",
      key: "sensitivity",
      type: "number",
      value: 1,
    },
    {
      name: "Times",
      key: "times",
      type: "number",
      value: 10,
    },
    {
      name: "Rate",
      key: "rate",
      type: "number",
      value: 10,
    },
  ]
);
