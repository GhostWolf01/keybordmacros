import { config } from "@/app";
import type { IActionFunctionParameter } from "@/keyboardActions/keyboardActions";

export interface IActionFunctionParams {
  [key: string]: number | string | string[];
}

export interface IActionFunctionFn<Params extends object> {
  (params: Params, actionFunction: ActionFunction<Params>): Promise<void>;
}

export class ActionFunction<Params extends object> {
  action: boolean = false;
  readonly fn: IActionFunctionFn<Params>;
  private readonly params: IActionFunctionParameter<keyof Params>[];
  getParams(): IActionFunctionParameter<keyof Params>[] {
    return this.params;
  }

  constructor(fn: IActionFunctionFn<Params>, params: IActionFunctionParameter<keyof Params>[]) {
    this.fn = async (params: Params) => {
      if (config.activeScript.value) {
        if (!this.action) {
          this.action = true;
          await fn(params, this);
          this.action = false;
        } else this.action = false;
      }
    };
    this.params = params;
  }
}
