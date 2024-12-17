import React, { useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { es } from 'date-fns/locale';
import { TextField, Popover, Paper, Grid, Button } from '@mui/material';
import { format, addYears, addDays } from 'date-fns';

interface DateRangeSelectorProps {
  view: 'monthly' | 'weekly';
  onDateRangeChange: (viewType: 'monthly' | 'weekly', start?: Date, end?: Date) => void;
  dateRange: { start: Date; end: Date; weekly: boolean };
}

export default function DateRangeSelector({ view, onDateRangeChange, dateRange }: DateRangeSelectorProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tempDateRange, setTempDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setTempDateRange([dateRange.start, dateRange.end]);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleStartDateChange = (newValue: Date | null) => {
    if (newValue) {
      let endDate: Date;
      if (view === 'monthly') {
        endDate = addYears(newValue, 1);
        endDate.setMonth(0, 1);
      } else {
        endDate = addDays(newValue, 6);
      }
      setTempDateRange([newValue, endDate]);
    } else {
      setTempDateRange([null, null]);
    }
  };

  const handleApply = () => {
    if (tempDateRange[0] && tempDateRange[1]) {
      onDateRangeChange(view, tempDateRange[0], tempDateRange[1]);
      handleClosePopover();
    }
  };

  const handleClear = () => {
    const currentYear = new Date().getFullYear();
    const defaultStart = new Date(currentYear - 1, 0, 1);
    const defaultEnd = new Date(currentYear, 11, 31);

    setTempDateRange([null, null]);
    onDateRangeChange(view, defaultStart, defaultEnd);
    handleClosePopover();
  };

  const formatDateRange = () => {
    if (dateRange.start && dateRange.end) {
      const formatString = view === 'monthly' ? 'yyyy' : 'dd MMM yyyy';
      return `${format(dateRange.start, formatString)} - ${format(dateRange.end, formatString)}`;
    }
    return view === 'monthly' ? 'Seleccionar Años' : 'Seleccionar Fechas';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <div>
        <TextField
          label="Rango de Fechas"
          variant="outlined"
          size="small"
          value={formatDateRange()}
          onClick={handleOpenPopover}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Paper sx={{ p: 2, width: 300 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <DatePicker
                  label="Fecha Inicial"
                  value={tempDateRange[0]}
                  onChange={(newValue) => handleStartDateChange(newValue)}
                  views={view === 'monthly' ? ['year'] : ['month', 'day']}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  label="Fecha Final"
                  value={tempDateRange[1]}
                  onChange={(newValue) => setTempDateRange([tempDateRange[0], newValue])}
                  views={view === 'monthly' ? ['year'] : ['month', 'day']}
                  sx={{ width: '100%' }}
                  slotProps={{
                    textField: {
                      InputProps: {
                        readOnly: true,
                      },
                    },
                  }}
                  disableOpenPicker
                />
              </Grid>
              <Grid item xs={12} container spacing={1}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleApply}
                    disabled={!tempDateRange[0] || !tempDateRange[1]}
                    fullWidth
                  >
                    Aplicar
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="outlined" color="secondary" onClick={handleClear} fullWidth>
                    Limpiar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Popover>
      </div>
    </LocalizationProvider>
  );
}
