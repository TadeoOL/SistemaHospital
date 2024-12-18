import { Box } from '@mui/material';
import { TextFieldProps } from '@mui/material';
import { InputLabel, Stack, TextField } from '@mui/material';
import { ChangeEvent, forwardRef, useState } from 'react';

type InputBasicProps = TextFieldProps & {
  hide?: boolean;
  label?: string;
  placeholder?: string;
  fullWidth?: boolean;
  helperText?: any;
  maxLength?: number;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: any;
  disabled?: boolean;
  value?: string;
  multiline?: boolean;
  [x: string]: any;
};

export const InputBasic = forwardRef((props: InputBasicProps, ref) => {
  const {
    hide,
    label,
    placeholder,
    fullWidth,
    helperText,
    maxLength,
    onChange,
    error,
    inputProps,
    disabled,
    ...other
  } = props;

  const [charLength, setCharLength] = useState(`0/${maxLength}`);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange && onChange(event);
    const value = event.target.value;
    if (maxLength) {
      const length = value?.trim().length || 0;
      setCharLength(`${length}/${maxLength}`);
    }
  };

  if (hide) return null;

  return (
    <>
      <Stack spacing={1}>
        <InputLabel>{label}</InputLabel>
        <TextField
          ref={ref as any}
          placeholder={placeholder || ''}
          fullWidth={fullWidth ?? true}
          variant="outlined"
          inputProps={{ maxLength, ...inputProps }}
          error={!!error}
          disabled={disabled}
          onChange={handleChange}
          {...other}
        />
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
        >
          <Box>
            {error && (
              <Box sx={{ color: 'error.main', fontSize: '0.75rem', fontWeight: 500 }}>
                {helperText === 'Required' ? 'Campo obligatorio' : helperText}
              </Box>
            )}
            {!error && <Box sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{helperText}</Box>}
          </Box>
          <Box>{maxLength && charLength}</Box>
        </Box>
      </Stack>
    </>
  );
});
