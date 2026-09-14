import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import type { CommandPaletteToolLauncher } from "@app/command-palette";

export const callToolLauncher = {
  id: "call",
  label: "Позвонить",
  description: "",
  icon: PhoneOutlinedIcon,
  keywords: ["звонок", "дозвон", "телефон"],
} satisfies CommandPaletteToolLauncher<"call">;
