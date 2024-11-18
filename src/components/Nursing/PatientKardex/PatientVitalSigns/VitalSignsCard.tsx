import { BaseKardexCard } from '../BaseKardexCard';
import { IPatientVitalSigns } from '../../../../types/nursing/patientVitalSignsTypes';
import { Box, Typography, Grid, Chip } from '@mui/material';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import PsychologyIcon from '@mui/icons-material/Psychology';

export const VitalSignsCard = ({
  data,
  expanded,
  onExpandClick,
}: {
  data: IPatientVitalSigns;
  expanded: { [key: string]: boolean };
  onExpandClick: (id: string) => void;
}) => {
  return (
    <BaseKardexCard<IPatientVitalSigns>
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
            Signos Vitales del{' '}
            {new Date(data.fechaSignosPaciente).toLocaleDateString('es-ES', {
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
            {data.tensionArterial && (
              <Chip
                size="small"
                icon={<MonitorHeartIcon />}
                label={`${data.tensionArterial} mmHg`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
              />
            )}
            {data.temperaturaCorporal && (
              <Chip
                size="small"
                icon={<DeviceThermostatIcon />}
                label={`${data.temperaturaCorporal}°C`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
              />
            )}
          </Box>
        </Box>
      )}
      renderContent={(data) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Grid container spacing={3}>
            {data.tensionArterial && (
              <Grid item xs={12} sm={6} md={4}>
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
                  <MonitorHeartIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Tensión Arterial
                    </Typography>
                    <Typography variant="h6">{data.tensionArterial} mmHg</Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {data.frecuenciaRespiratoriaFrecuenciaCardiaca && (
              <Grid item xs={12} sm={6} md={4}>
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
                  <MonitorHeartIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Frecuencia Cardíaca
                    </Typography>
                    <Typography variant="h6">{data.frecuenciaRespiratoriaFrecuenciaCardiaca} lpm</Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {data.temperaturaCorporal && (
              <Grid item xs={12} sm={6} md={4}>
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
                  <DeviceThermostatIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Temperatura
                    </Typography>
                    <Typography variant="h6">{data.temperaturaCorporal}°C</Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {data.saturacionOxigeno && (
              <Grid item xs={12} sm={6} md={4}>
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
                  <MonitorHeartIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Saturación O₂
                    </Typography>
                    <Typography variant="h6">{data.saturacionOxigeno}%</Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {data.glicemia && (
              <Grid item xs={12} sm={6} md={4}>
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
                  <BloodtypeIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Glicemia
                    </Typography>
                    <Typography variant="h6">{data.glicemia} mg/dL</Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {data.estadoConciencia && (
              <Grid item xs={12} sm={6} md={4}>
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
                  <PsychologyIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Estado de Conciencia
                    </Typography>
                    <Typography variant="h6">{data.estadoConciencia}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {data.escalaDolor !== undefined && (
              <Grid item xs={12} sm={6} md={4}>
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
                  <PsychologyIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Escala de Dolor
                    </Typography>
                    <Typography variant="h6">{data.escalaDolor}/10</Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    />
  );
};
