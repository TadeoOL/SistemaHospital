import { Divider, Grid, Typography } from '@mui/material';
import { IAdmitPatientCommand } from '../../../../types/admission/admissionTypes';
const titleStyle = { fontSize: 15, fontWeight: 500 };
const bodyStyle = { fontSize: 14, fontWeight: 400 };
const gridStyle = {
  display: 'flex',
  columnGap: 1,
  alignItems: 'center',
};

interface EventPatientDetailsProps {
  patientData?: IAdmitPatientCommand;
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
          <Typography sx={bodyStyle}>{patientData?.paciente?.nombre || 'Sin definir'}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Apellido Paterno:</Typography>
          <Typography sx={bodyStyle}>{patientData?.paciente?.apellidoPaterno || 'Sin definir'}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Apellido Materno:</Typography>
          <Typography sx={bodyStyle}>{patientData?.paciente?.apellidoMaterno || 'Sin definir'}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Genero:</Typography>
          <Typography sx={bodyStyle}>{patientData?.paciente?.genero || 'Sin definir'}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Estado Civil:</Typography>
          <Typography sx={bodyStyle}>{patientData?.paciente?.estadoCivil || 'Sin definir'}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Teléfono:</Typography>
          <Typography sx={bodyStyle}>{patientData?.paciente?.telefono || 'Sin definir'}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Ocupación/Empleo:</Typography>
          <Typography sx={bodyStyle}>{patientData?.paciente?.ocupacion || 'Sin definir'}</Typography>
        </Grid>
      </Grid>

      <Grid item container spacing={1}>
        <Grid item xs={12}>
          <Typography sx={{ mt: 1, fontSize: 20, fontWeight: 500 }}>Información de Domicilio</Typography>
          <Divider sx={{ my: 1 }} />
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Código Postal:</Typography>
          <Typography sx={bodyStyle}>{patientData?.paciente?.codigoPostal || 'Sin definir'}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Colonia:</Typography>
          <Typography sx={bodyStyle}>{patientData?.paciente?.colonia || 'Sin definir'}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Dirección:</Typography>
          <Typography sx={bodyStyle}>{patientData?.paciente?.direccion || 'Sin definir'}</Typography>
        </Grid>
      </Grid>
      <Grid item container spacing={1}>
        <Grid item xs={12}>
          <Typography sx={{ mt: 1, fontSize: 20, fontWeight: 500 }}>Datos de contacto responsable</Typography>
          <Divider sx={{ my: 1 }} />
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Persona Responsable:</Typography>
          <Typography sx={bodyStyle}>{patientData?.responsablePaciente?.nombreResponsable || 'Sin definir'}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Parentesco:</Typography>
          <Typography sx={bodyStyle}>{patientData?.responsablePaciente?.parentesco || 'Sin definir'}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Código Postal:</Typography>
          <Typography sx={bodyStyle}>
            {patientData?.responsablePaciente?.codigoPostalResponsable || 'Sin definir'}
          </Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Colonia:</Typography>
          <Typography sx={bodyStyle}>
            {patientData?.responsablePaciente?.coloniaResponsable || 'Sin definir'}
          </Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={6}>
          <Typography sx={titleStyle}>Dirección:</Typography>
          <Typography sx={bodyStyle}>
            {patientData?.responsablePaciente?.domicilioResponsable || 'Sin definir'}
          </Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={6}>
          <Typography sx={titleStyle}>Teléfono:</Typography>
          <Typography sx={bodyStyle}>
            {patientData?.responsablePaciente?.telefonoResponsable || 'Sin definir'}
          </Typography>
        </Grid>
      </Grid>
      <Grid item container spacing={3}>
        <Grid item xs={12}>
          <Typography sx={{ mt: 1, fontSize: 20, fontWeight: 500 }}>Información Clínica</Typography>
          <Divider sx={{ my: 1 }} />
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Motivo Ingreso:</Typography>
          <Typography sx={bodyStyle}>{patientData?.datosClinicos?.motivoIngreso || 'Sin definir'}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Diagnostico Ingreso:</Typography>
          <Typography sx={bodyStyle}>{patientData?.datosClinicos?.diagnosticoIngreso || 'Sin definir'}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Alergias:</Typography>
          <Typography sx={bodyStyle}>{patientData?.paciente?.alergias || 'Sin definir'}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12} md={6}>
          <Typography sx={titleStyle}>Tipo de sangre:</Typography>
          <Typography sx={bodyStyle}>{patientData?.paciente?.tipoSangre || 'Sin definir'}</Typography>
        </Grid>
        <Grid sx={gridStyle} item xs={12}>
          <Typography sx={titleStyle}>Comentarios:</Typography>
          <Typography sx={bodyStyle}>{patientData?.datosClinicos?.comentarios || 'Sin definir'}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
