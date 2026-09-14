import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { type CommandDefinition } from "@app/command-palette";

type BuildDefaultWorkspaceCommandsParams = {
  mode: "light" | "dark";
  toggleMode: () => void;
};

export const buildDefaultWorkspaceCommands = ({
  mode,
  toggleMode,
}: BuildDefaultWorkspaceCommandsParams): CommandDefinition[] => {
  const isDark = mode === "dark";

  const commands: CommandDefinition[] = [
    {
      id: "toggle-theme",
      title: isDark
        ? "Переключить на светлую тему"
        : "Переключить на тёмную тему",
      description: "Локально сменить визуальный режим рабочего пространства.",
      kind: "command",
      scope: "global",
      group: "core",
      icon: isDark ? DarkModeOutlinedIcon : LightModeOutlinedIcon,
      run: () => toggleMode(),
    },
  ];

  return commands;
};
