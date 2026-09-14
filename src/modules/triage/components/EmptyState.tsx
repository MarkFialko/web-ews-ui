import { Box, Typography } from "@mui/material";

type EmptyStateProps = {
  isEsmMatch: boolean;
};

export function EmptyState({ isEsmMatch }: EmptyStateProps) {
  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        Ничего не найдено.
      </Typography>
      {isEsmMatch ? (
        <Typography variant="body2" color="text.secondary" align="center">
          Похоже, это номер заявки — попробуйте найти в ESM.
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary" align="center">
          Попробуйте изменить параметры фильтрации.
        </Typography>
      )}
    </Box>
  );
}
