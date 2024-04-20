import { appWindow } from "@tauri-apps/api/window";
import type { UnlistenFn, EventCallback, Event as TauriEvent } from "@tauri-apps/api/event";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
// import { sleep } from "./utils/sleep";

type BindKeysCallback = (event: KeyboardEvent | MouseEvent) => void;

type CheckKey = (event: KeyboardEvent | MouseEvent) => boolean;

const bindKeysCallbacks = new Map<string, BindKeysCallback>();
// KeybdKey
export const KeybdKey = {
  Backquote: "Backquote",
  NumpadAdd: "NumpadAdd",
  NumpadSubtract: "NumpadSubtract",
  NumpadMultiply: "NumpadMultiply",
  Separator: "Separator",
  NumpadDecimal: "NumpadDecimal",
  NumpadDivide: "NumpadDivide",
  Numpad0: "Numpad0",
  Numpad1: "Numpad1",
  Numpad2: "Numpad2",
  Numpad3: "Numpad3",
  Numpad4: "Numpad4",
  Numpad5: "Numpad5",
  Numpad6: "Numpad6",
  Numpad7: "Numpad7",
  Numpad8: "Numpad8",
  Numpad9: "Numpad9",
  Shift: "Shift",
  Control: "Control",
  Alt: "Alt",
  ShiftLeft: "ShiftLeft",
  ShiftRight: "ShiftRight",
  ControlLeft: "ControlLeft",
  ControlRight: "ControlRight",
  AltLeft: "AltLeft",
  AltRight: "AltRight",
  BrowserForward: "BrowserForward",
  BrowserBack: "BrowserBack",
} as const;

export const MouseKey = {
  LeftButton: "LeftButton",
  RightButton: "RightButton",
  MiddleButton: "MiddleButton",
  X1Button: "X1Button",
  X2Button: "X2Button",
} as const;

interface IMouseKeyCode {
  [key: number]: string;
}

export const MouseKeyCode: IMouseKeyCode = {
  0: MouseKey.LeftButton,
  1: MouseKey.MiddleButton,
  2: MouseKey.RightButton,
  3: MouseKey.X1Button,
  4: MouseKey.X2Button,
} as const;

export function getCodeKey(event: KeyboardEvent | MouseEvent) {
  let codeKey = "";
  if (event.type === "keydown") {
    const e = event as KeyboardEvent;
    if (
      e.ctrlKey &&
      e.code !== KeybdKey.Control &&
      e.code !== KeybdKey.ControlLeft &&
      e.code !== KeybdKey.ControlRight
    )
      codeKey += KeybdKey.Control + "_";
    if (
      e.altKey &&
      e.code !== KeybdKey.Alt &&
      e.code !== KeybdKey.AltLeft &&
      e.code !== KeybdKey.AltRight
    )
      codeKey += KeybdKey.Alt + "_";
    if (
      e.shiftKey &&
      e.code !== KeybdKey.Shift &&
      e.code !== KeybdKey.ShiftLeft &&
      e.code !== KeybdKey.ShiftRight
    )
      codeKey += KeybdKey.Shift + "_";
    codeKey += e.code;
  } else if (event.type === "mousedown") {
    const e = event as MouseEvent;
    if (e.ctrlKey) codeKey += KeybdKey.Control + "_";
    if (e.altKey) codeKey += KeybdKey.Alt + "_";
    if (e.shiftKey) codeKey += KeybdKey.Shift + "_";
    codeKey += MouseKeyCode[e.button] ?? "";
  }
  return codeKey;
}

function addBindKey(nameKey: string, callback: EventCallback<null>) {
  const parts = nameKey.split("_");

  const firstKey = parts[parts.length - 1];
  let secondKey = "";
  let thirdKey = "";
  if (parts.length === 2) secondKey = parts[0];
  else if (parts.length === 3) {
    secondKey = parts[0];
    thirdKey = parts[1];
  }

  function getCheckKey(key: string): CheckKey {
    return (event: KeyboardEvent | MouseEvent) => {
      if (event.type === "keydown") {
        const e = event as KeyboardEvent;
        return e.code === key;
      } else if (event.type === "mousedown") {
        const e = event as MouseEvent;
        return MouseKeyCode[e.button] === key;
      }
      return false;
    };
  }

  function getModifierKeys(key: string): CheckKey {
    switch (key) {
      case KeybdKey.Alt:
      case KeybdKey.AltLeft:
      case KeybdKey.AltRight: {
        return (event: KeyboardEvent | MouseEvent) => event.altKey;
      }
      case KeybdKey.Control:
      case KeybdKey.ControlLeft:
      case KeybdKey.ControlRight: {
        return (event: KeyboardEvent | MouseEvent) => event.ctrlKey;
      }
      case KeybdKey.Shift:
      case KeybdKey.ShiftLeft:
      case KeybdKey.ShiftRight: {
        return (event: KeyboardEvent | MouseEvent) => event.shiftKey;
      }
      default: {
        return () => true;
      }
    }
  }

  const isActiveFirstKey: CheckKey = getCheckKey(firstKey);
  const isActiveSecondKey: CheckKey = getModifierKeys(secondKey);
  const isActiveThirdKey: CheckKey = getModifierKeys(thirdKey);

  function isActiveKey(event: KeyboardEvent | MouseEvent): boolean {
    return isActiveFirstKey(event) && isActiveSecondKey(event) && isActiveThirdKey(event);
  }

  const eventTauri: TauriEvent<null> = {
    event: nameKey,
    windowLabel: appWindow.label,
    id: 0,
    payload: null,
  };

  const cl: BindKeysCallback = (event: KeyboardEvent | MouseEvent) => {
    if (isActiveKey(event)) {
      callback(eventTauri);
    }
  };
  bindKeysCallbacks.set(nameKey, cl);
}

export async function bindKey<T>(
  nameKey: string,
  callback: EventCallback<T | null>
): Promise<UnlistenFn> {
  addBindKey(nameKey, callback);
  invoke("bind_key", { nameKey });
  return await listen<T>(`press${nameKey}`, callback);
}

export async function bindHoldKey<T>(
  nameKey: string,
  callback: EventCallback<T | null>
): Promise<UnlistenFn> {
  addBindKey(nameKey, callback);
  invoke("bind_hold_key", { nameKey });
  return await listen<T>(`hold${nameKey}`, callback);
}

export async function activeBindKeys() {
  window.addEventListener("keydown", (event) => {
    bindKeysCallbacks.forEach((cl) => cl(event));
  });
  window.addEventListener("mousedown", (event) => {
    bindKeysCallbacks.forEach((cl) => cl(event));
  });
  activeHandle();
}

export async function updateHandle() {
  invoke("update_handle");
}

export async function activeHandle() {
  invoke("active_handle");
}

export async function updateBinds() {
  invoke("update_binds");
}
