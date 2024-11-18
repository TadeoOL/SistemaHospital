import { BaseKardexCard } from '../BaseKardexCard';
import { IPatientKardex } from '../../../../types/nursing/nursingTypes';
import {
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

export const MedicalInstructionsCard = ({
  data,
  expanded,
  onExpandClick,
}: {
  data: IPatientKardex;
  expanded: string | false;
  onExpandClick: (id: string) => void;
}) => {
  return (
    <BaseKardexCard<IPatientKardex>
      data={data}
      expanded={expanded}
      onExpandClick={onExpandClick}
      id={data.id}
      renderHeader={(data) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 1, sm: 2 },
            width: '100%',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '0.875rem', sm: '1.25rem' },
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
            }}
          >
            Instrucciones Médicas del{' '}
            {new Date(data.fechaKardex).toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, ml: { sm: 'auto' } }}>
            <Chip
              size="small"
              icon={<MedicationIcon />}
              label={`${data.medicamentos.length} medicamentos`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
            />
            <Chip
              size="small"
              icon={<LocalHospitalIcon />}
              label={`${data.servicios.length} servicios`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
            />
          </Box>
        </Box>
      )}
      renderContent={(data) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {data.indicacionesMedicas && (
            <Box>
              <Typography variant="h6" color="primary" gutterBottom>
                Indicaciones Médicas
              </Typography>
              <Typography>{data.indicacionesMedicas}</Typography>
            </Box>
          )}

          {data.medicamentos.length > 0 && (
            <Box>
              <Typography variant="h6" color="primary" gutterBottom>
                Medicamentos
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Medicamento</TableCell>
                      <TableCell>Dosis</TableCell>
                      <TableCell>Vía</TableCell>
                      <TableCell>Frecuencia</TableCell>
                      <TableCell>Horario</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.medicamentos.map((med) => (
                      <TableRow key={med.id_Articulo}>
                        <TableCell>{med.nombreMedicamento}</TableCell>
                        <TableCell>{med.dosis}</TableCell>
                        <TableCell>{med.via}</TableCell>
                        <TableCell>{med.frecuencia}</TableCell>
                        <TableCell>{med.horario}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {data.servicios.length > 0 && (
            <Box>
              <Typography variant="h6" color="primary" gutterBottom>
                Servicios
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Servicio</TableCell>
                      <TableCell>Indicaciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.servicios.map((serv) => (
                      <TableRow key={serv.id_Servicio}>
                        <TableCell>{serv.nombreServicio}</TableCell>
                        <TableCell>{serv.indicaciones}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {data.medicamentos.length === 0 && data.servicios.length === 0 && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                textAlign: 'center',
                fontStyle: 'italic',
                mt: 2,
              }}
            >
              No hay medicamentos ni servicios registrados
            </Typography>
          )}
        </Box>
      )}
    />
  );
};
