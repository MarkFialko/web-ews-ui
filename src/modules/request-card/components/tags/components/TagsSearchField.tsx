import type { Ref } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { SearchRounded } from "@mui/icons-material";

const SEARCH_INPUT_SX = {
  mb: 1,
  "& .MuiOutlinedInput-root": {
    fontSize: 14,
  },
};

interface TagsSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  inputRef?: Ref<HTMLInputElement>;
}

export function TagsSearchField({
  value,
  onChange,
  inputRef,
}: TagsSearchFieldProps) {
  return (
    <TextField
      inputRef={inputRef}
      size="small"
      fullWidth
      placeholder="Поиск по тегам..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ mr: 1 }}>
            <SearchRounded fontSize="small" color="action" />
          </InputAdornment>
        ),
      }}
      sx={SEARCH_INPUT_SX}
    />
  );
}
