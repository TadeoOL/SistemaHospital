import { Box, Typography } from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

interface PatientHeaderProps {
  nombrePaciente: string;
  nombreCuarto: string;
  medico: string;
}

export const PatientHeader = ({ nombrePaciente, nombreCuarto, medico }: PatientHeaderProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2,
      }}
    >
      <AssignmentIndIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1rem', sm: '1.25rem' },
          }}
        >
          {nombrePaciente || ''}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 0.5, sm: 1 },
          }}
        >
          <Typography>Habitación: {nombreCuarto || ''}</Typography>
          <Typography sx={{ display: { xs: 'none', sm: 'inline' } }}>•</Typography>
          <Typography>Médico: {medico || ''}</Typography>
        </Typography>
      </Box>
    </Box>
  );
};
