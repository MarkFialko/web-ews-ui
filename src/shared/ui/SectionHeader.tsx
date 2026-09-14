import { Typography, type TypographyProps } from "@mui/material";

export type SectionHeaderProps = Omit<TypographyProps, "variant"> & {
  children: TypographyProps["children"];
};

function SectionHeader({ children, sx, ...props }: SectionHeaderProps) {
  return (
    <Typography
      variant="sectionHeader"
      sx={{
        mb: 1,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

export default SectionHeader;
