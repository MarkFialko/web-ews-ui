import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import type { CommandPaletteToolLauncher } from "@app/command-palette";

export const ticketActionsToolLauncher = {
  id: "actions",
  label: "Закрытие обращения",
  description: "",
  icon: FactCheckOutlinedIcon,
  keywords: ["Действия", "закрытие", "исполнитель", "статус"],
} satisfies CommandPaletteToolLauncher<"actions">;
