import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CommandPaletteRuntime } from "./CommandPaletteRuntime";
import {
  CommandPaletteContext,
  EMPTY_COMMAND_PALETTE_ITEMS,
  type CommandPaletteSource,
} from "./CommandPaletteContext";

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState<CommandPaletteSource | null>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const paletteShortcut =
        (event.metaKey || event.ctrlKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === "p";

      if (!paletteShortcut) return;

      event.preventDefault();
      open();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const contextValue = useMemo(
    () => ({
      isOpen,
      open,
      close,
      setSource,
    }),
    [close, isOpen, open],
  );

  return (
    <CommandPaletteContext.Provider value={contextValue}>
      {children}
      <CommandPaletteRuntime
        open={isOpen}
        defaultItems={source?.defaultItems ?? EMPTY_COMMAND_PALETTE_ITEMS}
        onOpenChange={setIsOpen}
      />
    </CommandPaletteContext.Provider>
  );
}
