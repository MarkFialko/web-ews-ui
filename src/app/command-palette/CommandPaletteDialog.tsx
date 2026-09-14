import { useEffect, useRef, startTransition, type KeyboardEvent } from "react";
import {
  alpha,
  Box,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type {
  CommandDefinition,
  CommandPaletteFocusTarget,
  CommandPalettePhase,
} from "./commandPalette.types";

type CommandPaletteDialogProps = {
  open: boolean;
  phase: CommandPalettePhase;
  focusTarget: CommandPaletteFocusTarget;
  query: string;
  items: CommandDefinition[];
  selectedIndex: number;
  onClose: () => void;
  onQueryChange: (query: string) => void;
  onSubmitQuery: () => void;
  onBackToInput: () => void;
  onFocusTargetChange: (focusTarget: CommandPaletteFocusTarget) => void;
  onSelectedIndexChange: (index: number) => void;
};

export function CommandPaletteDialog({
  open,
  phase,
  focusTarget,
  query,
  items,
  selectedIndex,
  onClose,
  onQueryChange,
  onSubmitQuery,
  onBackToInput,
  onFocusTargetChange,
  onSelectedIndexChange,
}: CommandPaletteDialogProps) {
  const actionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const inputRef = useRef<HTMLInputElement | null>(null);
  const effectiveSelectedIndex =
    items.length === 0 ? 0 : Math.min(selectedIndex, items.length - 1);

  useEffect(() => {
    if (!open) return;

    if (focusTarget === "input" || items.length === 0) {
      const rafId = window.requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.setSelectionRange(query.length, query.length);
      });

      return () => window.cancelAnimationFrame(rafId);
    }

    const selectedAction = items[effectiveSelectedIndex];
    if (!selectedAction) return;

    actionRefs.current[selectedAction.id]?.focus();
    actionRefs.current[selectedAction.id]?.scrollIntoView({
      block: "nearest",
    });
  }, [effectiveSelectedIndex, focusTarget, items, open, query.length]);

  const handlePrintableKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      phase !== "input" ||
      event.key.length !== 1 ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return false;
    }

    event.preventDefault();
    onFocusTargetChange("input");
    startTransition(() => onQueryChange(`${query}${event.key}`));
    return true;
  };

  const runSelectedItem = () => {
    const selectedItem = items[effectiveSelectedIndex];
    if (!selectedItem || selectedItem.disabled) return;
    selectedItem.run();
  };

  const moveSelection = (offset: number) => {
    if (items.length === 0) return;
    onSelectedIndexChange(
      (effectiveSelectedIndex + offset + items.length) % items.length,
    );
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      event.preventDefault();
      onClose();
      return;
    }

    if (phase === "results") {
      if (event.key === "Backspace") {
        event.preventDefault();
        onBackToInput();
      }
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (query.trim().length > 0) {
        onSubmitQuery();
        return;
      }

      runSelectedItem();
      return;
    }

    if (event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey)) {
      event.preventDefault();
      onFocusTargetChange("list");
      moveSelection(1);
      return;
    }

    if (event.key === "ArrowUp" || (event.key === "Tab" && event.shiftKey)) {
      event.preventDefault();
      onFocusTargetChange("list");
      moveSelection(-1);
      return;
    }
  };

  const handleResultKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      onFocusTargetChange("input");

      if (phase === "input") {
        startTransition(() => onQueryChange(query.slice(0, -1)));
        return;
      }

      onBackToInput();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      runSelectedItem();
      return;
    }

    if (event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey)) {
      event.preventDefault();
      onFocusTargetChange("list");
      moveSelection(1);
      return;
    }

    if (event.key === "ArrowUp" || (event.key === "Tab" && event.shiftKey)) {
      event.preventDefault();
      onFocusTargetChange("list");
      moveSelection(-1);
      return;
    }

    if (handlePrintableKey(event)) {
      return;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: (theme) => ({
          borderRadius: `${theme.shape.borderRadius}px`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
          boxShadow:
            theme.palette.mode === "dark"
              ? `0 24px 70px ${alpha(theme.palette.common.black, 0.45)}`
              : `0 24px 70px ${alpha(theme.palette.common.black, 0.18)}`,
          overflow: "hidden",
        }),
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Stack spacing={0}>
          <Box sx={{ p: 1.25 }}>
            <TextField
              autoFocus
              inputRef={inputRef}
              fullWidth
              placeholder="Команда, заявка, клиент, УЗ или АРМ"
              value={query}
              inputProps={{ readOnly: phase === "results" }}
              helperText={
                phase === "input" && query.trim().length > 0
                  ? "Нажмите Enter, чтобы выполнить локальный поиск"
                  : " "
              }
              onChange={(event) => {
                const nextValue = event.target.value;
                onFocusTargetChange("input");
                startTransition(() => onQueryChange(nextValue));
              }}
              onFocus={() => onFocusTargetChange("input")}
              onKeyDown={handleInputKeyDown}
            />
          </Box>
          <Divider />
          <List sx={{ py: 0, maxHeight: 420, overflow: "auto" }}>
            {items.length > 0 ? (
              items.map((item, index) => {
                const ActionIcon = item.icon;
                const selected = index === effectiveSelectedIndex;

                return (
                  <ListItemButton
                    key={item.id}
                    ref={(node) => {
                      actionRefs.current[item.id] = node;
                    }}
                    disabled={item.disabled}
                    selected={selected}
                    tabIndex={selected ? 0 : -1}
                    onFocus={() => onFocusTargetChange("list")}
                    onKeyDown={handleResultKeyDown}
                    onClick={item.run}
                    onMouseEnter={() => {
                      onFocusTargetChange("list");
                      onSelectedIndexChange(index);
                    }}
                    sx={(theme) => ({
                      py: 1.1,
                      px: 1.5,
                      "&.Mui-selected": {
                        backgroundColor:
                          theme.palette.mode === "light"
                            ? alpha(theme.palette.primary.main, 0.06)
                            : alpha(theme.palette.primary.main, 0.16),
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor:
                          theme.palette.mode === "light"
                            ? alpha(theme.palette.primary.main, 0.1)
                            : alpha(theme.palette.primary.main, 0.22),
                      },
                    })}
                  >
                    {ActionIcon ? (
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <ActionIcon fontSize="small" />
                      </ListItemIcon>
                    ) : null}
                    <ListItemText
                      primary={item.title}
                      secondary={item.description}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                    {item.badgeLabel ? (
                      <Chip
                        size="small"
                        variant="outlined"
                        label={item.badgeLabel}
                      />
                    ) : null}
                  </ListItemButton>
                );
              })
            ) : (
              <Box sx={{ px: 1.5, py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Ничего не найдено по запросу. Нажмите Backspace, чтобы
                  вернуться к вводу, или Esc, чтобы закрыть палитру.
                </Typography>
              </Box>
            )}
          </List>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
