import { Box, InputLabel, Stack, TextField } from '@mui/material';
import { FormControl, MenuItem, SxProps, Theme } from '@mui/material';
import { forwardRef, useEffect, useState } from 'react';

interface SelectComponentProps {
  sx?: SxProps<Theme>;
  value?: string | null;
  uniqueProperty?: string;
  displayProperty?: string;
  label?: string;
  options: any[] | undefined | null;
  onChange?: (value: any) => void;
  placeholder?: string;
  large?: boolean;
  [key: string]: any;
}

export const SelectBasic = forwardRef((props: SelectComponentProps, ref) => {
  const {
    value,
    label,
    options,
    sx,
    onChange,
    uniqueProperty,
    displayProperty,
    placeholder,
    large,
    error,
    helperText,
    ...other
  } = props;
  const [selected, setSelected] = useState('');

  useEffect(() => {
    setSelected(value || '');
  }, [value]);

  const handleChange = (e: any) => {
    const value = e?.target?.value || null;
    setSelected(value || '');
    onChange && onChange(value);
  };

  const getUniqueProperty = (item: any) => {
    if (!uniqueProperty) return item;

    const result = item[uniqueProperty];

    if (result === undefined) {
      console.error(`property ${uniqueProperty} not found in item:`, item);
    }

    return result;
  };

  const getDisplayProperty = (item: any) => {
    return displayProperty ? item[displayProperty] : item;
  };

  return (
    <Stack sx={{ ...sx }}>
      <>
        <InputLabel>{label}</InputLabel>
        <FormControl fullWidth>
          <TextField
            ref={ref as any}
            error={error}
            select
            size={large ? undefined : 'small'}
            sx={{
              '& .MuiSelect-select span::before': {
                content: `"${placeholder || ''}"`,
              },
            }}
            value={options?.length ? selected || '' : ''}
            onChange={handleChange}
            {...other}
          >
            {(options?.length ? options : []).map((item) => (
              <MenuItem key={getUniqueProperty(item)} value={getUniqueProperty(item)}>
                {getDisplayProperty(item)}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
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
        </Box>
      </>
    </Stack>
  );
});
