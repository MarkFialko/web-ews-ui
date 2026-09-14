import type { CommandPaletteToolLauncher } from "@app/command-palette";
import type { SvgIconComponent } from "@mui/icons-material";
import { Box } from "@mui/material";

function SberChatToolIcon() {
  return (
    <Box
      component="img"
      src="/web-ews-ui/sberchat.webp"
      alt=""
      aria-hidden="true"
      sx={{
        width: 20,
        height: 20,
        objectFit: "contain",
      }}
    />
  );
}

export const chatToolLauncher = {
  id: "chat",
  label: "СберЧат",
  description: "",
  icon: SberChatToolIcon as unknown as SvgIconComponent,
  keywords: ["чат", "сообщение", "переписка"],
} satisfies CommandPaletteToolLauncher<"chat">;
