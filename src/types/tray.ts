import type { Ref } from "vue";
import { ISubVariantConfig } from "./app";

export interface IConfig {
  activeScript: Ref<boolean>;
  showTray: Ref<boolean>;
  config: IVariantsConfig;
}

export interface ITransportConfig {
  activeScript: boolean;
  showTray: boolean;
  config: ITransportVariantsConfig;
}

export type ITransportSubVariantConfig = Omit<ISubVariantConfig, "keybdActions">;

export interface ITransportVariantsConfig {
  activeVariant: number;
  main: ITransportSubVariantConfig;
}

export interface IVariantsConfig {
  activeVariant: Ref<number>;
  main: Ref<ISubVariantConfig>;
}

type TimerType = number | undefined;

export interface ITimers {
  activeScript: TimerType;
  activeVariant: TimerType;
  actions: {
    activeScript: () => void;
    activeVariant: () => void;
  };
}
