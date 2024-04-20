import { invoke } from "@tauri-apps/api";
import { ActionFunction } from "./actionFunction";

export interface IActiveKeyParams {
  repetitions: number;
  keysArray: string[];
}

export const activeKeys = new ActionFunction<IActiveKeyParams>(
  async (params: IActiveKeyParams) => {
    for (let count = 1; count <= params.repetitions; count++) {
      await invoke("active_keys", {
        keysArray: params.keysArray,
      });
    }
  },
  [
    {
      name: "Repetitions",
      key: "repetitions",
      type: "number",
      value: 1,
    },
    {
      name: "Keys Array",
      key: "keysArray",
      type: "keysArray",
      value: [""],
    },
  ]
);
