import { Divider, Grid, Typography } from '@mui/material';
import { HistorialClinico } from '../../../../types/admissionTypes';

const titleStyle = { fontSize: 15, fontWeight: 500 };
const bodyStyle = { fontSize: 14, fontWeight: 400 };
const gridStyle = {
  display: 'flex',
  columnGap: 1,
  alignItems: 'center',
};

interface EventClinicalHistoryDetailsProps {
  clinicalHistory: HistorialClinico;
}
export const EventClinicalHistoryDetails = (props: EventClinicalHistoryDetailsProps) => {
  const { clinicalHistory } = props;
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography sx={{ mt: 1, fontSize: 20, fontWeight: 500 }}>Información Clínica</Typography>
        <Divider sx={{ my: 1 }} />
      </Grid>
      <Grid sx={gridStyle} item xs={12} md={6}>
        <Typography sx={titleStyle}>Motivo Ingreso:</Typography>
        <Typography sx={bodyStyle}>{clinicalHistory.motivoIngreso}</Typography>
      </Grid>
      <Grid sx={gridStyle} item xs={12} md={6}>
        <Typography sx={titleStyle}>Diagnostico Ingreso:</Typography>
        <Typography sx={bodyStyle}>{clinicalHistory.diagnosticoIngreso}</Typography>
      </Grid>
      <Grid sx={gridStyle} item xs={12} md={6}>
        <Typography sx={titleStyle}>Alergias:</Typography>
        <Typography sx={bodyStyle}>{clinicalHistory.alergias}</Typography>
      </Grid>
      <Grid sx={gridStyle} item xs={12} md={6}>
        <Typography sx={titleStyle}>Tipo de sangre:</Typography>
        <Typography sx={bodyStyle}>{clinicalHistory.tipoSangre}</Typography>
      </Grid>
      <Grid sx={gridStyle} item xs={12}>
        <Typography sx={titleStyle}>Comentarios:</Typography>
        <Typography sx={bodyStyle}>{clinicalHistory.comentarios}</Typography>
      </Grid>
    </Grid>
  );
};
