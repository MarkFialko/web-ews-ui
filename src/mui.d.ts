import "@mui/material/styles";
import "@mui/material/Chip";
import "@mui/material/Typography";
import type { CSSProperties } from "react";

export {};

declare module "@mui/material/styles" {
  interface PaletteColor {
    focusRing?: string;
  }

  interface SimplePaletteColorOptions {
    focusRing?: string;
  }

  interface Palette {
    vip: PaletteColor;
  }

  interface PaletteOptions {
    vip?: SimplePaletteColorOptions;
  }

  interface TypographyVariants {
    bodyAccent: CSSProperties;
    fieldLabel: CSSProperties;
    metaTiny: CSSProperties;
    panelEyebrow: CSSProperties;
    sectionHeader: CSSProperties;
  }

  interface TypographyVariantsOptions {
    bodyAccent?: CSSProperties;
    fieldLabel?: CSSProperties;
    metaTiny?: CSSProperties;
    panelEyebrow?: CSSProperties;
    sectionHeader?: CSSProperties;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    vip: true;
    work: true;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    bodyAccent: true;
    fieldLabel: true;
    metaTiny: true;
    panelEyebrow: true;
    sectionHeader: true;
  }
}
