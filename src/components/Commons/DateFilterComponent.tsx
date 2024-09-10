import { Box, Divider, SxProps, Theme } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
interface DateFilterComponentProps {
  setStartDate: Function;
  setEndDate: Function;
  startDate: string;
  endDate: string;
  sx?: SxProps<Theme>;
}
export const DateFilterComponent = ({ setEndDate, setStartDate, startDate, endDate, sx }: DateFilterComponentProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1, ...sx }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'es-mx'}>
        <DatePicker
          onChange={(e) => setStartDate(e?.toISOString())}
          label="Fecha inicio"
          value={startDate ? dayjs(startDate) : null}
        />
      </LocalizationProvider>
      <Divider flexItem orientation="vertical" />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'es-mx'}>
        <DatePicker
          onChange={(e) => setEndDate(e?.toISOString())}
          label="Fecha fin"
          value={endDate ? dayjs(endDate) : null}
        />
      </LocalizationProvider>
    </Box>
  );
};
