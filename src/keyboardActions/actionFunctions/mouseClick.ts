import { invoke } from "@tauri-apps/api";
import { ActionFunction } from "./actionFunction";

export interface IMouseClickParams {
  times: number;
  rate: number;
}

export const mouseClick = new ActionFunction<IMouseClickParams>(
  async (params: IMouseClickParams) => {
    await invoke<boolean>("mouse_click", {
      times: params.times,
      rate: params.rate,
    });
  },
  [
    {
      name: "Times",
      key: "times",
      type: "number",
      value: 1,
    },
    {
      name: "Rate",
      key: "rate",
      type: "number",
      value: 110,
    },
  ]
);
