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
  onChange?: (event: PointerEvent) => void;
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
    name,
    ...other
  } = props;
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (!options?.length) return;

    const valueUnique = getUniqueProperty(value);

    const found = options.find((item) => {
      return getUniqueProperty(item) === valueUnique;
    });

    if (!found) return;

    setSelected(valueUnique);
  }, [value]);

  const handleChange = (e: any) => {
    onChange && onChange(e);
    const value = e?.target?.value || null;
    setSelected(value || '');
  };

  const getUniqueProperty = (item: any) => {
    if (!uniqueProperty) return item;
    if (!item) return '';

    const result = item[uniqueProperty] || item;

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
            name={name}
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
