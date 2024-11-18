import { Box, Grid, Typography } from '@mui/material';

interface PatientHeaderProps {
  nombrePaciente: string;
  nombreCuarto: string;
  medico: string;
  edad: number;
  genero: string;
  motivoIngreso: string;
  tipoSangre: string;
  alergias: string;
  comentarios: string;
  diagnosticoIngreso: string;
}

export const PatientHeader = ({
  nombrePaciente,
  medico,
  edad,
  genero,
  motivoIngreso,
  tipoSangre,
  alergias,
  diagnosticoIngreso,
}: PatientHeaderProps) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h3" gutterBottom>
        Kardex Médico
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Paciente
          </Typography>
          <Typography>{nombrePaciente}</Typography>

          <Box sx={{ mt: 2 }}>
            <Typography component="span" fontWeight="bold">
              Edad:{' '}
            </Typography>
            <Typography component="span">{edad} años</Typography>
          </Box>

          <Box>
            <Typography component="span" fontWeight="bold">
              Sexo:{' '}
            </Typography>
            <Typography component="span">{genero}</Typography>
          </Box>

          <Box>
            <Typography component="span" fontWeight="bold">
              Tipo de sangre:{' '}
            </Typography>
            <Typography component="span">{tipoSangre || 'No especificado'}</Typography>
          </Box>

          <Box>
            <Typography component="span" fontWeight="bold">
              Alergias:{' '}
            </Typography>
            <Typography component="span">{alergias || 'No manifestadas'}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Médico tratante
          </Typography>
          <Typography>{medico}</Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Motivo de ingreso
            </Typography>
            <Typography>{motivoIngreso || 'No especificado'}</Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Diagnóstico
            </Typography>
            <Typography>{diagnosticoIngreso || 'No especificado'}</Typography>
          </Box>
        </Grid>

        {/* <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Antecedentes
          </Typography>
          <Typography></Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Observaciones de ingreso
          </Typography>
          <Typography></Typography>
        </Grid> */}
      </Grid>
    </Box>
  );
};
