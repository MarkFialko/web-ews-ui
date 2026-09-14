import { useEffect, useRef, useState } from "react";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Search, X } from "lucide-react";
import type { ClientAccess } from "../types/ClientAccess";

export type ClientAccessesSectionProps = {
  accesses: ClientAccess[];
  highlightedAccessName?: string | null;
};

/**
 * Access list with inline filtering for the Client Card module.
 */
function ClientAccessesSection({
  accesses,
  highlightedAccessName = null,
}: ClientAccessesSectionProps) {
  const [accessFilter, setAccessFilter] = useState("");
  const highlightedAccessRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!highlightedAccessName) return;

    const frameId = requestAnimationFrame(() => {
      highlightedAccessRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [highlightedAccessName]);

  return (
    <Stack spacing={1.5}>
      <TextField
        size="small"
        label="Поиск по учетным записям"
        value={accessFilter}
        onChange={(event) => setAccessFilter(event.target.value)}
        InputProps={{
          endAdornment:
            accessFilter.trim().length > 0 ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setAccessFilter("")}
                  sx={{ mr: 0.5 }}
                >
                  <X size={16} />
                </IconButton>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                <IconButton size="small">
                  <Search size={18} />
                </IconButton>
              </InputAdornment>
            ) : (
              <InputAdornment position="end">
                <IconButton size="small">
                  <Search size={18} />
                </IconButton>
              </InputAdornment>
            ),
        }}
      />

      {accesses
        .filter(
          (access) =>
            access.userName === highlightedAccessName ||
            `${access.userName} ${access.aStatus} ${access.rName ?? ""}`
              .toLowerCase()
              .includes(accessFilter.toLowerCase()),
        )
        .map((access, index) => {
          const accessKey = `${access.userName}-${access.aStatus}-${access.rName ?? ""}-${index}`;
          // const reason =
          //   access.rName && access.rName !== "-" ? access.rName : null;
          const isBlocked = access.aStatus === 0 ? "Активен" : "Заблокирован";
          const isHighlighted =
            Boolean(highlightedAccessName) &&
            access.userName === highlightedAccessName;

          return (
            <Paper
              key={accessKey}
              ref={isHighlighted ? highlightedAccessRef : undefined}
              variant="outlined"
              sx={(theme) => ({
                p: 1.5,
                borderColor: isHighlighted
                  ? theme.palette.primary.main
                  : theme.palette.divider,
                backgroundColor: isHighlighted
                  ? alpha(theme.palette.primary.main, 0.08)
                  : theme.palette.background.paper,
                boxShadow: isHighlighted
                  ? `0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`
                  : "none",
              })}
            >
              <Stack spacing={0.5}>
                <Typography variant="subtitle2">{access.rName}</Typography>
                {isBlocked !== "Активен" ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Статус:
                    </Typography>
                    <Chip label={isBlocked} color="error" size="small" />
                  </Stack>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    Статус: {isBlocked}
                  </Typography>
                )}
                {/*{reason && (*/}
                {/*  <Typography variant="caption" color="text.secondary">*/}
                {/*    Причина: {access.rName}*/}
                {/*  </Typography>*/}
                {/*)}*/}
              </Stack>
            </Paper>
          );
        })}
      {accesses.length === 0 && (
        <Box>
          <Typography variant="body2" color="text.secondary">
            Нет доступов для отображения.
          </Typography>
        </Box>
      )}
    </Stack>
  );
}

export default ClientAccessesSection;
