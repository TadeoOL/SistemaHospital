// material-ui
import { useTheme } from '@mui/material/styles';

import { BarChart } from '@mui/x-charts/BarChart';

const xLabels = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

// ==============================|| MONTHLY BAR CHART ||============================== //

export default function MonthlyBarChart({ data }: { data: number[] }) {
  const theme = useTheme();
  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <BarChart
      height={380}
      series={[{ data, label: 'Series-1' }]}
      xAxis={[
        { data: xLabels, scaleType: 'band', disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle },
      ]}
      leftAxis={null}
      slotProps={{ legend: { hidden: true }, bar: { rx: 5, ry: 5 } }}
      axisHighlight={{ x: 'none' }}
      margin={{ left: 20, right: 20 }}
      colors={[theme.palette.info.light]}
      sx={{ '& .MuiBarElement-root:hover': { opacity: 0.6 } }}
    />
  );
}
