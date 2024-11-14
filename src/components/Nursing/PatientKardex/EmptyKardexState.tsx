import { Button, Paper, Typography } from '@mui/material';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

interface EmptyKardexStateProps {
  onCreateClick: () => void;
}

export const EmptyKardexState = ({ onCreateClick }: EmptyKardexStateProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        py: { xs: 4, sm: 8 },
        px: { xs: 2, sm: 4 },
        textAlign: 'center',
        bgcolor: 'background.paper',
        borderRadius: { xs: 2, sm: 4 },
        border: '2px dashed',
        borderColor: 'grey.300',
      }}
    >
      <AssignmentLateIcon
        sx={{
          fontSize: { xs: 50, sm: 80 },
          color: 'grey.400',
          mb: { xs: 1, sm: 2 },
        }}
      />
      <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
        No hay kardex registrados
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mb: { xs: 3, sm: 4 },
          px: { xs: 2, sm: 4 },
        }}
      >
        Este paciente aún no tiene ningún kardex registrado.
      </Typography>
      <Button variant="contained" startIcon={<NoteAddIcon />} onClick={onCreateClick} size="large">
        Crear Primer Kardex
      </Button>
    </Paper>
  );
};
