import { useState } from 'react';

import { alpha, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { BarChart, HighlightItemData } from '@mui/x-charts';

export default function AcquisitionChart() {
  const theme = useTheme();

  const initialSeries = [
    {
      id: 'Direct',
      label: 'Direct',
      data: [21, 17, 15, 13, 15, 13, 16, 13, 8, 14, 11, 9, 7, 5, 3, 3, 7],
      color: theme.palette.grey[900],
    },
    {
      id: 'Referral',
      label: 'Referral',
      data: [28, 30, 20, 26, 18, 27, 22, 28, 20, 21, 15, 14, 12, 10, 8, 18, 16],
      color: theme.palette.primary.main,
    },
    {
      id: 'Social',
      label: 'Social',
      data: [50, 51, 60, 54, 53, 48, 55, 40, 44, 42, 44, 44, 42, 40, 42, 32, 16],
      color: theme.palette.primary[200],
    },
  ];

  const [seriesVisibility, setSeriesVisibility] = useState<{ [key: string]: boolean }>({
    Direct: true,
    Referral: true,
    Social: true,
  });

  const toggleSeriesVisibility = (seriesLabel: string) => {
    setSeriesVisibility((prevVisibility) => ({
      ...prevVisibility,
      [seriesLabel]: !prevVisibility[seriesLabel],
    }));
  };

  const [highlightedItem, setHighLightedItem] = useState<HighlightItemData | null>(null);

  const handleHighLightedSeries = (newHighLightedSeries: string) => {
    if (newHighLightedSeries !== null) {
      setHighLightedItem((prev) => ({
        ...prev,
        seriesId: newHighLightedSeries,
      }));
    }
  };

  return (
    <>
      <BarChart
        height={230}
        series={
          initialSeries
            .map((series) => ({
              ...series,
              type: 'bar',
              stack: '1',
              color: alpha(series.color!, 0.85),
              visible: seriesVisibility[series.label],
              highlightScope: { highlighted: 'series', faded: 'global' },
            }))
            .filter((series) => series.visible) as any
        }
        highlightedItem={highlightedItem}
        leftAxis={null}
        bottomAxis={null}
        slotProps={{ legend: { hidden: true } }}
        axisHighlight={{ x: 'none' }}
        tooltip={{ trigger: 'item' }}
        margin={{ left: 20, right: 20, top: 30, bottom: 15 }}
        sx={{ '& .MuiBarElement-root:hover': { opacity: 0.6 } }}
      />
      <Stack
        direction="row"
        justifyContent="space-around"
        sx={{ width: 1, maxWidth: 250, ml: 2, mb: 2 }}
        alignItems="center"
      >
        {initialSeries.map((series) => (
          <Stack
            key={series.label}
            alignItems="center"
            direction="row"
            spacing={1}
            onClick={() => toggleSeriesVisibility(series.label)}
            onMouseEnter={() => handleHighLightedSeries(series.id)}
            onMouseLeave={() => setHighLightedItem(null)}
            sx={{ opacity: seriesVisibility[series.label] ? 1 : 0.45, cursor: 'pointer' }}
          >
            <Box sx={{ height: 10, width: 10, borderRadius: '50%', backgroundColor: series.color }} />
            <Typography>{series.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </>
  );
}
