import { Box, Button, Popover } from '@mui/material';
import { DateTimePicker, LocalizationProvider, PickersLocaleText } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useState } from 'react';

const localeCustomText: Partial<PickersLocaleText<any>> = {
  okButtonLabel: 'Aceptar',
  cancelButtonLabel: 'Cancelar',
  todayButtonLabel: 'Hoy',
};
interface DateExitPopoverProps {
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  onAccept: (date: Date) => void;
  title: string;
  value?: dayjs.Dayjs;
}

export const DateExitPopover = ({ open, anchorEl, onClose, onAccept, title, value }: DateExitPopoverProps) => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(value || null);

  const handleAccept = () => {
    if (selectedDate) {
      onAccept(selectedDate.toDate());
    }
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      onClick={(e) => e.stopPropagation()}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={localeCustomText}>
          <DateTimePicker
            label={title}
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            format="DD/MM/YYYY HH:mm"
            ampm={false}
            slotProps={{
              actionBar: {
                actions: ['cancel', 'accept', 'today'],
              },
            }}
          />
        </LocalizationProvider>
        <Button variant="contained" onClick={handleAccept} fullWidth size="small" sx={{ mt: 1 }}>
          Aceptar
        </Button>
      </Box>
    </Popover>
  );
};
