import { useContext, useEffect } from "react";
import {
  CommandPaletteContext,
  type CommandPaletteSource,
} from "./CommandPaletteContext";

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error(
      "useCommandPalette must be used within CommandPaletteProvider",
    );
  }

  return {
    isOpen: context.isOpen,
    open: context.open,
    close: context.close,
  };
}

export function useCommandPaletteSource(source: CommandPaletteSource) {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error(
      "useCommandPaletteSource must be used within CommandPaletteProvider",
    );
  }
  const { setSource } = context;

  useEffect(() => {
    setSource(source);
    return () => setSource(null);
  }, [setSource, source]);
}
