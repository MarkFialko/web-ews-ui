import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import type { CommandPaletteToolLauncher } from "@app/command-palette";

export const knowledgeBaseToolLauncher = {
  id: "knowledge",
  label: "База знаний",
  description: "",
  icon: MenuBookOutlinedIcon,
  keywords: ["база знаний", "статья", "sh"],
} satisfies CommandPaletteToolLauncher<"knowledge">;
