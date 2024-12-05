import { Grid, Typography, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { FormFieldProps } from '../types/invoicing.settings.types';
export const FormField = ({ name, control, label, type = 'text', disabled = false, sx }: FormFieldProps) => (
  <Grid item xs={12} md={6}>
    <Typography variant="subtitle2" gutterBottom>
      {label}
    </Typography>
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type={type}
          fullWidth
          value={type === 'number' ? Number(field.value) || '' : field.value || ''}
          onChange={(e) => {
            const value = e.target.value;
            if (type === 'number') {
              field.onChange(value ? Number(value) : null);
            } else {
              field.onChange(value);
            }
          }}
          error={!!error}
          helperText={error?.message}
          disabled={disabled}
          sx={sx}
        />
      )}
    />
  </Grid>
);
