import {
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";

import {
  ExpandMoreRounded,
  ExpandLessRounded,
  Check,
} from "@mui/icons-material";

import type { HashtagGroupNode } from "@shared/queries/dictionaryApi";
import { normalizePrefix } from "../../../utils";

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

const INDENT_STEP = 1.5;

interface GroupNodeItemProps {
  node: HashtagGroupNode;
  depth: number;
  expandedGroups: Set<number>;
  matchedPathIds: Set<number>;
  selectedTags: string[];
  onToggleGroup: (id: number) => void;
  onTagClick: (tag: string) => void;
}

export function GroupNodeItem({
  node,
  depth,
  expandedGroups,
  matchedPathIds,
  selectedTags,
  onToggleGroup,
  onTagClick,
}: GroupNodeItemProps) {
  const isExpanded =
    node.id !== null &&
    (expandedGroups.has(node.id) || matchedPathIds.has(node.id));
  const showContent = node.id === null || isExpanded;
  const tagDepth = node.id === null ? depth : depth + 1;

  return (
    <>
      {node.id !== null && (
        <ListItem disableGutters disablePadding sx={{ px: 0 }}>
          <ListItemButton
            disableGutters
            sx={{ ...LIST_ITEM_GROUP_SX, pl: 1.5 + depth * INDENT_STEP }}
            onClick={() => onToggleGroup(node.id!)}
          >
            <ListItemText
              primary={node.name}
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

      {showContent &&
        node.tags.map((tag) => {
          const prefixed = normalizePrefix(tag.hashtag);
          const isSelected = selectedTags.includes(prefixed);

          return (
            <ListItem key={tag.id} disableGutters disablePadding sx={{ px: 0 }}>
              <ListItemButton
                disableGutters
                sx={{ ...LIST_ITEM_GROUP_SX, pl: 1.5 + tagDepth * INDENT_STEP }}
                onClick={() => onTagClick(prefixed)}
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

      {showContent &&
        node.children.map((child) => (
          <GroupNodeItem
            key={child.id}
            node={child}
            depth={depth + 1}
            expandedGroups={expandedGroups}
            matchedPathIds={matchedPathIds}
            selectedTags={selectedTags}
            onToggleGroup={onToggleGroup}
            onTagClick={onTagClick}
          />
        ))}
    </>
  );
}
