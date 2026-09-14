import type { SvgIconComponent } from "@mui/icons-material";
import type { Communication } from "@shared/routing";

export type CommandPaletteToolLauncher<
  TCommunication extends Communication,
> = {
  id: TCommunication;
  label: string;
  description: string;
  icon: SvgIconComponent;
  keywords?: readonly string[];
};
