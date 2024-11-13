import { Box, Typography } from '@mui/material';
import { IClinicalDataHospitalRoom } from '../../../../../../types/hospitalization/hospitalRoomTypes';

interface Props {
  clinicalData?: IClinicalDataHospitalRoom;
}

export const ClinicalDataTab = ({ clinicalData }: Props) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: 'white' }}>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Motivo de Ingreso
        </Typography>
        <Typography variant="body1">{clinicalData?.motivoIngreso || 'Sin información'}</Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Diagnóstico Ingreso
        </Typography>
        <Typography variant="body1">{clinicalData?.diagnostico || 'Sin información'}</Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Alergias
        </Typography>
        <Typography variant="body1">{clinicalData?.alergias || 'Sin información'}</Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Tipo de Sangre
        </Typography>
        <Typography variant="body1">{clinicalData?.tipoSangre || 'Sin información'}</Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Comentarios
        </Typography>
        <Typography variant="body1">{clinicalData?.comentarios || 'Sin información'}</Typography>
      </Box>
    </Box>
  );
};
