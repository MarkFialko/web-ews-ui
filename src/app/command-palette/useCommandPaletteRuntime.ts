import { useCallback, useMemo, useState } from "react";
import type {
  CommandDefinition,
  CommandPaletteFocusTarget,
  CommandPalettePhase,
} from "./commandPalette.types";

export function useCommandPaletteRuntime() {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<CommandPalettePhase>("input");
  const [focusTarget, setFocusTarget] =
    useState<CommandPaletteFocusTarget>("input");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const reset = useCallback(() => {
    setPhase("input");
    setFocusTarget("input");
    setQuery("");
    setSubmittedQuery("");
    setSelectedIndex(0);
  }, []);

  const open = useCallback(() => {
    reset();
    setIsOpen(true);
  }, [reset]);

  const close = useCallback(() => {
    setIsOpen(false);
    reset();
  }, [reset]);

  const returnToInput = useCallback(() => {
    setPhase("input");
    setFocusTarget("input");
    setSubmittedQuery("");
    setSelectedIndex(0);
  }, []);

  const updateQuery = useCallback((nextQuery: string) => {
    setQuery(nextQuery);
    setPhase("input");
    setFocusTarget("input");
    setSubmittedQuery("");
    setSelectedIndex(0);
  }, []);

  const submitQuery = useCallback(
    (searchResults: readonly CommandDefinition[]) => {
      const nextSubmittedQuery = query.trim();
      if (!nextSubmittedQuery) return;

      setSubmittedQuery(nextSubmittedQuery);
      setSelectedIndex(0);

      if (searchResults.length === 1) {
        searchResults[0]?.run();
        return;
      }

      setPhase("results");
      setFocusTarget("list");
    },
    [query],
  );

  const searchQuery = phase === "results" ? submittedQuery : query;

  return useMemo(
    () => ({
      isOpen,
      phase,
      focusTarget,
      query,
      searchQuery,
      selectedIndex,
      open,
      close,
      returnToInput,
      updateQuery,
      submitQuery,
      setFocusTarget,
      setSelectedIndex,
    }),
    [
      close,
      focusTarget,
      isOpen,
      open,
      phase,
      query,
      returnToInput,
      searchQuery,
      selectedIndex,
      setFocusTarget,
      setSelectedIndex,
      submitQuery,
      updateQuery,
    ],
  );
}
