import InsertCommentOutlinedIcon from "@mui/icons-material/InsertCommentOutlined";
import type { CommandPaletteToolLauncher } from "@app/command-palette";

export const protocolToolLauncher = {
  id: "protocol",
  label: "Протокол",
  description: "",
  icon: InsertCommentOutlinedIcon,
  keywords: ["протокол", "комментарий", "запись"],
} satisfies CommandPaletteToolLauncher<"protocol">;
