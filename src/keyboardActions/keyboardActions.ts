import { config } from "@/app";
import { ActionFunctions } from "./actionFunctions";
import type { IActionFunctionParams } from "./actionFunctions/actionFunction";
import { bindKey, updateHandle } from "@/bindKeys";
import type { UnlistenFn } from "@tauri-apps/api/event";

export interface IKeyboardAction {
  name: string;
  action: IActionFunction;
  keyActive: string;
}

export interface IKeyboardActionFile {
  name: string;
  action: TActionFunctionFile;
  keyActive: string;
}

export interface IActionFunction {
  id: number | null;
  title: string;
  action: Function;
  params: TActionFunctionParameter[];
}

export type TActionFunctionFile = Pick<IActionFunction, "id" | "params">;

export type TKeys = keyof IActionFunctionParams;

export type TActionFunctionParameter = IActionFunctionParameter<TKeys>;

export interface IActionFunctionParameter<TKey extends TKeys | symbol> {
  name: string;
  key: TKey; // variable name
  type: "number" | "text" | "keysArray" | "keyDown";
  value: number | string | string[];
}

export interface ISelectActionFunction {
  id: number;
  title: string;
}

export const SelectActionFunctions: IActionFunction[] = [
  {
    id: 0,
    title: "Active Key",
    action: ActionFunctions.activeKeys.fn,
    params: ActionFunctions.activeKeys.getParams(),
  },
  {
    id: 1,
    title: "Mouse Click",
    action: ActionFunctions.mouseClick.fn,
    params: ActionFunctions.mouseClick.getParams(),
  },
  {
    id: 2,
    title: "Mouse Move",
    action: ActionFunctions.mouseMove.fn,
    params: ActionFunctions.mouseMove.getParams(),
  },
  {
    id: 3,
    title: "Enter Text",
    action: ActionFunctions.enterText.fn,
    params: ActionFunctions.enterText.getParams(),
  },
] as const;

export function getActionFunctionById(id: number | null): IActionFunction {
  return SelectActionFunctions.find((af) => af.id === id) ?? getDefaultActionFunction();
}

export function getDefaultActionFunction(): IActionFunction {
  return {
    id: null,
    title: "",
    action: async () => {},
    params: [],
  };
}

export function getDefaultKeyboardAction(): IKeyboardAction {
  return {
    name: "",
    keyActive: "",
    action: getDefaultActionFunction(),
  };
}

export function cloneKeyboardActions(clone: IKeyboardAction[]): IKeyboardAction[] {
  return clone.map((ka) => cloneKeyboardAction(ka));
}

export function cloneKeyboardAction(clone: IKeyboardAction): IKeyboardAction {
  return {
    ...clone,
    action: cloneActionFunction(clone.action),
  };
}

function cloneActionFunctionParameters(
  clone: TActionFunctionParameter[]
): TActionFunctionParameter[] {
  return JSON.parse(JSON.stringify(clone));
}

export function cloneActionFunction(clone: IActionFunction): IActionFunction {
  return {
    ...clone,
    params: cloneActionFunctionParameters(clone.params),
  };
}

const unlistens: UnlistenFn[] = [];

export async function saveKeybdActions() {
  config.autoSaveSubVariantConfig();
  for (const keybdAction of config.mainConfig.main.value.keybdActions) {
    const params: IActionFunctionParams = {};
    keybdAction.action.params.forEach((param) => {
      params[param.key] = param.value;
    });
    const action = keybdAction.action.action;
    unlistens.push(
      await bindKey(keybdAction.keyActive, () => {
        console.log(keybdAction.keyActive);
        action(params);
      })
    );
  }
  updateHandle();
}
