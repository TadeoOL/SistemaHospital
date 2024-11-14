import {
  Card,
  CardHeader,
  CardContent,
  Collapse,
  IconButton,
  Typography,
  Box,
  Chip,
  Paper,
  Button,
  Modal,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AddIcon from '@mui/icons-material/Add';
import { IPatientKardex } from '../../../types/nursing/nursingTypes';
import { useState } from 'react';
import { AddMedicationsFormData, AddMedicationsModal } from './AddMedicationsModal';
import { usePutMedications } from '../../../hooks/nursing/usePutMedications';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { usePutServices } from '../../../hooks/nursing/usePutServices';
import { AddServicesFormData, AddServicesModal } from './AddServicesModal';

interface KardexCardProps {
  kardex: IPatientKardex;
  expanded: string | false;
  onExpandClick: (id: string) => void;
}

export const KardexCard = ({ kardex, expanded, onExpandClick }: KardexCardProps) => {
  const { id: id_IngresoPaciente } = useParams();
  const [openAddMedicamentos, setOpenAddMedicamentos] = useState(false);
  const [openAddServices, setOpenAddServices] = useState(false);
  const { mutate: putMedications } = usePutMedications(id_IngresoPaciente || '');
  const { mutate: putServices } = usePutServices(id_IngresoPaciente || '');

  const handleAddMedicamentos = async (data: AddMedicationsFormData) => {
    putMedications(
      { kardexId: kardex.id, data },
      {
        onSuccess: () => {
          setOpenAddMedicamentos(false);
          toast.success('Medicamentos agregados correctamente');
        },
        onError: () => {
          toast.error('Error al agregar medicamentos');
        },
      }
    );
  };

  const handleAddServices = async (data: AddServicesFormData) => {
    putServices(
      { kardexId: kardex.id, data },
      {
        onSuccess: () => {
          setOpenAddServices(false);
          toast.success('Servicios agregados correctamente');
        },
        onError: () => {
          toast.error('Error al agregar servicios');
        },
      }
    );
  };

  return (
    <Card elevation={3}>
      <CardHeader
        sx={{
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          p: { xs: 1.5, sm: 3 },
          '& .MuiCardHeader-content': {
            width: '100%',
          },
          '& .MuiCardHeader-action': {
            m: 0,
            alignSelf: 'center',
          },
        }}
        title={
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: { xs: 1, sm: 2 },
              width: '100%',
              '@media (max-width: 855px)': {
                flexDirection: 'column',
              },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '0.875rem', sm: '1.25rem' },
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                flexShrink: 0,
              }}
            >
              Kardex del{' '}
              {new Date(kardex.fechaKardex).toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              <Typography
                component="span"
                sx={{
                  display: { xs: 'block', sm: 'inline' },
                  fontSize: { xs: '0.75rem', sm: '1rem' },
                  ml: { xs: 0, sm: 1 },
                  opacity: 0.9,
                  fontWeight: 'normal',
                  color: 'rgba(255, 255, 255, 0.9)',
                  mt: { xs: 0.5, sm: 0 },
                }}
              >
                {new Date(kardex.fechaKardex)
                  .toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                  .toLowerCase()}
              </Typography>
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                ml: { xs: 0, sm: 'auto' },
                maxWidth: '100%',
                '@media (max-width: 400px)': {
                  width: '100%',
                  justifyContent: 'flex-start',
                },
              }}
            >
              <Chip
                size="small"
                sx={{
                  height: { xs: '24px', sm: '32px' },
                  '& .MuiChip-label': {
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    px: { xs: 1, sm: 2 },
                  },
                  '& .MuiChip-icon': {
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    ml: { xs: 0.5, sm: 1 },
                  },
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: 'primary.main',
                }}
                label={`${kardex.medicamentos.length} med`}
                icon={<MedicationIcon />}
              />
              <Chip
                size="small"
                sx={{
                  height: { xs: '24px', sm: '32px' },
                  '& .MuiChip-label': {
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    px: { xs: 1, sm: 2 },
                  },
                  '& .MuiChip-icon': {
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    ml: { xs: 0.5, sm: 1 },
                  },
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: 'primary.main',
                }}
                label={`${kardex.servicios.length} serv`}
                icon={<LocalHospitalIcon />}
              />
            </Box>
          </Box>
        }
        action={
          <IconButton
            onClick={() => onExpandClick(kardex.id)}
            sx={{
              transform: expanded === kardex.id ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
              p: { xs: 0.5, sm: 1 },
              ml: { xs: 0.5, sm: 1 },
            }}
          >
            <ExpandMoreIcon
              sx={{
                fontSize: { xs: '1.25rem', sm: '2rem' },
                color: 'primary.contrastText',
              }}
            />
          </IconButton>
        }
      />
      <Collapse in={expanded === kardex.id}>
        <CardContent
          sx={{
            pt: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Indicaciones Médicas
              </Typography>
              <Typography>{kardex.indicacionesMedicas || 'Sin indicaciones médicas'}</Typography>
            </Paper>

            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography
                variant="h6"
                color="primary"
                sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                <RestaurantIcon /> Dieta
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {kardex.dieta || 'No especificada'}
              </Typography>
              {kardex.dietaObservaciones && (
                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                  Observaciones: {kardex.dietaObservaciones}
                </Typography>
              )}
            </Paper>

            <Paper elevation={1} sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                  }}
                >
                  <MedicationIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                  Medicamentos
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                  onClick={() => setOpenAddMedicamentos(true)}
                  sx={{
                    fontSize: '0.75rem',
                    py: 0.5,
                    px: 1,
                    minWidth: 0,
                    height: '24px',
                    borderRadius: 1,
                    '& .MuiButton-startIcon': {
                      mr: 0.5,
                      marginLeft: '-2px',
                    },
                  }}
                >
                  Agregar
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {kardex.medicamentos.map((med) => (
                  <Box
                    key={med.id_Articulo}
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: 'background.default',
                    }}
                  >
                    <Typography variant="subtitle1" color="primary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {med.nombreMedicamento}
                    </Typography>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          sm: 'repeat(2, 1fr)',
                          md: 'repeat(4, 1fr)',
                        },
                        gap: 1,
                        mt: 1,
                        '& .MuiChip-root': {
                          width: '100%',
                          justifyContent: 'flex-start',
                          '& .MuiChip-label': {
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          },
                        },
                      }}
                    >
                      <Chip size="small" label={`Dosis: ${med.dosis}`} />
                      <Chip size="small" label={`Vía: ${med.via}`} />
                      <Chip size="small" label={`Frecuencia: ${med.frecuencia}`} />
                      <Chip size="small" label={`Horario: ${med.horario}`} />
                    </Box>
                  </Box>
                ))}
                {kardex.medicamentos.length === 0 && (
                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                    No hay medicamentos registrados
                  </Typography>
                )}
              </Box>
            </Paper>

            <Paper elevation={1} sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                  }}
                >
                  <LocalHospitalIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                  Servicios
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                  onClick={() => setOpenAddServices(true)}
                  sx={{
                    fontSize: '0.75rem',
                    py: 0.5,
                    px: 1,
                    minWidth: 0,
                    height: '24px',
                    borderRadius: 1,
                    '& .MuiButton-startIcon': {
                      mr: 0.5,
                      marginLeft: '-2px',
                    },
                  }}
                >
                  Agregar
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {kardex.servicios.map((serv) => (
                  <Box
                    key={serv.id_Servicio}
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: 'background.default',
                    }}
                  >
                    <Typography variant="subtitle1" color="primary">
                      {serv.nombreServicio}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {serv.indicaciones}
                    </Typography>
                  </Box>
                ))}
                {kardex.servicios.length === 0 && (
                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                    No hay servicios registrados
                  </Typography>
                )}
              </Box>
            </Paper>

            {kardex.observaciones && (
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Observaciones Generales
                </Typography>
                <Typography>{kardex.observaciones}</Typography>
              </Paper>
            )}
          </Box>
        </CardContent>
      </Collapse>

      <Modal open={openAddMedicamentos} onClose={() => setOpenAddMedicamentos(false)}>
        <>
          <AddMedicationsModal
            open={openAddMedicamentos}
            onClose={() => setOpenAddMedicamentos(false)}
            onSubmit={handleAddMedicamentos}
            kardexId={kardex.id}
          />
        </>
      </Modal>
      <Modal open={openAddServices} onClose={() => setOpenAddServices(false)}>
        <>
          <AddServicesModal
            open={openAddServices}
            onClose={() => setOpenAddServices(false)}
            onSubmit={handleAddServices}
            kardexId={kardex.id}
          />
        </>
      </Modal>
    </Card>
  );
};
