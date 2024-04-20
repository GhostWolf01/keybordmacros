import { activeKeys } from "./activeKey";
import { mouseClick } from "./mouseClick";
import { mouseMove } from "./mouseMove";
import { enterText } from "./enterText";

export const ActionFunctions = {
  activeKeys,
  mouseClick,
  mouseMove,
  enterText,
} as const;
