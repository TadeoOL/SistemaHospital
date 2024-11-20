import { InputLabel, Select, Stack } from '@mui/material';
import { FormControl, MenuItem, SxProps, Theme } from '@mui/material';
import { useEffect, useState } from 'react';

interface SelectComponentProps {
  sx?: SxProps<Theme>;
  value?: string | null;
  uniqueProperty?: string;
  displayProperty?: string;
  label?: string;
  options: any[] | undefined | null;
  onChange?: (value: any) => void;
}

export const SelectBasic = (props: SelectComponentProps) => {
  const { value, label, options, sx, onChange, uniqueProperty, displayProperty } = props;
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (value) {
      setSelected(value || '');
    }
  }, []);

  const handleChange = (e: any) => {
    const value = e?.target?.value || null;
    setSelected(value || '');
    onChange && onChange(value);
  };

  const getUniqueProperty = (item: any) => {
    return uniqueProperty ? item[uniqueProperty] : item;
  };

  const getDisplayProperty = (item: any) => {
    return displayProperty ? item[displayProperty] : item;
  };

  return (
    <Stack sx={{ ...sx, px: 1 }}>
      <>
        <InputLabel>{label}</InputLabel>
        <FormControl fullWidth>
          <Select
            sx={{
              height: '40px',
            }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={options?.length ? selected || '' : ''}
            placeholder="Age"
            onChange={handleChange}
          >
            {(options?.length ? options : []).map((item) => (
              <MenuItem key={getUniqueProperty(item)} value={getUniqueProperty(item)}>
                {getDisplayProperty(item)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    </Stack>
  );
};
