import { invoke } from "@tauri-apps/api";
import { ActionFunction } from "./actionFunction";

export interface IActiveKeyParams {
  repetitions: number;
  keysArray: string[];
}

export const activeKeys = new ActionFunction<IActiveKeyParams>(
  async (params: IActiveKeyParams, actionFunction) => {
    for (let count = 1; count <= params.repetitions; count++) {
      if (!actionFunction.action) return;
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
