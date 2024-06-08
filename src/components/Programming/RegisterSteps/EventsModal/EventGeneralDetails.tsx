import { Box, Divider, Grid, Typography } from '@mui/material';
import { IEventDetails, Procedimiento } from '../../../../types/admissionTypes';
import dayjs from 'dayjs';

const titleStyle = {
  fontWeight: 500,
  fontSize: 15,
};

const bodyStyle = {
  fontWeight: 400,
  fontSize: 14,
};

const gridStyle = {
  display: 'flex',
  columnGap: 1,
  alignItems: 'center',
};

interface EventGeneralDetailsProps {
  eventDetails: IEventDetails;
}

interface ProcedureDetailsProps {
  procedureDetails: Procedimiento;
}

export const EventGeneralDetails = (props: EventGeneralDetailsProps) => {
  const { eventDetails } = props;
  const cuarto = eventDetails.cuarto;
  return (
    <Box sx={{ rowGap: 4, display: 'flex', flexDirection: 'column' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography sx={{ fontSize: 20, fontWeight: 500 }}>Información del cuarto</Typography>
          <Divider />
        </Grid>
        <Grid item xs={12} md={6} sx={gridStyle}>
          <Typography sx={titleStyle}>Cuarto:</Typography>
          <Typography sx={bodyStyle}>{cuarto.nombre}</Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={gridStyle}>
          <Typography sx={titleStyle}>Area:</Typography>
          <Typography sx={bodyStyle}>{cuarto.tipoCuarto}</Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={gridStyle}>
          <Typography sx={titleStyle}>Hora Entrada:</Typography>
          <Typography sx={bodyStyle}>{dayjs(eventDetails.horaInicio).format('DD/MM/YYYY HH:mm')}</Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={gridStyle}>
          <Typography sx={titleStyle}>Hora Salida:</Typography>
          <Typography sx={bodyStyle}>{dayjs(eventDetails.horaFin).format('DD/MM/YYYY HH:mm')}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography sx={{ fontSize: 20, fontWeight: 500 }}>Información de los procedimientos</Typography>
          <Divider />
        </Grid>
        {eventDetails.procedimiento.map((p) => (
          <ProcedureDetails key={p.id} procedureDetails={p} />
        ))}
      </Grid>
    </Box>
  );
};

const ProcedureDetails = (props: ProcedureDetailsProps) => {
  const { procedureDetails } = props;
  return (
    <Grid item container xs={12} md={6} sx={{ display: 'flex', flexDirection: 'row' }} spacing={2}>
      <Grid item xs={12} sx={gridStyle}>
        <Typography sx={titleStyle}>Procedimiento: </Typography>
        <Typography sx={bodyStyle}>{procedureDetails.nombre}</Typography>
      </Grid>
      <Grid item xs={12} sx={gridStyle}>
        <Typography sx={titleStyle}>Duración Hospitalización: </Typography>
        <Typography sx={bodyStyle}>{procedureDetails.duracionHospitalizacion}</Typography>
      </Grid>
      <Grid item xs={12} sx={gridStyle}>
        <Typography sx={titleStyle}>Duración Crujía: </Typography>
        <Typography sx={bodyStyle}>{procedureDetails.duracionCirujia}</Typography>
      </Grid>
    </Grid>
  );
};
