import { useState, useMemo, useCallback, useRef, useLayoutEffect } from "react";

import {
  Popover,
  TextField,
  Box,
  Typography,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";

import {
  SearchRounded,
  ExpandMoreRounded,
  ExpandLessRounded,
  Check,
} from "@mui/icons-material";

import { useGetHashtagsQuery } from "@shared/queries/dictionaryApi";
import { normalizePrefix } from "../../utils";

import { useUser } from "@shared/user";

interface DictionaryTagsPopoverProps {
  tags: string[];
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onTagSelect: (tag: string) => void;
}

const SEARCH_INPUT_SX = {
  mb: 1,
  "& .MuiOutlinedInput-root": {
    fontSize: 14,
  },
};

const LIST_ITEM_GROUP_SX = {
  fontSize: 13,
  fontWeight: 600,
  px: 1.5,
  py: 0.75,
  cursor: "pointer",
  transition: "background-color 0.15s",
  "&:hover": {
    backgroundColor: "action.hover",
  },
};

export function DictionaryTagsPopover(props: DictionaryTagsPopoverProps) {
  const { anchorEl, onClose, onTagSelect, tags } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { user, isLoading: isDirectionLoading } = useUser();

  const { data: hashtags = [] } = useGetHashtagsQuery(
    {
      unit: user?.unit ?? "",
      direction: user?.direction ?? "Общее",
    },
    {
      skip: !user?.unit || isDirectionLoading,
    },
  );

  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(
    () => new Set(),
  );

  useLayoutEffect(() => {
    if (!anchorEl) return;
    const frameId = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frameId);
  }, [anchorEl]);

  const handleClose = useCallback(() => {
    setSearch("");
    setExpandedGroups(new Set());
    onClose();
  }, [onClose]);

  const handleToggleGroup = useCallback((groupId: number) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }, []);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return hashtags;

    const q = search.toLowerCase();

    return hashtags
      .map((g) => ({
        ...g,
        group: {
          ...g.group,
          tags: g.group.tags.filter((t) => {
            const title = t.title.toLowerCase();
            const hashtag = t.hashtag.toLowerCase();
            return title.includes(q) || hashtag.includes(q);
          }),
        },
      }))
      .filter((g) => g.group.tags.length > 0);
  }, [hashtags, search]);

  const handleTagClick = useCallback(
    (tag: string) => {
      onTagSelect(tag);
    },
    [onTagSelect],
  );

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      PaperProps={{
        sx: {
          width: 400,
          maxHeight: 600,
          mt: 0.5,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ p: 1.5, flexShrink: 0 }}>
        <TextField
          inputRef={inputRef}
          size="small"
          fullWidth
          placeholder="Поиск по тегам..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 1 }}>
                <SearchRounded fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
          sx={SEARCH_INPUT_SX}
        />
      </Box>

      <Box sx={{ flex: 1, overflow: "auto" }}>
        {filteredGroups.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", py: 3 }}
          >
            Ничего не найдено
          </Typography>
        ) : (
          <List disablePadding>
            {filteredGroups.map((groupDto) => {
              const { group } = groupDto;
              const isExpanded = expandedGroups.has(group.id);

              return (
                <>
                  {group.id !== null && (
                    <ListItem
                      key={group.id}
                      disableGutters
                      disablePadding
                      sx={{ px: 0 }}
                    >
                      <ListItemButton
                        disableGutters
                        sx={LIST_ITEM_GROUP_SX}
                        onClick={() => handleToggleGroup(group.id)}
                      >
                        <ListItemText
                          primary={group.name}
                          primaryTypographyProps={{
                            variant: "body1",
                            fontWeight: "bold",
                            noWrap: true,
                          }}
                        />
                        <ListItemIcon
                          sx={{
                            minWidth: 28,
                            mr: 1,
                            justifyContent: "flex-end",
                          }}
                        >
                          {isExpanded ? (
                            <ExpandLessRounded fontSize="small" />
                          ) : (
                            <ExpandMoreRounded fontSize="small" />
                          )}
                        </ListItemIcon>
                      </ListItemButton>
                    </ListItem>
                  )}

                  {(isExpanded || group.id === null) &&
                    group.tags.map((tag) => {
                      const prefixed = normalizePrefix(tag.hashtag);
                      const isSelected = tags.includes(prefixed);

                      return (
                        <ListItem
                          key={tag.id}
                          disableGutters
                          disablePadding
                          sx={{ px: 0 }}
                        >
                          <ListItemButton
                            disableGutters
                            sx={LIST_ITEM_GROUP_SX}
                            onClick={() => handleTagClick(prefixed)}
                            title={tag.hint}
                          >
                            <ListItemText
                              primary={`${tag.title} (${prefixed})`}
                              primaryTypographyProps={{
                                variant: "body1",
                                noWrap: true,
                              }}
                            />
                            {isSelected && (
                              <ListItemIcon sx={{ justifyContent: "flex-end" }}>
                                <Check />
                              </ListItemIcon>
                            )}
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                </>
              );
            })}
          </List>
        )}
      </Box>
    </Popover>
  );
}
