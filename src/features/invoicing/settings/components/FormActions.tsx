import { Button, CardActions } from '@mui/material';

export const FormActions = () => {
  return (
    <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: 1, borderColor: 'divider' }}>
      <Button variant="contained" type="submit">
        Guardar
      </Button>
    </CardActions>
  );
};
