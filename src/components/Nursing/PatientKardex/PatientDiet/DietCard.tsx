import { BaseKardexCard } from '../BaseKardexCard';
import { IPatientDiet } from '../../../../types/nursing/patientDietTypes';
import { Box, Typography, Chip, Button } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EditIcon from '@mui/icons-material/Edit';

export const DietCard = ({
  data,
  expanded,
  onExpandClick,
}: {
  data: IPatientDiet;
  expanded: string | false;
  onExpandClick: (id: string) => void;
}) => {
  return (
    <BaseKardexCard<IPatientDiet>
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
            Dieta del{' '}
            {new Date(data.fechaDietaPaciente).toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </Typography>
          {data.dieta && (
            <Chip
              size="small"
              icon={<RestaurantIcon />}
              label={data.dieta}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                ml: { sm: 'auto' },
              }}
            />
          )}
        </Box>
      )}
      renderContent={(data) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Tipo de Dieta
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.default',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <RestaurantIcon color="primary" />
              <Typography>{data.dieta || 'No se ha especificado una dieta'}</Typography>
            </Box>
          </Box>

          {data.dietaObservaciones && (
            <Box>
              <Typography variant="h6" color="primary" gutterBottom>
                Observaciones de la Dieta
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'background.default',
                }}
              >
                <Typography>{data.dietaObservaciones}</Typography>
              </Box>
            </Box>
          )}

          {!data.dieta && !data.dietaObservaciones && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                textAlign: 'center',
                fontStyle: 'italic',
                mt: 2,
              }}
            >
              No hay información de dieta registrada
            </Typography>
          )}
        </Box>
      )}
      renderActions={(data) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<EditIcon />}
          onClick={(e) => {
            e.stopPropagation();
            // Tu función para editar la dieta
          }}
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.3)',
            },
          }}
        >
          Editar Dieta
        </Button>
      )}
    />
  );
};
