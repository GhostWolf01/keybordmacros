import type { Ref } from "vue";
import { IKeyboardAction } from "../keyboardActions/keyboardActions";
import type { IKeyboardActionFile } from "../keyboardActions/keyboardActions";

export interface IMainVariantConfig {
  activeSubVariant: number;
  title: string;
  id: number;
  main: ISubVariantConfig;
  subVariants: ISubVariantConfig[];
}

export interface IMainConfig {
  activeMainVariant: Ref<number>;
  activeSubVariant: Ref<number>;
  main: Ref<ISubVariantConfig>;
}

export interface IConfig {
  activeScript: Ref<boolean>;
  showTray: Ref<boolean>;
  mainConfig: IMainConfig;
  variantsConfig: IMainVariantConfig[];
  parseConfig: () => Promise<void>;
  saveConfig: () => Promise<void>;
  addMainVariantConfig: (title: string) => void;
  activeMainVariantConfig: (mainVariantId: number) => void;
  safeSubVariantConfig: (subVariantId: number) => void;
  activeSubVariantConfig: (subVariantId: number) => void;
  autoSaveClick: () => void;
  autoSaveSubVariantConfig: () => void;
}

export interface ISubVariantConfig {
  title: string; // variant[0 - 9]
  id: number; // variant[0 - 9]
  keybdActions: IKeyboardAction[];
}

export interface ISubVariantConfigFile {
  title: string; // variant[0 - 9]
  id: number; // variant[0 - 9]
  keybdActions: IKeyboardActionFile[];
}

export interface IMainVariantConfigFile {
  activeSubVariant: number;
  title: string;
  id: number;
  main: ISubVariantConfigFile;
  subVariants: ISubVariantConfigFile[];
}

export interface IConfigFile {
  activeMainVariant: number;
  mainVariants: IMainVariantConfigFile[];
}

export type InputTypeKeybdActions = "name" | "keyActive";

export type InputTypeApp = "activeScript" | "showTray";

export interface IPayload {
  pressed: number;
}
