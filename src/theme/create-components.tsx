import {
  Components,
  createTheme,
  filledInputClasses,
  inputLabelClasses,
  outlinedInputClasses,
  paperClasses,
  tableCellClasses,
} from "@mui/material";

// Used only to create transitions
const muiTheme = createTheme();

export function createComponents(config: { palette: any }): Components {
  const { palette } = config;

  return {
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontWeight: 400,
          borderRadius: 4,
        },
        sizeSmall: {
          padding: "6px 16px",
        },
        sizeMedium: {
          padding: "8px 20px",
        },
        sizeLarge: {
          padding: "11px 24px",
        },
        textSizeSmall: {
          padding: "7px 12px",
        },
        textSizeMedium: {
          padding: "9px 16px",
        },
        textSizeLarge: {
          padding: "12px 16px",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          [`&.${paperClasses.elevation1}`]: {
            boxShadow:
              "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "32px 24px",
          "&:last-child": {
            paddingBottom: "32px",
          },
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: "h6",
        },
        subheaderTypographyProps: {
          variant: "body2",
        },
      },
      styleOverrides: {
        root: {
          padding: "32px 24px 16px",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        html: {
          MozOsxFontSmoothing: "grayscale",
          WebkitFontSmoothing: "antialiased",
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          width: "100%",
        },
        body: {
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          minHeight: "100%",
          width: "100%",
        },
        "#__next": {
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          height: "100%",
          width: "100%",
        },
        "#nprogress": {
          pointerEvents: "none",
        },
        "#nprogress .bar": {
          backgroundColor: palette.primary.main,
          height: 3,
          left: 0,
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 2000,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&::placeholder": {
            opacity: 1,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        input: {
          fontSize: 14,
          fontWeight: 500,
          lineHeight: "24px",
          "&::placeholder": {
            color: palette.text.secondary,
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          borderRadius: 8,
          borderStyle: "solid",
          borderWidth: 1,
          overflow: "hidden",
          borderColor: palette.neutral[200],
          transition: muiTheme.transitions.create([
            "border-color",
            "box-shadow",
          ]),
          "&:hover": {
            backgroundColor: palette.action.hover,
          },
          "&:before": {
            display: "none",
          },
          "&:after": {
            display: "none",
          },
          [`&.${filledInputClasses.disabled}`]: {
            backgroundColor: "transparent",
          },
          [`&.${filledInputClasses.focused}`]: {
            backgroundColor: "transparent",
            borderColor: palette.primary.main,
            boxShadow: `${palette.primary.main} 0 0 0 2px`,
          },
          [`&.${filledInputClasses.error}`]: {
            borderColor: palette.error.main,
            boxShadow: `${palette.error.main} 0 0 0 2px`,
          },
        },
        input: {
          fontSize: 14,
          fontWeight: 400,
          lineHeight: "24px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: palette.action.hover,
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: palette.neutral[200],
            },
          },
          [`&.${outlinedInputClasses.focused}`]: {
            backgroundColor: "transparent",
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: palette.primary.main,
              boxShadow: `${palette.primary.main} 0 0 0 2px`,
            },
          },
          [`&.${filledInputClasses.error}`]: {
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: palette.error.main,
              boxShadow: `${palette.error.main} 0 0 0 2px`,
            },
          },
        },
        input: {
          fontSize: 14,
          fontWeight: 300,
          lineHeight: "24px",
        },
        notchedOutline: {
          borderColor: palette.neutral[200],
          transition: muiTheme.transitions.create([
            "border-color",
            "box-shadow",
          ]),
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 500,
          [`&.${inputLabelClasses.filled}`]: {
            transform: "translate(12px, 18px) scale(1)",
          },
          [`&.${inputLabelClasses.shrink}`]: {
            [`&.${inputLabelClasses.standard}`]: {
              transform: "translate(0, -1.5px) scale(0.85)",
            },
            [`&.${inputLabelClasses.filled}`]: {
              transform: "translate(12px, 6px) scale(0.85)",
            },
            [`&.${inputLabelClasses.outlined}`]: {
              transform: "translate(14px, -9px) scale(0.85)",
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: 14,
          padding: 1,
          fontWeight: 500,
          lineHeight: 1.71,
          minWidth: "auto",
          paddingLeft: 0,
          paddingRight: 0,
          textTransform: "none",
          transition: "300ms linear",
          color: palette.primary.contrastText,
          "&.Mui-selected": {
            backgroundColor: "#002E5F",
            color: palette.primary.contrastText,
          },
          "&.MuiTab-root:hover": {
            backgroundColor: "#002E5F",
            color: palette.primary.contrastText,
          },
          "&.MuiTab-root:hover:first-of-type": {
            backgroundColor: "#002E5F",
            color: palette.primary.contrastText,
            borderTopLeftRadius: 10,
          },
          "&.MuiTab-root:hover:last-child": {
            backgroundColor: "#002E5F",
            color: palette.primary.contrastText,
            borderTopRightRadius: 10,
          },
          "&.Mui-selected:first-of-type": {
            backgroundColor: "#002E5F",
            color: palette.primary.contrastText,
            borderTopLeftRadius: 10,
          },
          "&.Mui-selected:last-child": {
            backgroundColor: "#002E5F",
            color: palette.primary.contrastText,
            borderTopRightRadius: 10,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: palette.divider,
          padding: "15px 16px",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: palette.neutral[100],
          [`& .${tableCellClasses.root}`]: {
            color: "rgb(38, 38, 38)",
            fontSize: 14,
            fontWeight: 600,
          },
          [`& .${tableCellClasses.paddingCheckbox}`]: {
            paddingTop: 4,
            paddingBottom: 4,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "filled",
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          width: muiTheme.spacing(2.5),
          height: muiTheme.spacing(2.5),
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 24,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
        sizeLarge: {
          width: muiTheme.spacing(5.5),
          height: muiTheme.spacing(5.5),
          fontSize: "1.25rem",
        },
        sizeMedium: {
          width: muiTheme.spacing(4.5),
          height: muiTheme.spacing(4.5),
          fontSize: "1rem",
        },
        sizeSmall: {
          width: muiTheme.spacing(3.75),
          height: muiTheme.spacing(3.75),
          fontSize: "0.75rem",
        },
      },
    },
  };
}
