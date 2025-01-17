import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  DividerProps,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  styled,
} from '@mui/material';
import { useProgrammingRegisterStore } from '../../../store/programming/programmingRegister';
import dayjs from 'dayjs';
import { IRegisterRoom } from '../../../types/types';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { createPatient } from '../../../services/programming/patientService';
import { createClinicalHistory } from '../../../services/programming/clinicalHistoryService';
import { createAdmission } from '../../../services/programming/admissionRegisterService';
import { toast } from 'react-toastify';
import { usePatientRegisterPaginationStore } from '../../../store/programming/patientRegisterPagination';
import { useState } from 'react';

const styleBar = {
  '&::-webkit-scrollbar': {
    width: '0.4em',
    zIndex: 1,
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    zIndex: 1,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey',
    zIndex: 1,
  },
};
interface RegisterResumeProps {
  setOpen: Function;
}
const HEADERS = ['Nombre', 'Hora Inicio', 'Hora Fin'];
const DIVIDER_SIZE = 1;
const DIVIDER_STYLE = {
  my: DIVIDER_SIZE,
};
const CustomDivider = (props: DividerProps) => <Divider sx={{ ...DIVIDER_STYLE }} {...props} />;

const TitleTypography = styled(Typography)(({}) => ({
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 5,
}));

const SubtitleTypography = styled(Typography)(({}) => ({
  fontSize: 13,
  fontWeight: 500,
}));

const TextTypography = styled(Typography)(({}) => ({
  fontSize: 11,
  fontWeight: 500,
}));
export const ProgrammingRegisterResume = (props: RegisterResumeProps) => {
  const step = useProgrammingRegisterStore((state) => state.step);
  const setStep = useProgrammingRegisterStore((state) => state.setStep);
  const patient = useProgrammingRegisterStore((state) => state.patient);
  const clinicalData = useProgrammingRegisterStore((state) => state.clinicalData);
  const procedures = useProgrammingRegisterStore((state) => state.procedures);
  const xrayIds = useProgrammingRegisterStore((state) => state.xrayIds);
  const medicId = useProgrammingRegisterStore((state) => state.medicId);
  const anesthesiologistId = useProgrammingRegisterStore((state) => state.anesthesiologistId);
  const articlesSelected = useProgrammingRegisterStore((state) => state.articlesSelected);
  const biomedicalEquipment = useProgrammingRegisterStore((state) => state.biomedicalEquipmentsSelected);
  const evidencePdf = useProgrammingRegisterStore((state) => state.evidencePdf);
  const rejectedMedicId = useProgrammingRegisterStore((state) => state.rejectedMedicId);
  const medicPersonalBiomedicalEquipment = useProgrammingRegisterStore(
    (state) => state.medicPersonalBiomedicalEquipment
  );
  const roomValues = useProgrammingRegisterStore((state) => state.roomValues);
  const medicData = JSON.parse(localStorage.getItem('medicData') as string);
  const proceduresList: { id: string; name: string; price: number }[] = JSON.parse(
    localStorage.getItem('proceduresList') as string
  );
  const xrayList = JSON.parse(localStorage.getItem('xrayList') as string);
  const anesthesiologistData = JSON.parse(localStorage.getItem('anesthesiologist') as string);
  const refetch = usePatientRegisterPaginationStore((state) => state.fetchData);
  const [isLoading, setIsLoading] = useState(false);

  /*const handleCalcAnticipo = () => {
    let total: number = 0;
    articlesSelected.forEach((articleElement) => {
      // console.log('articulo', articleElement.precioVenta);
      total += articleElement.precioVenta * articleElement.cantidad;
    });
    biomedicalEquipment.forEach((bmEquip) => {
      // console.log('Equipbm', bmEquip.precio);
      total += bmEquip.precio;
    });
    medicPersonalBiomedicalEquipment.forEach((medicPersonalBmEquip) => {
      // console.log('Equipbm', medicPersonalBmEquip.precio);
      total += medicPersonalBmEquip.precio;
    });
    proceduresList.forEach((procedureE) => {
      console.log('proc', procedureE);
      total += procedureE.price;
    });

    console.log('Total calculado', total);
    console.log('anticipo 20%', total * 0.2);
    return (total * 0.2).toFixed(2);
  };*/

  const handleSubmit = async () => {
    setIsLoading(true);
    let startDate = roomValues[0].horaInicio;
    let endDate = roomValues[0].horaFin;

    for (let i = 1; i < roomValues.length; i++) {
      if (roomValues[i].horaInicio < startDate) {
        startDate = roomValues[i].horaInicio;
      }
      if (roomValues[i].horaFin > endDate) {
        endDate = roomValues[i].horaFin;
      }
    }

    try {
      const patientRes = await createPatient(patient);
      const registerClinicalHistoryObj = {
        Id_Paciente: patientRes.id,
        MotivoIngreso: clinicalData.reasonForAdmission,
        DiagnosticoIngreso: clinicalData.admissionDiagnosis,
        Comentarios: clinicalData.comments,
        Alergias: clinicalData.allergies,
        TipoSangre: clinicalData.bloodType,
      };
      const clinicalDataRes = await createClinicalHistory(registerClinicalHistoryObj);
      const objectRejectedAppointment = {
        MotivoRechazo: evidencePdf,
        Id_Medico: rejectedMedicId,
      };
      const registerAdmissionObj = {
        pacienteId: patientRes.id,
        historialClinicoId: clinicalDataRes.id,
        procedimientos: procedures,
        motivoRechazo: rejectedMedicId && evidencePdf ? JSON.stringify(objectRejectedAppointment) : undefined,
        fechaInicio: startDate,
        fechaFin: endDate,
        cuartos: roomValues.map((r) => {
          return {
            cuartoId: r.id,
            horaInicio: r.horaInicio,
            horaFin: r.horaFin,
            id_TipoCuarto: r.id_TipoCuarto,
          };
        }),
        radiografias: xrayIds.length === 0 ? null : xrayIds,
        equiposBiomedico: biomedicalEquipment.flatMap((be) => be.id),
        articulos: articlesSelected.map((a) => {
          return {
            articuloId: a.id,
            cantidad: a.cantidad,
          };
        }),
        equipoBiomedicoHonorario: JSON.stringify(
          medicPersonalBiomedicalEquipment.map((mpbe) => {
            return {
              nombre: mpbe.nombre,
              precio: mpbe.precio,
              id_Medico: medicId,
              notas: mpbe.notas,
            };
          })
        ),
        id_Medico: medicId === '' ? null : medicId,
        id_Anestesiologo: anesthesiologistId === '' ? null : anesthesiologistId,
      };
      await createAdmission(registerAdmissionObj);
      refetch();
      toast.success('Paciente dado de alta correctamente');
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Error al dar de alta al paciente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HeaderModal setOpen={props.setOpen} title="Resumen del registro" />
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          overflowY: 'auto',
          maxHeight: 500,
          ...styleBar,
        }}
      >
        <CustomDivider />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TitleTypography>Datos del paciente</TitleTypography>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6} md={4}>
            <Stack>
              <SubtitleTypography>Nombre:</SubtitleTypography>
              <TextTypography>{patient.name + ' ' + patient.lastName + ' ' + patient.secondLastName}</TextTypography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Stack>
              <SubtitleTypography>Fecha de Nacimiento:</SubtitleTypography>
              <TextTypography>{dayjs(patient.birthDate).format('DD/MM/YYYY')}</TextTypography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Stack>
              <SubtitleTypography>Genero:</SubtitleTypography>
              <TextTypography>{patient.genere}</TextTypography>
            </Stack>
          </Grid>
        </Grid>
        <CustomDivider />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TitleTypography>Datos Clínicos</TitleTypography>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6} md={4}>
            <Stack>
              <SubtitleTypography>Diagnostico de ingreso:</SubtitleTypography>
              <TextTypography>{clinicalData.admissionDiagnosis}</TextTypography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Stack>
              <SubtitleTypography>Motivo de ingreso:</SubtitleTypography>
              <TextTypography>{clinicalData.reasonForAdmission}</TextTypography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Stack>
              <SubtitleTypography>Alergias:</SubtitleTypography>
              <TextTypography>{clinicalData.allergies}</TextTypography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Stack>
              <SubtitleTypography>Tipo de sangre:</SubtitleTypography>
              <TextTypography>{clinicalData.bloodType}</TextTypography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Stack>
              <SubtitleTypography>Comentarios:</SubtitleTypography>
              <TextTypography>{clinicalData.comments}</TextTypography>
            </Stack>
          </Grid>
        </Grid>
        <CustomDivider />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TitleTypography>Datos del evento</TitleTypography>
        </Box>
        <LocalEventsTable events={roomValues} />
        <CustomDivider />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TitleTypography>Datos medicos</TitleTypography>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ flex: 1 }}>
            <SubtitleTypography>Nombre del medico:</SubtitleTypography>
            <TextTypography>{medicData.name}</TextTypography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <SubtitleTypography>Nombre del anestesiólogo:</SubtitleTypography>
            <TextTypography>{anesthesiologistData.name}</TextTypography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <SubtitleTypography>Procedimientos:</SubtitleTypography>
            {proceduresList.map((p) => (
              <Chip key={p.id} label={p.name} />
            ))}
          </Box>
        </Box>
        <Box sx={{ my: 1 }}>
          <SubtitleTypography>Estudios de Gabinete:</SubtitleTypography>
          {xrayList.map((p: { id: string; name: string }) => (
            <Chip key={p.id} label={p.name} />
          ))}
        </Box>
      </Box>
      <Box sx={{ bgcolor: 'background.paper', p: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={() => setStep(step - 1)}>
          Regresar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <CircularProgress size={15} /> : 'Confirmar'}
        </Button>
      </Box>
    </>
  );
};

interface LocalEventsTableProps {
  events: IRegisterRoom[];
}

const LocalEventsTable: React.FC<LocalEventsTableProps> = ({ events }) => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
      <Table>
        <TableHeaderComponent headers={HEADERS} />
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.nombre}</TableCell>
              <TableCell>{event.horaInicio.toLocaleString()}</TableCell>
              <TableCell>{event.horaFin.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
