import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import { useUser } from "@shared/user";
import { useAppNotifications } from "@shared/notifications";
import { STATE_CODES, type RequestDTO } from "@shared/request";
import { extractErrorMessage } from "@shared/api";

import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";

import { serializeTags, normalizePrefix } from "../../utils";
import { useChangeTagsMutation } from "../../api";
import { SH_TAG_PREFIX } from "../../constants";

export const useTags = (request: RequestDTO) => {
  const { notify } = useAppNotifications();

  const { user } = useUser();
  const log = useWorklogLogger();
  const [changeTags] = useChangeTagsMutation();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(serializeTags(request.tags));
  const requestTags = serializeTags(request.tags);
  const [input, setInput] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    if (!isEditorOpen) return;
    inputRef.current?.focus();
  }, [isEditorOpen]);

  const openEditor = () => {
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setTags(requestTags);
    setInput("");
    setIsEditorOpen(false);
  };

  const canAddTag = useMemo(() => {
    if (tags.length !== requestTags.length) return true;

    const sortedSavedTags = tags.sort();
    const sortedIncidentTags = requestTags.sort();

    for (let i = 0; i < sortedSavedTags.length; i++) {
      if (sortedSavedTags[i] !== sortedIncidentTags[i]) return true;
    }

    return false;
  }, [tags, requestTags]);

  const replaceShTags = (
    tag: string,
    tagsToView: string[],
  ): string[] | undefined => {
    const normalizedTag = normalizePrefix(tag);

    const isSh = normalizedTag.toLocaleUpperCase().startsWith(SH_TAG_PREFIX);
    if (isSh) {
      const existingTagsWithoutSh = tagsToView.filter(
        (t) => !t.toLocaleUpperCase().startsWith(SH_TAG_PREFIX),
      );

      const isShTagChanged = tagsToView.length !== existingTagsWithoutSh.length;

      if (isShTagChanged) notify("Тег SH-ID заменен", "warning");

      return [...existingTagsWithoutSh, normalizedTag];
    }
  };

  const handleSaveTags = (tagsToSave: string[]) => {
    const stringifiedTags = tagsToSave.join(" ").trim();

    if (stringifiedTags.length > 255)
      return notify("Превышено допустимое значение символов", "error");

    if (request.stateCode === STATE_CODES.CLOSED)
      return notify("Запрос закрыт, редактирование тегов невозможно", "error");

    const oldSet = new Set(requestTags);
    const addedTags = tagsToSave.filter((t) => !oldSet.has(t));
    const removedTags = requestTags.filter((t) => !new Set(tagsToSave).has(t));

    changeTags({
      tags: stringifiedTags.trim() === "" ? "null" : stringifiedTags,
      businessId: request.businessId,
      taskId: request.taskId,
      employeeNumber: user?.employeeNumber ?? "",
    })
      .unwrap()
      .then(() => {
        notify("Теги сохранены", "success");
        closeEditor();
        for (const tag of addedTags) {
          const isDirTag = tag.startsWith(SH_TAG_PREFIX);
          log({
            task: request.businessId,
            action: isDirTag
              ? WORKLOG_ACTIONS.WRITE_HASHTAG_DIR
              : WORKLOG_ACTIONS.WRITE_HASHTAG,
            commentParams: { tag: isDirTag ? tag : tag.replace(/^#/, "") },
          });
        }
        for (const tag of removedTags) {
          log({
            task: request.businessId,
            action: WORKLOG_ACTIONS.DELETE_HASHTAG,
            commentParams: { tag },
          });
        }
      })
      .catch((error) => notify(extractErrorMessage(error.data), "error"));
  };

  const handleSaveTag = (tag: string) => {
    const replacedTags = replaceShTags(tag, tags);
    handleSaveTags(replacedTags!);
  };

  const getIsLinked = useCallback(
    (tag: string) => {
      return serializeTags(request.tags).some(
        (t) => t === normalizePrefix(tag),
      );
    },
    [request],
  );

  const handleAddTag = (tag: string) => {
    if (tag.trim() === "" || tag.trim() === "#") {
      if (canAddTag) handleSaveTags(tags);
      return;
    }

    setTags((tags) => {
      const normalizedTag = normalizePrefix(tag);

      const shTags = replaceShTags(normalizedTag, tags);

      if (shTags) return shTags;

      const isTagExists = tags.some((t) => t === normalizedTag);
      if (isTagExists) return tags;
      return [...tags, normalizedTag];
    });

    setInput("");
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags((tags) => tags.filter((t) => t !== tagToDelete));
    openEditor();
  };

  const handleToggleTag = (tag: string) => {
    const normalizedTag = normalizePrefix(tag);
    const isTagExists = tags.some((t) => t === normalizedTag);

    if (isTagExists) return handleDeleteTag(normalizedTag);

    handleAddTag(normalizedTag);
  };

  return {
    tags,
    inputRef,
    isEditorOpen,
    openEditor,
    closeEditor,
    input,
    setInput,
    canAddTag,
    handleDeleteTag,
    handleAddTag,
    handleToggleTag,
    handleSaveTags,
    replaceShTags,
    handleSaveTag,
    getIsLinked,
  };
};
