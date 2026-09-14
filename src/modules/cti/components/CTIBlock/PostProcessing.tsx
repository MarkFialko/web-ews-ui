import { useTimer } from "@modules/cti/model";
import { Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useRef } from "react";

export const PostProcessing = () => {
  const timerRef = useRef(dayjs().unix());
  const timer = useTimer(timerRef.current);

  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        Поствызывная обработка: {timer}. Кнопки CTI временно недоступны.
      </Typography>
    </Stack>
  );
};
