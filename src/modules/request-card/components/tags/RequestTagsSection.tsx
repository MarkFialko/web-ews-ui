import {
  useState,
  type KeyboardEvent,
  type SyntheticEvent,
  useRef,
} from "react";

import {
  Chip,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Autocomplete,
  IconButton,
} from "@mui/material";

import { SectionHeader, useCopy } from "@shared/ui";
import { type RequestDTO } from "@shared/request";

import { SaveButton } from "./SaveButton";
import { ClearButton } from "./ClearButton";
import { useTags } from "./useTags";
import { DictionaryTagsPopover } from "./DictionaryTagsPopover";
import { SearchRounded } from "@mui/icons-material";

const AUTOCOMPLETE_SX = {
  flex: 1,
  minWidth: 260,
  "& .MuiAutocomplete-inputRoot": {
    py: 0.25,
    pr: 1,
    alignItems: "center",
  },
  "& .MuiAutocomplete-tag": {
    m: 0.25,
  },
};

interface Props {
  request: RequestDTO;
}

export function RequestTagsSection(props: Props) {
  const { request } = props;

  const {
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
    handleSaveTags,
    handleToggleTag,
  } = useTags(request);

  const { copy } = useCopy();

  const paperRef = useRef<HTMLDivElement | null>(null);

  const [dictionaryAnchor, setDictionaryAnchor] =
    useState<HTMLDivElement | null>(null);

  const handleCloseDictionary = () => {
    setDictionaryAnchor(null);
  };

  const handleDictionaryTagSelect = (tag: string) => {
    handleToggleTag(tag);
  };

  const handleOpenDictionary = () => {
    openEditor();
    setDictionaryAnchor(paperRef.current);
  };

  const handleClick = (tag: string) => {
    copy(tag, "Тег скопирован");
  };

  const handleInputChange = (_event: SyntheticEvent, value: string) => {
    setInput(value);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;
    if (key === " " || key === "Enter") {
      event.preventDefault();
      handleAddTag(input);
    }
    if (key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeEditor();
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 1.5 }} ref={paperRef}>
      <Stack spacing={0.75}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <SectionHeader sx={{ mb: 0 }}>Теги</SectionHeader>
          <Tooltip title="Словарь тегов">
            <IconButton size="small" onClick={handleOpenDictionary}>
              <SearchRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {!isEditorOpen ? (
          <Stack
            direction="row"
            spacing={0.75}
            flexWrap="wrap"
            useFlexGap
            alignItems="center"
          >
            {tags.map((tag) => (
              <Chip
                key={tag}
                size="small"
                label={tag}
                onClick={() => handleClick(tag)}
                onDelete={() => handleDeleteTag(tag)}
              />
            ))}
            <Tooltip title="При добавлении нескольких тегов в качестве разделителя использовать пробел">
              <Chip
                size="small"
                variant="outlined"
                label="+"
                onClick={openEditor}
              />
            </Tooltip>
          </Stack>
        ) : (
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={1}
            alignItems={{ lg: "center" }}
          >
            <Autocomplete
              disableCloseOnSelect
              multiple
              freeSolo
              disableClearable
              options={[]}
              value={tags}
              inputValue={input}
              onInputChange={handleInputChange}
              sx={AUTOCOMPLETE_SX}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    onClick={() => handleClick(value[index])}
                    onDelete={() => handleDeleteTag(value[index])}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  inputRef={inputRef}
                  onKeyDown={handleKeyDown}
                  inputProps={{ ...params.inputProps }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        <ClearButton onClose={closeEditor} />
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            <SaveButton
              onSave={() => handleSaveTags(tags)}
              disabled={!canAddTag}
            />
          </Stack>
        )}
      </Stack>
      <DictionaryTagsPopover
        tags={tags}
        anchorEl={dictionaryAnchor}
        onClose={handleCloseDictionary}
        onTagSelect={handleDictionaryTagSelect}
      />
    </Paper>
  );
}
