import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { useGetOperatingRoomInfo } from '../../../../hooks/operatingRoom/useGetOperatingRoomInfo';
import { useState } from 'react';
import { Check, ExpandLess, ExpandMore } from '@mui/icons-material';
import { HistorialClinico, Paciente } from '../../../../types/admissionTypes';
import dayjs from 'dayjs';
import { IAnesthesiologist, IMedic } from '../../../../types/hospitalizationTypes';
import { RiNurseFill } from 'react-icons/ri';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 370, sm: 550, md: 800 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
};

const styleBar = {
  '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey',
  },
};

export const AllSurgeryInfoModal = (props: { setOpen: Function; surgeryId: string }) => {
  const { data, isLoading } = useGetOperatingRoomInfo(props.surgeryId);
  const COLLAPSE_BODIES = [
    {
      title: 'Paciente',
      body: <PatientInfoComponent patient={data?.paciente} />,
    },
    {
      title: 'Personal del paciente',
      body: (
        <PersonalServiceSurgeryInfo
          surgeon={data?.medico}
          anesthesiologist={data?.anestesiologo}
          nurses={data?.enfermeros}
        />
      ),
    },
    {
      title: 'Procedimientos',
      body: <SurgeryProceduresComponent procedures={data?.procedimientos} />,
    },
    {
      title: 'Historial clínico',
      body: <ClinicalDataComponent clinicalData={data?.datosClinicos} />,
    },
  ];

  if (isLoading)
    return (
      <Backdrop open={isLoading}>
        <CircularProgress />
      </Backdrop>
    );

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Información de cirugía" />
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          rowGap: 1,
          overflowY: 'auto',
          ...styleBar,
        }}
      >
        {COLLAPSE_BODIES.map((d, i) => (
          <CollapseInfo key={i} title={d.title} body={d.body} />
        ))}
      </Box>
      <Box sx={{ bgcolor: 'background.paper', p: 1, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
        <Button onClick={() => props.setOpen(false)} variant="outlined">
          Cerrar
        </Button>
      </Box>
    </Box>
  );
};

const CollapseInfo = (props: { title: string; body: JSX.Element }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  return (
    <>
      <Card
        sx={{
          bgcolor: theme.palette.grey[200],
          p: 1,
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 600, color: 'gray' }}>{props.title}</Typography>
        <IconButton onClick={() => setExpanded(!expanded)}>{expanded ? <ExpandLess /> : <ExpandMore />}</IconButton>
      </Card>
      <Collapse in={expanded} unmountOnExit>
        <Box sx={{ p: 2 }}>{props.body}</Box>
      </Collapse>
    </>
  );
};

const PatientInfoComponent = (props: { patient?: Paciente }) => {
  const { patient } = props;
  const patientName = patient?.nombre + ' ' + patient?.apellidoPaterno + ' ' + patient?.apellidoMaterno;
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={4} sm={6}>
        <Typography variant="subtitle1">Nombre:</Typography>
        {patientName ?? ''}
      </Grid>
      <Grid item xs={12} md={4} sm={6}>
        <Typography variant="subtitle1">Fecha de nacimiento:</Typography>
        {dayjs(patient?.fechaNacimiento).format('DD/MM/YYYY')}
      </Grid>
      <Grid item xs={12} md={4} sm={6}>
        <Typography variant="subtitle1">Edad:</Typography>
        {patient?.edad ?? ''}
      </Grid>
      <Grid item xs={12} md={4} sm={6}>
        <Typography variant="subtitle1">Genero:</Typography>
        {patient?.genero ?? ''}
      </Grid>
      <Grid item xs={12} md={4} sm={6}></Grid>
    </Grid>
  );
};

const PersonalServiceSurgeryInfo = (props: {
  surgeon?: IMedic;
  anesthesiologist?: IAnesthesiologist;
  nurses?: { id_Enfermero: string; nombre: string }[];
}) => {
  const { surgeon, anesthesiologist, nurses } = props;
  const surgeonName = surgeon?.nombres + ' ' + surgeon?.apellidoPaterno + ' ' + surgeon?.apellidoMaterno;
  const anesthesiologistName =
    anesthesiologist?.nombres + ' ' + anesthesiologist?.apellidoPaterno + ' ' + anesthesiologist?.apellidoMaterno;
  return (
    <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', rowGap: 2 }}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4">Cirujano</Typography>
        </Grid>
        <Grid item xs={12} md={4} sm={6}>
          <Typography variant="subtitle1">Nombre:</Typography>
          <Typography>{surgeonName ?? ''}</Typography>
        </Grid>
        <Grid item xs={12} md={4} sm={6}>
          <Typography variant="subtitle1">Email:</Typography>
          <Typography>{surgeon?.email ?? ''}</Typography>
        </Grid>
        <Grid item xs={12} md={4} sm={6}>
          <Typography variant="subtitle1">Teléfono:</Typography>
          <Typography>{surgeon?.telefono ?? ''}</Typography>
        </Grid>
      </Grid>
      <Divider />
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4">Anestesiólogo</Typography>
        </Grid>
        <Grid item xs={12} md={4} sm={6}>
          <Typography variant="subtitle1">Nombre:</Typography>
          <Typography>{anesthesiologistName ?? ''}</Typography>
        </Grid>
        <Grid item xs={12} md={4} sm={6}>
          <Typography variant="subtitle1">Email:</Typography>
          <Typography>{anesthesiologist?.email ?? ''}</Typography>
        </Grid>
        <Grid item xs={12} md={4} sm={6}>
          <Typography variant="subtitle1">Teléfono:</Typography>
          <Typography>{anesthesiologist?.telefono ?? ''}</Typography>
        </Grid>
      </Grid>
      <Divider />
      <NursesComponent nurses={nurses} />
    </Box>
  );
};

const NursesComponent = (props: { nurses?: { id_Enfermero: string; nombre: string }[] }) => {
  const { nurses } = props;
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h4">Enfermeros</Typography>
      </Grid>
      {nurses?.map((n) => (
        <Grid item xs={12} md={4} sm={6} key={n.id_Enfermero}>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            <RiNurseFill style={{ height: 40, width: 40, color: '#858A8E' }} />
            <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
              <Typography variant="subtitle1">Enfermero:</Typography>
              <Typography>{n.nombre}</Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

const SurgeryProceduresComponent = (props: { procedures?: { id: string; nombre: string }[] }) => {
  const { procedures } = props;
  return (
    <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
      {procedures?.map((p) => (
        <Box sx={{ display: 'flex', flex: 1, columnGap: 0.5 }} key={p.id}>
          <Check color="success" />
          <Typography>{p.nombre}</Typography>
        </Box>
      ))}
    </Box>
  );
};

const ClinicalDataComponent = (props: { clinicalData?: HistorialClinico }) => {
  const { clinicalData } = props;
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={4} sm={6}>
        <Typography variant="subtitle1">Motivo de ingreso:</Typography>
        {clinicalData?.motivoIngreso}
      </Grid>
      <Grid item xs={12} md={4} sm={6}>
        <Typography variant="subtitle1">Diagnostico de ingreso:</Typography>
        {clinicalData?.diagnosticoIngreso ?? ''}
      </Grid>
      <Grid item xs={12} md={4} sm={6}>
        <Typography variant="subtitle1">Alergias:</Typography>
        {clinicalData?.alergias ?? ''}
      </Grid>
      <Grid item xs={12} md={4} sm={6}>
        <Typography variant="subtitle1">Tipo de sangre:</Typography>
        {clinicalData?.tipoSangre ?? ''}
      </Grid>
    </Grid>
  );
};
