import { Box, Typography } from "@mui/material";

interface Props {
  label: string;
  value: string;
}

export const InfoLine = (props: Props) => {
  const { label, value } = props;
  return (
    <Typography variant="body2" color="text.secondary">
      {label}:{" "}
      <Box component="span" sx={{ color: "text.primary", fontWeight: 800 }}>
        {value}
      </Box>
    </Typography>
  );
};
