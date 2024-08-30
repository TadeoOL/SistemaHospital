import {
  Box,
  Button,
  Card,
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
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { usePatientEntryRegisterStepsStore } from '../../../../../store/admission/usePatientEntryRegisterSteps';
import { usePatientRegisterPaginationStore } from '../../../../../store/programming/patientRegisterPagination';
import { createPatient } from '../../../../../services/programming/patientService';
import { createClinicalHistory } from '../../../../../services/programming/clinicalHistoryService';
import { createAdmission } from '../../../../../services/programming/admissionRegisterService';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { TableHeaderComponent } from '../../../../Commons/TableHeaderComponent';
import { IRegisterRoom } from '../../../../../types/types';
import { NoDataInTableInfo } from '../../../../Commons/NoDataInTableInfo';
import { IBiomedicalEquipment } from '../../../../../types/hospitalizationTypes';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 900, lg: 1100 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 550, xl: 900 },
};
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
const ARTICLE_HEADERS = ['Nombre', 'Cantidad'];
const BIOMEDICAL_HEADERS = ['Nombre', 'Precio', 'Notas'];
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
export const PatientRegisterResumeModal = (props: RegisterResumeProps) => {
  const step = usePatientEntryRegisterStepsStore((state) => state.step);
  const setStep = usePatientEntryRegisterStepsStore((state) => state.setStep);
  const patient = usePatientEntryRegisterStepsStore((state) => state.patient);
  const procedures = usePatientEntryRegisterStepsStore((state) => state.procedures);
  const cabinetStudiesSelected = usePatientEntryRegisterStepsStore((state) => state.cabinetStudiesSelected);
  const medicId = usePatientEntryRegisterStepsStore((state) => state.medicId);
  const articlesSelected = usePatientEntryRegisterStepsStore((state) => state.articlesSelected);
  const medicPersonalBiomedicalEquipment = usePatientEntryRegisterStepsStore(
    (state) => state.medicPersonalBiomedicalEquipment
  );
  const roomValues = usePatientEntryRegisterStepsStore((state) => state.roomsRegistered);
  const medicData = JSON.parse(localStorage.getItem('medicData') as string);
  const proceduresList: { id: string; name: string; price: number }[] = JSON.parse(
    localStorage.getItem('proceduresList') as string
  );
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
        MotivoIngreso: '',
        DiagnosticoIngreso: '',
        Comentarios: '',
        Alergias: '',
        TipoSangre: '',
      };
      const clinicalDataRes = await createClinicalHistory(registerClinicalHistoryObj);
      const registerAdmissionObj = {
        pacienteId: patientRes.id,
        historialClinicoId: clinicalDataRes.id,
        procedimientos: procedures,
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
        equiposBiomedico: [],
        id_Medico: medicId === '' ? null : medicId,
        estudiosGabinete: cabinetStudiesSelected.flatMap((c) => c.id),
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
    <Box sx={style}>
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
            <SubtitleTypography>Procedimientos:</SubtitleTypography>
            {proceduresList.map((p) => (
              <Chip key={p.id} label={p.name} />
            ))}
          </Box>
        </Box>
        <Box sx={{ my: 1 }}>
          <SubtitleTypography>Estudios de Gabinete:</SubtitleTypography>
          {cabinetStudiesSelected.length > 0 ? (
            cabinetStudiesSelected.map((p: { id: string; nombre: string }) => <Chip key={p.id} label={p.nombre} />)
          ) : (
            <Typography variant="caption">
              <b>Sin estudios agregados</b>
            </Typography>
          )}
        </Box>
        <CustomDivider />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TitleTypography>Artículos agregados</TitleTypography>
        </Box>
        <ArticlesTable articlesSelected={articlesSelected} />
        <CustomDivider />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TitleTypography>Equipo Biomedico</TitleTypography>
        </Box>
        <BiomedicalEquipmentTable equipmentList={medicPersonalBiomedicalEquipment} />
      </Box>
      <Box sx={{ bgcolor: 'background.paper', p: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={() => setStep(step - 1)}>
          Regresar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <CircularProgress size={15} /> : 'Confirmar'}
        </Button>
      </Box>
    </Box>
  );
};

interface LocalEventsTableProps {
  events: IRegisterRoom[];
}

const LocalEventsTable: React.FC<LocalEventsTableProps> = ({ events }) => {
  return (
    <TableContainer component={Paper}>
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

interface ArticlesTableProps {
  articlesSelected: {
    id: string;
    nombre: string;
    cantidad: number;
    precioVenta: number;
    cantidadDisponible?: number;
  }[];
}

const ArticlesTable = ({ articlesSelected }: ArticlesTableProps) => {
  return (
    <Card>
      <TableContainer component={Paper}>
        <Table>
          <TableHeaderComponent headers={ARTICLE_HEADERS} align="center" />
          <TableBody>
            {articlesSelected.map((article) => (
              <TableRow key={article.id}>
                <TableCell align="center">{article.nombre}</TableCell>
                <TableCell align="center">{article.cantidad}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {articlesSelected.length < 1 && <NoDataInTableInfo infoTitle="No hay artículos" sizeIcon={30} variantText="h3" />}
    </Card>
  );
};

interface BiomedicalEquipmentTableProps {
  equipmentList: IBiomedicalEquipment[];
}
const BiomedicalEquipmentTable = ({ equipmentList }: BiomedicalEquipmentTableProps) => {
  return (
    <Card>
      <TableContainer component={Paper}>
        <Table>
          <TableHeaderComponent headers={BIOMEDICAL_HEADERS} align="center" />
          <TableBody>
            {equipmentList.map((equipment) => (
              <TableRow key={equipment.id}>
                <TableCell align="center">{equipment.nombre}</TableCell>
                <TableCell align="center">{equipment.precio}</TableCell>
                <TableCell align="center">{equipment.notas || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {equipmentList.length < 1 && (
        <NoDataInTableInfo infoTitle="No hay equipos biomedicos" sizeIcon={30} variantText="h3" />
      )}
    </Card>
  );
};
