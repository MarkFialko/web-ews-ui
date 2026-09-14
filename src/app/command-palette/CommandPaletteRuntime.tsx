import { useEffect } from "react";
import { CommandPaletteDialog } from "./CommandPaletteDialog";
import type { CommandDefinition } from "./commandPalette.types";
import { useCommandPaletteRuntime } from "./useCommandPaletteRuntime";

type CommandPaletteRuntimeProps = {
  open: boolean;
  defaultItems: readonly CommandDefinition[];
  onOpenChange: (open: boolean) => void;
};

export function CommandPaletteRuntime({
  open,
  defaultItems,
  onOpenChange,
}: CommandPaletteRuntimeProps) {
  const runtime = useCommandPaletteRuntime();
  const visibleItems = defaultItems;

  useEffect(() => {
    if (open && !runtime.isOpen) {
      runtime.open();
      return;
    }

    if (!open && runtime.isOpen) {
      runtime.close();
    }
  }, [open, runtime]);

  const close = () => {
    runtime.close();
    onOpenChange(false);
  };

  return (
    <CommandPaletteDialog
      open={runtime.isOpen}
      phase={runtime.phase}
      focusTarget={runtime.focusTarget}
      query={runtime.query}
      items={[...visibleItems]}
      selectedIndex={runtime.selectedIndex}
      onClose={close}
      onQueryChange={runtime.updateQuery}
      onSubmitQuery={() => runtime.submitQuery(searchItems)}
      onBackToInput={runtime.returnToInput}
      onFocusTargetChange={runtime.setFocusTarget}
      onSelectedIndexChange={runtime.setSelectedIndex}
    />
  );
}
