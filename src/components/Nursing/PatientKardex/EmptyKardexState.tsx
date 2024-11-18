import { Button, Paper, Typography, SvgIconProps } from '@mui/material';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export interface EmptyKardexStateProps {
  onCreateClick: () => void;
  type?: 'kardex' | 'vitalsigns' | 'diet';
  message?: string;
  description?: string;
  buttonText?: string;
  CustomIcon?: React.ComponentType<SvgIconProps>;
}

export const EmptyKardexState = ({
  onCreateClick,
  type = 'kardex',
  message,
  description,
  buttonText,
  CustomIcon,
}: EmptyKardexStateProps) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'vitalsigns':
        return {
          icon: MonitorHeartIcon,
          message: 'No hay registros de signos vitales',
          description: 'Este paciente aún no tiene registros de signos vitales.',
          buttonText: 'Registrar Signos Vitales',
        };
      case 'diet':
        return {
          icon: RestaurantIcon,
          message: 'No hay dietas registradas',
          description: 'Este paciente aún no tiene dietas registradas.',
          buttonText: 'Agregar Dieta',
        };
      default:
        return {
          icon: AssignmentLateIcon,
          message: 'No hay kardex registrados',
          description: 'Este paciente aún no tiene ningún kardex registrado.',
          buttonText: 'Crear Primer Kardex',
        };
    }
  };

  const defaultContent = getDefaultContent();
  const Icon = CustomIcon || defaultContent.icon;

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
      <Icon
        sx={{
          fontSize: { xs: 50, sm: 80 },
          color: 'grey.400',
          mb: { xs: 1, sm: 2 },
        }}
      />
      <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
        {message || defaultContent.message}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mb: { xs: 3, sm: 4 },
          px: { xs: 2, sm: 4 },
        }}
      >
        {description || defaultContent.description}
      </Typography>
      <Button variant="contained" startIcon={<NoteAddIcon />} onClick={onCreateClick} size="large">
        {buttonText || defaultContent.buttonText}
      </Button>
    </Paper>
  );
};
