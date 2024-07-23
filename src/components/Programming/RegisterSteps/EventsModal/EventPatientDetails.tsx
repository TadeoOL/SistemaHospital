import { Divider, Grid, Typography } from '@mui/material';
import { Paciente } from '../../../../types/admissionTypes';
const titleStyle = { fontSize: 15, fontWeight: 500 };
const bodyStyle = { fontSize: 14, fontWeight: 400 };
const gridStyle = {
  display: 'flex',
  columnGap: 1,
  alignItems: 'center',
};

interface EventPatientDetailsProps {
  patientData: Paciente;
}
export const EventPatientDetails = (props: EventPatientDetailsProps) => {
  const { patientData } = props;
  return (
    <Grid container spacing={4}>
      <Grid item container spacing={1}>
        <Grid item xs={12}>
          <Typography sx={{ mt: 1, fontSize: 20, fontWeight: 500 }}>Información General</Typography>
          <Divider sx={{ my: 1 }} />
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Nombre:</Typography>
          <Typography sx={bodyStyle}>{patientData.nombre}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Apellido Paterno:</Typography>
          <Typography sx={bodyStyle}>{patientData.apellidoPaterno}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Apellido Materno:</Typography>
          <Typography sx={bodyStyle}>{patientData.apellidoMaterno}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Genero:</Typography>
          <Typography sx={bodyStyle}>{patientData.genero}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Estado Civil:</Typography>
          <Typography sx={bodyStyle}>{patientData.estadoCivil}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Teléfono:</Typography>
          <Typography sx={bodyStyle}>{patientData.telefono}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Ocupación/Empleo:</Typography>
          <Typography sx={bodyStyle}>{patientData.ocupacion}</Typography>
        </Grid>
      </Grid>

      <Grid item container spacing={1}>
        <Grid item xs={12}>
          <Typography sx={{ mt: 1, fontSize: 20, fontWeight: 500 }}>Información de Domicilio</Typography>
          <Divider sx={{ my: 1 }} />
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Código Postal:</Typography>
          <Typography sx={bodyStyle}>{patientData.codigoPostal}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Colonia:</Typography>
          <Typography sx={bodyStyle}>{patientData.colonia}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Dirección:</Typography>
          <Typography sx={bodyStyle}>{patientData.direccion}</Typography>
        </Grid>
      </Grid>
      <Grid item container spacing={1}>
        <Grid item xs={12}>
          <Typography sx={{ mt: 1, fontSize: 20, fontWeight: 500 }}>Datos de contacto responsable</Typography>
          <Divider sx={{ my: 1 }} />
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Persona Responsable:</Typography>
          <Typography sx={bodyStyle}>{patientData.nombreResponsable}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Parentesco:</Typography>
          <Typography sx={bodyStyle}>{patientData.parentesco}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Código Postal:</Typography>
          <Typography sx={bodyStyle}>{patientData.codigoPostalResponsable}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Colonia:</Typography>
          <Typography sx={bodyStyle}>{patientData.coloniaResponsable}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={6}>
          <Typography sx={titleStyle}>Dirección:</Typography>
          <Typography sx={bodyStyle}>{patientData.domicilioResponsable}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={6}>
          <Typography sx={titleStyle}>Teléfono:</Typography>
          <Typography sx={bodyStyle}>{patientData.telefonoResponsable}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
