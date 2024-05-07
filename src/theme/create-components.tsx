import {
  Components,
  alpha,
  buttonClasses,
  createTheme,
  filledInputClasses,
  inputClasses,
  inputLabelClasses,
  outlinedInputClasses,
  paperClasses,
  selectClasses,
  tableCellClasses,
} from '@mui/material';

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
        color: 'primary',
      },
      styleOverrides: {
        root: {
          fontWeight: 400,
          borderRadius: 4,
          [`&.${buttonClasses.containedPrimary}`]: {
            transitionDuration: '0.4s',
            position: 'relative',
            '&:active': {
              '&:after': {
                boxShadow: '0 0 0 0 rgba(22, 119, 255, 0.9)',
                position: 'absolute',
                borderRadius: 4,
                left: 0,
                top: 0,
                opacity: 1,
                transition: '0s',
              },
            },
            '&:after': {
              content: '""',
              display: 'block',
              position: 'absolute',
              borderRadius: 4,
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              transition: 'all 0.5s',
              boxShadow: '0 0 5px 5px rgba(22, 119, 255, 0.9)',
            },
          },
          [`&.${buttonClasses.outlinedError}`]: {
            transitionDuration: '0.4s',
            position: 'relative',
            '&:active': {
              '&:after': {
                boxShadow: '0 0 0 0 rgba(255, 77, 79, 0.9)',
                position: 'absolute',
                borderRadius: 4,
                left: 0,
                top: 0,
                opacity: 1,
                transition: '0s',
              },
            },
            '&:after': {
              content: '""',
              display: 'block',
              position: 'absolute',
              borderRadius: 4,
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              transition: 'all 0.5s',
              boxShadow: '0 0 5px 5px rgba(255, 77, 79, 0.9)',
            },
          },
          [`&.${buttonClasses.containedError}`]: {
            transitionDuration: '0.4s',
            position: 'relative',
            '&:active': {
              '&:after': {
                boxShadow: '0 0 0 0 rgba(255, 77, 79, 0.9)',
                position: 'absolute',
                borderRadius: 4,
                left: 0,
                top: 0,
                opacity: 1,
                transition: '0s',
              },
            },
            '&:after': {
              content: '""',
              display: 'block',
              position: 'absolute',
              borderRadius: 4,
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              transition: 'all 0.5s',
              boxShadow: '0 0 5px 5px rgba(255, 77, 79, 0.9)',
            },
          },
          sizeSmall: {
            padding: '6px 16px',
          },
          sizeMedium: {
            padding: '8px 20px',
          },
          sizeLarge: {
            padding: '11px 24px',
          },
          textSizeSmall: {
            padding: '7px 12px',
          },
          textSizeMedium: {
            padding: '9px 16px',
          },
          textSizeLarge: {
            padding: '12px 16px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          [`&.${paperClasses.elevation1}`]: {
            boxShadow: '0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '32px 24px',
          '&:last-child': {
            paddingBottom: '32px',
          },
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: 'h6',
        },
        subheaderTypographyProps: {
          variant: 'body2',
        },
      },
      styleOverrides: {
        root: {
          padding: '32px 24px 16px',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          MozOsxFontSmoothing: 'grayscale',
          WebkitFontSmoothing: 'antialiased',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
        },
        body: {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
        },
        '#__next': {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        },
        '#nprogress': {
          pointerEvents: 'none',
        },
        '#nprogress .bar': {
          backgroundColor: palette.primary.main,
          height: 3,
          left: 0,
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 2000,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        [`&.${inputClasses.multiline}`]: {
          display: 'flex',
          alignItems: 'start',
          height: 100,
        },
        input: {
          '&::placeholder': {
            opacity: 0.4,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        input: {
          fontSize: 14,
          fontWeight: 400,
          lineHeight: '24px',
          '&::placeholder': {
            color: palette.text.secondary,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: '9px 10px 9px 12px',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          padding: '3px 14px 3px 12px',
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          borderRadius: 8,
          borderStyle: 'solid',
          borderWidth: 1,
          overflow: 'hidden',
          paddingTop: 0,
          borderColor: palette.neutral[200],
          transition: muiTheme.transitions.create(['border-color', 'box-shadow']),
          '&:hover': {
            borderColor: palette.primary.main,
            backgroundColor: 'transparent',
            boxShadow: `${palette.primary.main} 0 0 0 1px`,
          },
          '&:before': {
            display: 'none',
          },
          '&:after': {
            display: 'none',
          },
          [`&.${filledInputClasses.disabled}`]: {
            backgroundColor: 'transparent',
          },
          [`&.${filledInputClasses.focused}`]: {
            backgroundColor: 'transparent',
            borderColor: alpha(palette.primary.main, 0.6),
            boxShadow: `${alpha(palette.primary.main, 0.2)} 0 0 0 2px`,
          },
          [`&.${filledInputClasses.error}`]: {
            borderColor: alpha(palette.error.main, 0.6),
            boxShadow: `${alpha(palette.error.main, 0.2)} 0 0 0 2px`,
          },
          [`&.${filledInputClasses.multiline}`]: {
            display: 'flex',
            alignItems: 'start',
            height: 100,
            overflowY: 'auto',
          },
        },
        input: {
          fontSize: 12,
          fontWeight: 400,
          lineHeight: '24px',
          padding: '10.5px 14px 10.5px 12px',
          '&.tableCell': {
            padding: '5.5px 14px 5.5px 12px',
            maxWidth: 70,
          },
        },
        inputMultiline: {
          fontSize: 14,
          fontWeight: 400,
          lineHeight: '24px',
          padding: '8px 0px 5px 0px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: palette.action.hover,
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: palette.neutral[200],
            },
          },
          [`&.${outlinedInputClasses.focused}`]: {
            backgroundColor: 'transparent',
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
          lineHeight: '24px',
        },
        notchedOutline: {
          borderColor: palette.neutral[200],
          transition: muiTheme.transitions.create(['border-color', 'box-shadow']),
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 400,
          color: 'gray',
          padding: '11px 14px 10.5px 13px',
          [`&.${inputLabelClasses.filled}`]: {
            transform: 'translate(0,0) scale(1)',
            padding: '11px 14px 10.5px 13px',
            color: alpha('#808080', 0.5),
            transition: 'all 0.2s ease-in-out',
            [`&.${selectClasses.select}`]: {
              transform: 'translate(20px,0) scale(1)',
              padding: '11px 14px 10.5px 13px',
              color: alpha('#808080', 0.5),
            },
          },
          [`&.${inputLabelClasses.shrink}`]: {
            [`&.${inputLabelClasses.standard}`]: {
              transform: 'translate(0,0) scale(0.85)',
            },
            [`&.${inputLabelClasses.filled}`]: {
              top: '-20%',
              left: '10%',
              padding: '0 .3em',
              fontSize: 11,
              fontWeight: 400,
              transition: 'all 0.2s ease-in-out',
              background: '#FFFFFF',
              display:"none"
            },
            [`&.${inputLabelClasses.outlined}`]: {
              transform: 'translate(14px, -9px) scale(0.85)',
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          lineHeight: '0.8em',
          '&.MuiInputLabel-sizeSmall': {
            lineHeight: '1em',
          },
          '&.MuiInputLabel-shrink': {
            padding: '0 8px',
            marginLeft: -6,
            lineHeight: '1.4375em',
          },
        },
        filled: {
          margin: 0,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTabs-indicator': {
            backgroundColor: palette.primary.main,
            height: 3,
            borderLeft: `0.1rem solid ${palette.primary.contrastText}`,
            borderRight: `0.1rem solid ${palette.primary.contrastText}`,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: 14,
          padding: '1px 0',
          fontWeight: 500,
          lineHeight: 1.71,
          minWidth: 'auto',
          paddingLeft: 0,
          paddingRight: 0,
          textTransform: 'none',
          transition: 'background-color 300ms linear, color 300ms linear',
          '&.MuiTab-root': {
            color: palette.primary.contrastText,
            backgroundColor: palette.primary.main,
            borderLeft: `0.1rem solid ${palette.primary.contrastText}`,
            borderRight: `0.1rem solid ${palette.primary.contrastText}`,
            '&:hover': {
              backgroundColor: palette.primary.darkest,
            },
          },
          '&.Mui-selected': {
            backgroundColor: palette.primary.dark,
            color: palette.primary.contrastText,
            '&:hover': {
              backgroundColor: palette.primary.darkest,
            },
          },
          '&:first-of-type': {
            borderLeft: 'none',
          },
          '&:last-of-type': {
            borderRight: 'none',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: palette.divider,
          padding: '15px 16px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: palette.neutral[100],
          [`& .${tableCellClasses.root}`]: {
            color: 'rgb(38, 38, 38)',
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
        variant: 'filled',
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
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
        sizeLarge: {
          width: muiTheme.spacing(5.5),
          height: muiTheme.spacing(5.5),
          fontSize: '1.25rem',
        },
        sizeMedium: {
          width: muiTheme.spacing(4.5),
          height: muiTheme.spacing(4.5),
          fontSize: '1rem',
        },
        sizeSmall: {
          width: muiTheme.spacing(3.75),
          height: muiTheme.spacing(3.75),
          fontSize: '0.75rem',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.textoTachado': {
            position: 'relative',
            display: 'inline-block',
            color: 'red',
          },
          '&.textoTachado::after': {
            content: "''",
            position: 'absolute',
            bottom: '0.7em',
            left: '-40%',
            width: '190%',
            borderBottom: '1px solid red',
            transform: 'rotate(-60deg)',
          },
        },
      },
    },
  };
}
