import {
  Fragment,
  useState,
  useMemo,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";

import { Popover, Box, List } from "@mui/material";

import { useGetHashtagsQuery } from "@shared/queries/dictionaryApi";
import type { HashtagGroupNode } from "@shared/queries/dictionaryApi";

import { useUser } from "@shared/user";

import { GroupNodeItem } from "./components/GroupNodeItem";
import { TagsSearchField } from "./components/TagsSearchField";
import { TagsEmptyState } from "./components/TagsEmptyState";

interface DictionaryTagsPopoverProps {
  tags: string[];
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onTagSelect: (tag: string) => void;
}

function collectSubtreeIds(node: HashtagGroupNode, ids: Set<number>) {
  if (node.id !== null) ids.add(node.id);
  for (const child of node.children) collectSubtreeIds(child, ids);
}

function filterTree(nodes: HashtagGroupNode[], query: string) {
  const matchedPathIds = new Set<number>();

  const walk = (node: HashtagGroupNode): HashtagGroupNode | null => {
    // Совпадение по названию группы — показываем её целиком (свои теги +
    // все подгруппы без доп. фильтрации) и раскрываем всё поддерево.
    if (node.id !== null && node.name?.toLowerCase().includes(query)) {
      collectSubtreeIds(node, matchedPathIds);
      return node;
    }

    const ownMatches = node.tags.filter((t) => {
      const title = t.title.toLowerCase();
      const hashtag = t.hashtag.toLowerCase();
      return title.includes(query) || hashtag.includes(query);
    });

    const filteredChildren = node.children
      .map(walk)
      .filter((child): child is HashtagGroupNode => child !== null);

    const survives = ownMatches.length > 0 || filteredChildren.length > 0;
    if (!survives) return null;

    if (node.id !== null) matchedPathIds.add(node.id);

    return { ...node, tags: ownMatches, children: filteredChildren };
  };

  const filteredNodes = nodes
    .map(walk)
    .filter((node): node is HashtagGroupNode => node !== null);

  return { nodes: filteredNodes, matchedPathIds };
}

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

  const filteredTree = useMemo(() => {
    if (!search.trim()) {
      return { nodes: hashtags, matchedPathIds: new Set<number>() };
    }
    return filterTree(hashtags, search.toLowerCase());
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
        <TagsSearchField
          inputRef={inputRef}
          value={search}
          onChange={setSearch}
        />
      </Box>

      <Box sx={{ flex: 1, overflow: "auto" }}>
        {filteredTree.nodes.length === 0 ? (
          <TagsEmptyState />
        ) : (
          <List disablePadding>
            {filteredTree.nodes.map((node) => (
              <Fragment key={node.id ?? "ungrouped"}>
                <GroupNodeItem
                  node={node}
                  depth={0}
                  expandedGroups={expandedGroups}
                  matchedPathIds={filteredTree.matchedPathIds}
                  selectedTags={tags}
                  onToggleGroup={handleToggleGroup}
                  onTagClick={handleTagClick}
                />
              </Fragment>
            ))}
          </List>
        )}
      </Box>
    </Popover>
  );
}
