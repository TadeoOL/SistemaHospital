// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - CHART TOOLTIP ||============================== //

export default function ChartTooltip(theme: Theme) {
  return {
    MuiChartsTooltip: {
      styleOverrides: {
        container: {
          overflow: 'hidden'
        },
        table: {
          '& thead tr td': {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.default
          }
        },
        mark: {
          border: 'none'
        }
      }
    }
  };
}
