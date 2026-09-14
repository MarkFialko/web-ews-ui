import type { SvgIconComponent } from "@mui/icons-material";

export type CommandScope = "global" | "ticket";

export type CommandKind = "command" | "search-result" | "tool";

export type CommandGroup = "core" | "search" | "tool";

export type CommandPalettePhase = "input" | "results";

export type CommandPaletteFocusTarget = "input" | "list";

export type CommandDefinition = {
  id: string;
  title: string;
  description: string;
  kind: CommandKind;
  scope: CommandScope;
  group: CommandGroup;
  keywords?: readonly string[];
  icon?: SvgIconComponent;
  badgeLabel?: string;
  disabled?: boolean;
  run: () => void;
};
