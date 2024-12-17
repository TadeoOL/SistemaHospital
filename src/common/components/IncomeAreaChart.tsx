import { useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { LineChart } from '@mui/x-charts/LineChart';
import { ThemeMode } from '@/config';
import { Button, Grid } from '@mui/material';
import DateRangeSelector from './DateRangeSelector';

interface ItemProps {
  label: string;
  visible: boolean;
  color: string;
}

interface Props {
  view: 'monthly' | 'weekly';
  incomeMonthlyData?: number[];
  expenseMonthlyData?: number[];
  title?: string;
  setDateRange?: (dateRange: { start: Date; end: Date; weekly: boolean }) => void;
  dateRange?: { start: Date; end: Date; weekly: boolean };
  labels?: string[];
}

function Legend({ items, onToggle }: { items: ItemProps[]; onToggle: (label: string) => void }) {
  const theme = useTheme();
  const legendText = theme.palette.mode === ThemeMode.DARK ? 'common.white' : 'common.black';

  return (
    <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
      {items.map((item) => (
        <Box
          key={item.label}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: 'black',
            borderRadius: 1,
            p: 1,
            justifyContent: 'center',
          }}
          onClick={() => onToggle(item.label)}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              backgroundColor: item.visible ? item.color : 'grey.500',
              borderRadius: '50%',
              mr: 1,
            }}
          />
          <Typography variant="body2" color={legendText}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}

// ==============================|| INCOME AREA CHART ||============================== //

export default function IncomeAreaChart({
  incomeMonthlyData,
  expenseMonthlyData,
  title,
  setDateRange,
  dateRange,
  labels,
  view,
}: Props) {
  const theme = useTheme();

  const [visibility, setVisibility] = useState<{ [key: string]: boolean }>({
    Ingresos: true,
    Egresos: true,
  });

  const data1 = incomeMonthlyData;
  const data2 = expenseMonthlyData;

  const line = theme.palette.divider;

  const toggleVisibility = (label: string) => {
    setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const visibleSeries = [
    {
      data: data1,
      label: 'Ingresos',
      showMark: false,
      area: true,
      id: 'Ingresos',
      color: theme.palette.primary.main || '',
      visible: visibility['Ingresos'],
    },
    {
      data: data2,
      label: 'Egresos',
      showMark: false,
      area: true,
      id: 'Egresos',
      color: theme.palette.primary[700] || '',
      visible: visibility['Egresos'],
    },
  ];

  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  const getCurrentWeekRange = (): { start: Date; end: Date } => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { start: monday, end: sunday };
  };

  const handleDateRangeChange = (viewType: 'monthly' | 'weekly', start?: Date, end?: Date) => {
    const newDateRange = { ...dateRange };

    if (start && end) {
      newDateRange.start = start;
      newDateRange.end = end;
    } else if (viewType === 'weekly') {
      const { start, end } = getCurrentWeekRange();
      newDateRange.start = start;
      newDateRange.end = end;
      newDateRange.weekly = true;
    } else {
      newDateRange.start = new Date(new Date().getFullYear(), 0, 1);
      newDateRange.end = new Date(new Date().getFullYear() + 1, 0, 1);
      newDateRange.weekly = false;
    }

    setDateRange?.(newDateRange as { start: Date; end: Date; weekly: boolean });
  };

  return (
    <>
      <Grid container spacing={2} alignItems="center" sx={{ p: 2 }}>
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} container justifyContent="center" alignItems="center">
          <DateRangeSelector
            view={view}
            onDateRangeChange={handleDateRangeChange}
            dateRange={dateRange as { start: Date; end: Date; weekly: boolean }}
          />
        </Grid>
        <Grid item xs={12} sm={6} container justifyContent={'flex-end'} alignItems="center">
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={view === 'monthly' ? 'outlined' : 'light'}
              size="small"
              onClick={() => handleDateRangeChange('monthly')}
            >
              Año
            </Button>
            <Button
              variant={view === 'weekly' ? 'outlined' : 'light'}
              size="small"
              onClick={() => handleDateRangeChange('weekly')}
            >
              Semana
            </Button>
          </Box>
        </Grid>
      </Grid>
      <LineChart
        grid={{ horizontal: true }}
        xAxis={[{ scaleType: 'point', data: labels, disableLine: true, tickLabelStyle: axisFonstyle, label: 'Mes' }]}
        yAxis={[{ disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle }]}
        height={450}
        margin={{ top: 40, bottom: 20, right: 20 }}
        series={visibleSeries
          .filter((series) => series.visible)
          .map((series) => ({
            type: 'line',
            data: series.data,
            label: series.label,
            showMark: series.showMark,
            area: series.area,
            id: series.id,
            color: series.color,
            stroke: series.color,
            strokeWidth: 2,
          }))}
        slotProps={{ legend: { hidden: true } }}
        sx={{
          '& .MuiAreaElement-series-Ingresos': { fill: "url('#myGradient1')", strokeWidth: 2, opacity: 0.8 },
          '& .MuiAreaElement-series-Egresos': { fill: "url('#myGradient2')", strokeWidth: 2, opacity: 0.8 },
          '& .MuiChartsAxis-directionX .MuiChartsAxis-tick': { stroke: line },
        }}
      >
        <defs>
          <linearGradient id="myGradient1" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={alpha(theme.palette.primary.main, 0.4)} />
            <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
          </linearGradient>
          <linearGradient id="myGradient2" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={alpha(theme.palette.primary[700]!, 0.4)} />
            <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
          </linearGradient>
        </defs>
      </LineChart>
      <Legend items={visibleSeries} onToggle={toggleVisibility} />
    </>
  );
}
