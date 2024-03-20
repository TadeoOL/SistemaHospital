import { createTheme as createMuiTheme } from "@mui/material";
import { createPalette } from "./create-palette";
import { createShadows } from "./create-shadows";
import { createTypography } from "./create-typography";
import { createComponents } from "./create-components";

export function createTheme() {
  const palette = createPalette();
  const components = createComponents({ palette });
  const shadows = createShadows();
  const typography = createTypography();

  return createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 768,
        md: 1024,
        lg: 1266,
        xl: 1536,
      },
    },
    components,
    palette,
    shadows,
    shape: {
      borderRadius: 2,
    },
    typography,
  });
}
