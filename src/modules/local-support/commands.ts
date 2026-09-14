import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import type { CommandPaletteToolLauncher } from "@app/command-palette";

export const localSupportToolLauncher = {
  id: "local-support",
  label: "Локальная поддержка",
  description:
    "Привлечь к решению обращений локальную поддержку (через ЗНР/ЗПИ).",
  icon: EngineeringOutlinedIcon,
  keywords: ["локальная поддержка", "знр", "зпи"],
} satisfies CommandPaletteToolLauncher<"local-support">;
