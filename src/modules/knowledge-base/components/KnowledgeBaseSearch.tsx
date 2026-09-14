import { CloseRounded, SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useState, type SubmitEvent } from "react";
import { useLazyGetKnowledgeArticleQuery } from "../api/knowledgeBaseApi";

interface Props {
  onSubmit: ReturnType<typeof useLazyGetKnowledgeArticleQuery>[0];
  onFindArticle: () => void;
}

export function KnowledgeBaseSearch(props: Props) {
  const { onFindArticle, onSubmit } = props;

  const [search, setSearch] = useState<string>("");
  const [searchError, setSearchError] = useState<string>("");

  const validate = (): boolean => {
    setSearchError("");

    if (!search.trim()) {
      setSearchError("Введите SH-ID для поиска");
      return false;
    }

    // Разрешаем optional ';' в конце
    const searchValue = search.replace(/;$/, "");
    const shIdPattern = /^(#)?SH-[\da-fA-F-]+$/;
    if (!shIdPattern.test(searchValue.trim())) {
      setSearchError("Неверный формат SH-ID. Начало должно быть SH- (#SH-)");
      return false;
    }

    return true;
  };

  const normalizeShId = (value: string): string => {
    return value.replace(/^#/, "").replace(/;$/, "").trim();
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit(normalizeShId(search))
      .unwrap()
      .then(onFindArticle)
      .catch(() => {
        setSearchError("Статья не найдена");
      });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        size="small"
        fullWidth
        label="Поиск по SH-ID"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Например, SH-0487dbed-3b46-4126-aceb-5ac76b83673e или #SH-0487dbed-3b46-4126-aceb-5ac76b83673e"
        error={Boolean(searchError)}
        helperText={searchError || " "}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {search.trim().length > 0 && (
                <IconButton
                  size="small"
                  onClick={() => setSearch("")}
                  sx={{ mr: 0.5 }}
                >
                  <CloseRounded fontSize="small" />
                </IconButton>
              )}
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <IconButton size="small" type="submit">
                <SearchOutlined fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
