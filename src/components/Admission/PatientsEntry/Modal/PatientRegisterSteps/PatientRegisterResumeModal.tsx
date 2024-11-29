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
import { useState } from 'react';
import { usePatientEntryRegisterStepsStore } from '../../../../../store/admission/usePatientEntryRegisterSteps';
import { registerPatient } from '../../../../../services/programming/admissionRegisterService';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { TableHeaderComponent } from '../../../../Commons/TableHeaderComponent';
import { IRegisterRoom } from '../../../../../types/types';
import { NoDataInTableInfo } from '../../../../Commons/NoDataInTableInfo';
import { IBiomedicalEquipment } from '../../../../../types/hospitalizationTypes';
import {
  IHospitalSpaceRecord,
  IPatientRegister,
  IRegisterPatientCommand,
} from '../../../../../types/programming/registerTypes';
import { registerPatientAdmission } from '../../../../../services/admission/admisionService';
import {
  HospitalSpaceType,
  IPatientAdmissionDto,
  IPatientAdmissionEntranceDto,
  IRegisterPatientAdmissionCommand,
  IRegisterPatientReentryCommand,
} from '../../../../../types/admission/admissionTypes';
import { usePatientEntryPaginationStore } from '@/store/admission/usePatientEntryPagination';
import { convertDate } from '@/utils/convertDate';
import { useCreatePatientReentry } from '@/hooks/admission/useCreatePatientReentry';
import { usePatientRegisterPaginationStore } from '@/store/programming/patientRegisterPagination';
import { toast } from 'react-toastify';

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
  hospitalization?: boolean;
  reentry?: boolean;
  patientAccountId?: string;
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
  fontSize: 12,
  fontWeight: 600,
}));

const TextTypography = styled(Typography)(({}) => ({
  fontSize: 12,
  fontWeight: 500,
}));
export const PatientRegisterResumeModal = ({
  setOpen,
  hospitalization,
  reentry,
  patientAccountId,
}: RegisterResumeProps) => {
  const step = usePatientEntryRegisterStepsStore((state) => state.step);
  const warehouseSelected = usePatientEntryRegisterStepsStore((state) => state.warehouseSelected);
  const setStep = usePatientEntryRegisterStepsStore((state) => state.setStep);
  const patient = usePatientEntryRegisterStepsStore((state) => state.patient);
  const procedures = usePatientEntryRegisterStepsStore((state) => state.procedures);
  const cabinetStudiesSelected = usePatientEntryRegisterStepsStore((state) => state.cabinetStudiesSelected);
  const medicId = usePatientEntryRegisterStepsStore((state) => state.medicId);
  const clinicalData = usePatientEntryRegisterStepsStore((state) => state.clinicalData);
  const articlesSelected = usePatientEntryRegisterStepsStore((state) => state.articlesSelected);
  const medicPersonalBiomedicalEquipment = usePatientEntryRegisterStepsStore(
    (state) => state.medicPersonalBiomedicalEquipment
  );
  const packageSelected = usePatientEntryRegisterStepsStore((state) => state.packageSelected);
  const roomValues = usePatientEntryRegisterStepsStore((state) => state.roomsRegistered);
  const medicData = JSON.parse(localStorage.getItem('medicData') as string);
  const proceduresList: { id: string; name: string; price: number }[] = JSON.parse(
    localStorage.getItem('proceduresList') as string
  );
  const refetch = hospitalization
    ? usePatientEntryPaginationStore((state) => state.fetchData)
    : usePatientRegisterPaginationStore((state) => state.fetchData);
  const { mutateAsync: createReentry } = useCreatePatientReentry();
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

  console.log('roomValues', roomValues);

  const handleSubmit = async () => {
    setIsLoading(true);
    let startDate = roomValues[0].horaInicio;
    let endDate = roomValues[0].horaFin;

    for (let i = 1; i < roomValues.length; i++) {
      if (roomValues[i].horaInicio < startDate) {
        startDate = convertDate(roomValues[i].horaInicio);
      }
      if (roomValues[i].horaFin > endDate) {
        endDate = convertDate(roomValues[i].horaFin);
      }
    }

    try {
      const operatingRoom: IHospitalSpaceRecord = {
        id_EspacioHospitalario: roomValues.find((r) => r.tipoCuarto == HospitalSpaceType.OperatingRoom)?.id as string,
        horaInicio: convertDate(roomValues.find((r) => r.tipoCuarto == HospitalSpaceType.OperatingRoom)?.horaInicio),
        horaFin: convertDate(roomValues.find((r) => r.tipoCuarto == HospitalSpaceType.OperatingRoom)?.horaFin),
      };

      const hospitalizationRoom: IHospitalSpaceRecord = {
        id_EspacioHospitalario: roomValues.find((r) => r.tipoCuarto == HospitalSpaceType.Room)?.id as string,
        horaInicio: convertDate(roomValues.find((r) => r.tipoCuarto == HospitalSpaceType.Room)?.horaInicio),
        horaFin: convertDate(roomValues.find((r) => r.tipoCuarto == HospitalSpaceType.Room)?.horaFin),
      };

      console.log('operatingRoom', operatingRoom);
      console.log('hospitalizationRoom', hospitalizationRoom);

      if (reentry) {
        const reentryCommand: IRegisterPatientReentryCommand = {
          registroQuirofano: operatingRoom,
          id_Medico: medicId,
          procedimientos: procedures,
          id_Paquete: packageSelected?.id_PaqueteQuirurgico,
          id_AlmacenPaquete: warehouseSelected,
          servicios: cabinetStudiesSelected.map((c) => c.id),
          articulosExtra: articlesSelected.map((a) => ({
            id_Articulo: a.id,
            cantidad: a.cantidad,
          })),
          equipoHonorario: medicPersonalBiomedicalEquipment.map((eh) => ({
            nombre: eh.nombre,
            precio: eh.precio,
          })),
          id_CuentaPaciente: patientAccountId as string,
        };

        await createReentry(reentryCommand);
      } else if (!hospitalization) {
        const patientObj: IPatientRegister = {
          nombre: patient.name,
          apellidoPaterno: patient.lastName,
          apellidoMaterno: patient.secondLastName,
          fechaNacimiento: patient.birthDate,
          genero: patient.genere,
        };
        const registerObject: IRegisterPatientCommand = {
          paciente: patientObj,
          registroQuirofano: operatingRoom,
          registroCuarto: hospitalizationRoom,
          id_AlmacenPaquete: warehouseSelected,
          servicios: cabinetStudiesSelected.flatMap((c) => c.id),
          procedimientos: procedures,
          id_Medico: medicId,
          articulosExtra: articlesSelected.map((a) => ({
            id_Articulo: a.id,
            cantidad: a.cantidad,
          })),
          id_Paquete: packageSelected?.id_PaqueteQuirurgico ?? '',
          equipoHonorario: medicPersonalBiomedicalEquipment.map((eh) => ({
            nombre: eh.nombre,
            precio: eh.precio,
          })),
        };
        await registerPatient(registerObject);
      } else {
        const patientAdmissionObj: IPatientAdmissionDto = {
          nombre: patient.name,
          apellidoPaterno: patient.lastName,
          apellidoMaterno: patient.secondLastName,
          fechaNacimiento: patient.birthDate,
          genero: patient.genere,
          estadoCivil: patient.civilStatus,
          telefono: patient.phoneNumber,
          ocupacion: patient.occupation,
          codigoPostal: patient.zipCode,
          colonia: patient.neighborhood,
          direccion: patient.address,
          tipoSangre: clinicalData.bloodType,
          alergias: clinicalData.allergies,
          curp: patient.curp,
          estado: patient.state,
          ciudad: patient.city,
        };
        const patientAdmission: IPatientAdmissionEntranceDto = {
          nombreResponsable: patient.personInCharge,
          parentesco: patient.relationship,
          domicilioResponsable: patient.personInChargeAddress,
          coloniaResponsable: patient.personInChargeNeighborhood,
          estadoResponsable: patient.personInChargeState,
          ciudadResponsable: patient.personInChargeCity,
          codigoPostalResponsable: patient.personInChargeZipCode,
          telefonoResponsable: patient.personInChargePhoneNumber,
          motivoIngreso: clinicalData.reasonForAdmission,
          diagnosticoIngreso: clinicalData.admissionDiagnosis,
          comentarios: clinicalData.comments,
        };

        const admissionObj: IRegisterPatientAdmissionCommand = {
          paciente: patientAdmissionObj,
          registroCuarto: hospitalizationRoom,
          procedimientos: procedures,
          id_Medico: medicId,
          ingresosPaciente: patientAdmission,
        };
        await registerPatientAdmission(admissionObj);
      }

      refetch();
      setOpen(false);
      if (!reentry) {
        toast.success('Paciente registrado correctamente');
      }
    } catch (error) {
      console.log(error);
      if (!reentry) {
        toast.error('Error al registrar el paciente');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={setOpen} title="Resumen del registro" />
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          overflowY: 'auto',
          maxHeight: 500,
          ...styleBar,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <TitleTypography variant="h5">Datos del paciente</TitleTypography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Stack spacing={1}>
              <SubtitleTypography variant="subtitle1">Nombre:</SubtitleTypography>
              <TextTypography>
                {patient.name || patient.lastName || patient.secondLastName
                  ? patient.name + ' ' + patient.lastName + ' ' + patient.secondLastName
                  : 'Sin definir'}
              </TextTypography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Stack spacing={1}>
              <SubtitleTypography variant="subtitle1">Fecha de Nacimiento:</SubtitleTypography>
              <TextTypography>{dayjs(patient.birthDate).format('DD/MM/YYYY')}</TextTypography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Stack spacing={1}>
              <SubtitleTypography variant="subtitle1">Género:</SubtitleTypography>
              <TextTypography>{patient.genere ? patient.genere : 'Sin definir'}</TextTypography>
            </Stack>
          </Grid>
          {hospitalization && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <SubtitleTypography variant="subtitle1">Estado Civil:</SubtitleTypography>
                  <TextTypography>{!patient.civilStatus ? 'Sin definir' : patient.civilStatus}</TextTypography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <SubtitleTypography variant="subtitle1">Teléfono:</SubtitleTypography>
                  <TextTypography>{!patient.phoneNumber ? 'Sin definir' : patient.phoneNumber}</TextTypography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <SubtitleTypography variant="subtitle1">Ocupación/Empleo:</SubtitleTypography>
                  <TextTypography>{patient.occupation ? patient.occupation : 'Sin definir'}</TextTypography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <SubtitleTypography variant="subtitle1">Código Postal:</SubtitleTypography>
                  <TextTypography>{patient.zipCode ? patient.zipCode : 'Sin definir'}</TextTypography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <SubtitleTypography variant="subtitle1">Colonia:</SubtitleTypography>
                  <TextTypography>{patient.neighborhood ? patient.neighborhood : 'Sin definir'}</TextTypography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <SubtitleTypography variant="subtitle1">Dirección:</SubtitleTypography>
                  <TextTypography>{patient.address ? patient.address : 'Sin definir'}</TextTypography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <SubtitleTypography variant="subtitle1">Estado:</SubtitleTypography>
                  <TextTypography>{patient.state ? patient.state : 'Sin definir'}</TextTypography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <SubtitleTypography variant="subtitle1">Ciudad:</SubtitleTypography>
                  <TextTypography>{patient.city ? patient.city : 'Sin definir'}</TextTypography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <SubtitleTypography variant="subtitle1">CURP:</SubtitleTypography>
                  <TextTypography>{patient.curp ? patient.curp : 'Sin definir'}</TextTypography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <SubtitleTypography variant="subtitle1">Persona Responsable:</SubtitleTypography>
                  <TextTypography>{patient.personInCharge ? patient.personInCharge : 'Sin definir'}</TextTypography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <SubtitleTypography variant="subtitle1">Parentesco:</SubtitleTypography>
                  <TextTypography>{patient.relationship ? patient.relationship : 'Sin definir'}</TextTypography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <SubtitleTypography variant="subtitle1">Teléfono de la Persona Responsable:</SubtitleTypography>
                  <TextTypography>
                    {patient.personInChargePhoneNumber ? patient.personInChargePhoneNumber : 'Sin definir'}
                  </TextTypography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <SubtitleTypography variant="subtitle1">Dirección de la Persona Responsable:</SubtitleTypography>
                  <TextTypography>
                    {patient.personInChargeAddress ? patient.personInChargeAddress : 'Sin definir'}
                  </TextTypography>
                </Stack>
              </Grid>
            </>
          )}
        </Grid>
        {hospitalization && (
          <>
            <CustomDivider sx={{ my: 2 }} />
            <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <TitleTypography>Datos Clínicos</TitleTypography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SubtitleTypography>Razón de admisión:</SubtitleTypography>
                  <TextTypography>{clinicalData.reasonForAdmission}</TextTypography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SubtitleTypography>Diagnóstico de admisión:</SubtitleTypography>
                  <TextTypography>{clinicalData.admissionDiagnosis}</TextTypography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SubtitleTypography>Alergias:</SubtitleTypography>
                  <TextTypography>{clinicalData.allergies}</TextTypography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SubtitleTypography>Tipo de Sangre:</SubtitleTypography>
                  <TextTypography>{clinicalData.bloodType}</TextTypography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SubtitleTypography>Comentarios:</SubtitleTypography>
                  <TextTypography>{clinicalData.comments}</TextTypography>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        <CustomDivider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TitleTypography>Datos del Espacio Reservado</TitleTypography>
        </Box>
        <LocalEventsTable events={roomValues} />
        <CustomDivider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TitleTypography>Datos Medicos</TitleTypography>
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
        {!hospitalization && (
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
        )}
        <CustomDivider sx={{ my: 2 }} />
        {!hospitalization && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TitleTypography>Artículos agregados</TitleTypography>
            </Box>
            <ArticlesTable articlesSelected={articlesSelected} />
            <CustomDivider />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TitleTypography>Equipo Biomedico</TitleTypography>
            </Box>
            <BiomedicalEquipmentTable equipmentList={medicPersonalBiomedicalEquipment} />
          </>
        )}
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
