import { config } from "@/app";
import type { IActionFunctionParameter } from "@/keyboardActions/keyboardActions";

export interface IActionFunctionParams {
  [key: string]: number | string | string[];
}

export interface IActionFunctionFn<Params> {
  (params: Params): Promise<void>;
}

export class ActionFunction<Params extends object> {
  private action: boolean = false;
  fn: IActionFunctionFn<Params>;
  private readonly params: IActionFunctionParameter<keyof Params>[];
  getParams(): IActionFunctionParameter<keyof Params>[] {
    return this.params;
  }

  constructor(fn: IActionFunctionFn<Params>, params: IActionFunctionParameter<keyof Params>[]) {
    this.fn = async (params: Params) => {
      if (config.activeScript.value && !this.action) {
        this.action = true;
        await fn(params);
        this.action = false;
      }
    };
    this.params = params;
  }
}
