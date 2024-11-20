import { MenuItem, SxProps, TextField, Theme } from '@mui/material';
import { useEffect, useState } from 'react';

interface SelectComponentProps {
  sx?: SxProps<Theme>;
  value?: string | null;
  property?: string;
  label?: string;
  options: any[] | undefined | null;
  size?: 'small';
  onChange?: (value: any) => void;
}

export const SelectComponent = (props: SelectComponentProps) => {
  const { value, label, options, size, onChange, property } = props;
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

  return (
    <TextField
      sx={props.sx}
      select
      label={label}
      size={size}
      value={options?.length ? selected || '' : ''}
      onChange={handleChange}
    >
      {(options?.length ? options : []).map((item) => (
        <MenuItem key={property ? item[property] : item} value={property ? item[property] : item}>
          {item.nombre}
        </MenuItem>
      ))}
    </TextField>
  );
};
