import { createContext } from "react";
import type { CommandDefinition } from "./commandPalette.types";

export type CommandPaletteSource = {
  defaultItems: readonly CommandDefinition[];
};

export type CommandPaletteContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  setSource: (source: CommandPaletteSource | null) => void;
};

export const CommandPaletteContext =
  createContext<CommandPaletteContextValue | null>(null);

export const EMPTY_COMMAND_PALETTE_ITEMS: readonly CommandDefinition[] = [];

export const buildEmptyCommandPaletteSearchItems = () =>
  EMPTY_COMMAND_PALETTE_ITEMS;
