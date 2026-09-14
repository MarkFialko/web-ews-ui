import {
  CallMadeOutlined,
  CallReceivedOutlined,
  ContentCopyOutlined,
} from "@mui/icons-material";
import {
  Stack,
  Divider,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Box,
} from "@mui/material";

export interface CTIListProps {
  title: string;
  rows: string[][];
  onSelect: (value: string) => void;
  showCopyAction?: boolean;
  showDirection?: boolean;
}

export const CTIList = (props: CTIListProps) => {
  const {
    title,
    rows,
    onSelect,
    showCopyAction = false,
    showDirection = false,
  } = props;

  return (
    <Stack divider={<Divider flexItem />}>
      <Typography
        variant="caption"
        sx={{ display: "block", px: 1, py: 0.55, fontWeight: 800 }}
      >
        {title}
      </Typography>

      {rows.length === 0 && (
        <Typography
          variant="body2"
          color="textSecondary"
          textAlign="center"
          p={1}
        >
          В истории еще нет записей
        </Typography>
      )}

      {rows.map(([label, description, value, direction]) => (
        <Stack
          key={`${label}-${description}-${value}`}
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{
            px: 1,
            py: 0.45,
          }}
        >
          <Button
            variant="text"
            onClick={() => onSelect(value)}
            sx={{
              flex: 1,
              minWidth: 0,
              justifyContent: "space-between",
              p: 0,
              borderRadius: 0,
              textAlign: "left",
              fontSize: 12,
              gap: 1,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {showDirection ? (
                  <Tooltip
                    title={
                      direction === "outbound"
                        ? "Исходящий вызов"
                        : direction === "missed"
                          ? "Пропущенный вызов"
                          : "Входящий вызов"
                    }
                  >
                    <Box
                      component="span"
                      sx={{ display: "inline-flex", color: "text.secondary" }}
                    >
                      {direction === "outbound" ? (
                        <CallMadeOutlined fontSize="inherit" />
                      ) : (
                        <CallReceivedOutlined
                          fontSize="inherit"
                          sx={{
                            color:
                              direction === "missed" ? "error" : "inherit",
                          }}
                        />
                      )}
                    </Box>
                  </Tooltip>
                ) : null}
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {label}
                </Typography>
              </Stack>
              {description ? (
                <Typography variant="caption" color="text.secondary">
                  {description}
                </Typography>
              ) : null}
            </Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 800, whiteSpace: "nowrap" }}
            >
              {value}
            </Typography>
          </Button>
          {showCopyAction ? (
            <Tooltip title="Скопировать номер">
              <IconButton
                size="small"
                aria-label={`Скопировать номер ${value}`}
                onClick={() => void navigator.clipboard?.writeText(value)}
              >
                <ContentCopyOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : null}
        </Stack>
      ))}
    </Stack>
  );
};
