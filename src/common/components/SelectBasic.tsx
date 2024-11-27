import { Box, InputLabel, Stack, TextField } from '@mui/material';
import { MenuItem, SxProps, Theme } from '@mui/material';
import { forwardRef } from 'react';

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

  const getUniqueProperty = (item: any) => {
    if (!uniqueProperty) return item;
    if (!item) return '';

    const result = item[uniqueProperty] || item;

    if (result === undefined) {
      console.error(`property ${uniqueProperty} not found in item:`, item);
    }

    return result;
  };

  const selected = (() => {
    if (!options?.length || !value) {
      return '';
    }

    const valueUnique = getUniqueProperty(value);

    const found = options.find((item) => {
      return getUniqueProperty(item) === valueUnique;
    });

    if (!found) {
      console.error(`value ${valueUnique} not found in options:`, options);
      return '';
    }

    return valueUnique;
  })();

  const handleChange = (e: any): any => {
    onChange && onChange(e);
  };

  const getDisplayProperty = (item: any) => {
    return displayProperty ? item[displayProperty] : item;
  };

  return (
    <Stack sx={{ ...sx }}>
      <>
        <Stack spacing={1}>
          <InputLabel>{label}</InputLabel>
          <TextField
            ref={ref as any}
            name={name}
            error={error}
            select
            sx={{
              backgroundColor: 'white',
              '& .MuiSelect-select span::before': {
                content: `"${placeholder || ''}"`,
              },
            }}
            value={selected}
            onChange={handleChange}
            {...other}
          >
            {(options?.length ? options : []).map((item) => (
              <MenuItem key={getUniqueProperty(item)} value={getUniqueProperty(item)}>
                {getDisplayProperty(item)}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
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
