import { readTextFile, writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { message } from "@tauri-apps/api/dialog";
import { ref } from "vue";
import type {
  IConfig,
  IConfigFile,
  IMainVariantConfig,
  IMainVariantConfigFile,
  ISubVariantConfig,
  ISubVariantConfigFile,
} from "@/types/app";
import type { ITransportConfig } from "@/types/tray";
import type { WebviewWindow } from "@tauri-apps/api/window";
import { cloneKeyboardActions, getActionFunctionById } from "@/keyboardActions/keyboardActions";

function getDefaultSubVariants(): ISubVariantConfig[] {
  const variants: ISubVariantConfig[] = [];
  for (let index = 0; index <= 9; index++) {
    variants.push(getDefaultSubVariant(index));
  }
  return variants;
}

export function getDefaultSubVariant(id: number = 0): ISubVariantConfig {
  return {
    title: `variant${id}`,
    id,
    keybdActions: [],
  };
}

function getDefaultConfig(id: number = 0, title: string = "Main"): IMainVariantConfig {
  return {
    activeSubVariant: 0,
    title,
    id,
    main: getDefaultSubVariant(),
    subVariants: getDefaultSubVariants(),
  };
}

export function cloneSubVariant(clone: ISubVariantConfig): ISubVariantConfig {
  return {
    ...clone,
    keybdActions: cloneKeyboardActions(clone.keybdActions),
  };
}

export const config: IConfig = {
  activeScript: ref(false),
  showTray: ref(true),
  mainConfig: {
    activeMainVariant: ref(0),
    activeSubVariant: ref(0),
    main: ref(getDefaultSubVariant()),
  },
  variantsConfig: [getDefaultConfig()],

  async parseConfig() {
    try {
      const file = await readTextFile("config.json", { dir: BaseDirectory.Resource });
      if (file) {
        function transformSubVariantConfig(sv: ISubVariantConfigFile): ISubVariantConfig {
          return {
            ...sv,
            keybdActions: sv.keybdActions.map((ka) => {
              return {
                ...ka,
                action: {
                  ...getActionFunctionById(ka.action.id),
                  params: structuredClone(ka.action.params),
                },
              };
            }),
          };
        }

        function transformMainVariantConfig(
          mainVariants: IMainVariantConfigFile[]
        ): IMainVariantConfig[] {
          return mainVariants.map((v) => {
            return {
              ...v,
              main: transformSubVariantConfig(v.main),
              subVariants: v.subVariants.map((sv) => transformSubVariantConfig(sv)),
            };
          });
        }

        const configFile = JSON.parse(file) as IConfigFile;
        const activeMainVariant =
          configFile.mainVariants.find((item) => item.id === configFile.activeMainVariant) ??
          getDefaultConfig();
        this.mainConfig.activeMainVariant.value = configFile.activeMainVariant;
        this.mainConfig.activeSubVariant.value = activeMainVariant.activeSubVariant;
        this.mainConfig.main.value = transformSubVariantConfig(activeMainVariant.main);
        this.variantsConfig = transformMainVariantConfig(configFile.mainVariants);
      }
    } catch (error) {
      console.error(error);
      message("Configuration is not open!", { title: "Tauri", type: "error" });
    }
  },

  async saveConfig() {
    try {
      function transformConfig(config: IConfig): IConfigFile {
        function transformSubVariantConfig(sv: ISubVariantConfig): ISubVariantConfigFile {
          return {
            ...sv,
            keybdActions: sv.keybdActions.map((ka) => {
              return {
                ...ka,
                action: {
                  id: ka.action.id,
                  params: ka.action.params,
                },
              };
            }),
          };
        }

        function transformMainVariantConfig(
          mainVariants: IMainVariantConfig[]
        ): IMainVariantConfigFile[] {
          return mainVariants.map((v) => {
            return {
              ...v,
              main: transformSubVariantConfig(v.main),
              subVariants: v.subVariants.map((sv) => transformSubVariantConfig(sv)),
            };
          });
        }

        return {
          activeMainVariant: config.mainConfig.activeMainVariant.value,
          mainVariants: transformMainVariantConfig(config.variantsConfig),
        };
      }

      const configFile: IConfigFile = transformConfig(this);

      await writeTextFile("config.json", JSON.stringify(configFile), {
        dir: BaseDirectory.Resource,
      });
    } catch (error) {
      console.error(error);
      message("Configuration is not saved!", { title: "Tauri", type: "error" });
    }
  },

  autoSaveClick() {
    const mainVariant = this.variantsConfig.find(
      (item) => item.id === this.mainConfig.activeMainVariant.value
    );
    if (mainVariant) {
    } else message("Auto Save Click is not saved!", { title: "Tauri", type: "error" });
  },

  autoSaveSubVariantConfig() {
    const mainVariant = this.variantsConfig.find(
      (item) => item.id === this.mainConfig.activeMainVariant.value
    );
    if (mainVariant) {
      const subVariant = mainVariant.subVariants.find(
        (item) => item.id === this.mainConfig.activeSubVariant.value
      );
      if (subVariant) {
        subVariant.keybdActions = cloneKeyboardActions(this.mainConfig.main.value.keybdActions);
      } else
        message("Auto Save Sub VariantConfig is not saved!", { title: "Tauri", type: "error" });
    } else message("Auto Save Sub VariantConfig is not saved!", { title: "Tauri", type: "error" });
  },

  addMainVariantConfig(title) {
    this.variantsConfig.push(getDefaultConfig(this.variantsConfig.length, title));
  },

  activeMainVariantConfig(mainVariantId) {
    const mainVariant = this.variantsConfig.find((item) => item.id === mainVariantId);
    if (mainVariant) {
      this.mainConfig.activeMainVariant.value = mainVariant.id;
      this.mainConfig.activeSubVariant.value = mainVariant.activeSubVariant;
      this.mainConfig.main.value = cloneSubVariant(mainVariant.main);
    } else message("Configuration is not change!", { title: "Tauri", type: "error" });
  },

  safeSubVariantConfig(subVariantId) {
    // this.mainConfig.activeSubVariant.value = variant;
    const mainVariant = this.variantsConfig.find(
      (item) => item.id === this.mainConfig.activeMainVariant.value
    );
    if (mainVariant) {
      const subVariant = mainVariant.subVariants.find((item) => item.id === subVariantId);
      if (subVariant) {
        subVariant.keybdActions = cloneKeyboardActions(this.mainConfig.main.value.keybdActions);
      } else message("Configuration is not saved!", { title: "Tauri", type: "error" });
    } else message("Configuration is not saved!", { title: "Tauri", type: "error" });
    // console.log(`safeVariantConfig variant${variant}`);
  },

  activeSubVariantConfig(subVariantId) {
    const mainVariant = this.variantsConfig.find(
      (item) => item.id === this.mainConfig.activeMainVariant.value
    );

    if (mainVariant) {
      const subVariant = mainVariant.subVariants.find((item) => item.id === subVariantId);
      if (subVariant) {
        mainVariant.activeSubVariant = subVariant.id;
        mainVariant.main = cloneSubVariant(subVariant);
        this.mainConfig.activeSubVariant.value = subVariant.id;
        this.mainConfig.main.value = cloneSubVariant(subVariant);
      } else
        message(`Configuration sub variant ${subVariantId} is not active!`, {
          title: "Tauri",
          type: "error",
        });
      // console.log(`activeVariantConfig variant${variant}`);
    } else {
      message(`Configuration sub variant ${subVariantId} is not active!`, {
        title: "Tauri",
        type: "error",
      });
    }
  },
};

export function changeConfig(trayWebview: WebviewWindow) {
  const trayConfig: ITransportConfig = {
    activeScript: config.activeScript.value,
    showTray: config.showTray.value,
    config: {
      activeVariant: config.mainConfig.activeSubVariant.value,
      main: {
        title: config.mainConfig.main.value.title,
        id: config.mainConfig.main.value.id,
      },
    },
  };
  trayWebview.emit("changeConfig", trayConfig);
}
