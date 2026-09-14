import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import type { CommandPaletteToolLauncher } from "@app/command-palette";

export const relatedRequestsToolLauncher = {
  id: "related",
  label: "Привлечение смежных групп",
  description: "Создание и просмотр связанных обращений по текущему кейсу.",
  icon: GroupAddOutlinedIcon,
  keywords: [
    "смежные группы",
    "связанная заявка",
    "привлечение",
    "перевод",
    "смена исполнителя",
  ],
} satisfies CommandPaletteToolLauncher<"related">;
