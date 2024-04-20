import { invoke } from "@tauri-apps/api";
import { ActionFunction } from "./actionFunction";

export interface IEnterTextParams {
  text: string;
}

export const enterText = new ActionFunction<IEnterTextParams>(
  async (params: IEnterTextParams) => {
    await invoke("enter_text", {
      text: params.text,
    });
  },
  [
    {
      name: "Text",
      key: "text",
      type: "text",
      value: "",
    },
  ]
);
