import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { SurgeryProceduresChip } from '../../Commons/SurgeryProceduresChip';
import dayjs from 'dayjs';
import { useHospitalRoomsPaginationStore } from '../../../store/hospitalization/hospitalRoomsPagination';
import { useEffect, useState } from 'react';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import {
  Check,
  Warning,
  EventAvailable,
  InfoOutlined,
  MedicationOutlined,
  CheckCircleOutlineOutlined,
} from '@mui/icons-material';
import { IHospitalRoomInformationPagination } from '../../../types/hospitalization/hospitalRoomTypes';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { HospitalRoomInformationModal } from './Modal/hospitalRoomInformation/HospitalRoomInformationModal';
import { NurseRequestModal } from '../../Pharmacy/UserRequest/Modal/NurseRequestModal';
import { useGetPharmacyConfig } from '../../../hooks/useGetPharmacyConfig';
import { DateExitPopover } from '../../Commons/DateExitPopover';
import Swal from 'sweetalert2';
import { updateHospitalRoomExitDate } from '../../../services/hospitalization/hospitalRoomsService';
import { PatientDischargeModal } from './Modal/PatientDischargeModal';
dayjs.extend(customParseFormat);

const TABLE_HEADERS = [
  'Cuarto',
  'Paciente',
  'Cirugía',
  'Medico',
  'Fecha de entrada',
  'Fecha de salida',
  'Estancia estimada',
  'Acciones',
];
const useGetHospitalizationRooms = () => {
  const fetch = useHospitalRoomsPaginationStore((state) => state.fetchData);
  const data = useHospitalRoomsPaginationStore((state) => state.data);
  const isLoading = useHospitalRoomsPaginationStore((state) => state.loading);
  const search = useHospitalRoomsPaginationStore((state) => state.search);
  const pageSize = useHospitalRoomsPaginationStore((state) => state.pageSize);
  const pageIndex = useHospitalRoomsPaginationStore((state) => state.pageIndex);
  const setPageIndex = useHospitalRoomsPaginationStore((state) => state.setPageIndex);
  const setPageSize = useHospitalRoomsPaginationStore((state) => state.setPageSize);
  const count = useHospitalRoomsPaginationStore((state) => state.count);

  useEffect(() => {
    fetch();
  }, [search, pageSize, pageIndex]);
  return { data, isLoading, pageSize, pageIndex, count, setPageIndex, setPageSize };
};
export const HospitalRoomsTable = () => {
  const { data, isLoading, pageSize, pageIndex, count, setPageIndex, setPageSize } = useGetHospitalizationRooms();

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={TABLE_HEADERS} />
          {data.length > 0 && (
            <>
              <TableBody>
                {data.map((room) => (
                  <HospitalRoomsTableRow data={room} key={room.id_IngresoPaciente} />
                ))}
              </TableBody>
              <TableFooterComponent
                count={count}
                pageIndex={pageIndex}
                pageSize={pageSize}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                isLoading={isLoading}
              />
            </>
          )}
        </Table>
      </TableContainer>
      {data.length < 1 && <NoDataInTableInfo infoTitle="No hay cuartos registrados" />}
    </Card>
  );
};

const HospitalRoomsTableRow = (props: { data: IHospitalRoomInformationPagination }) => {
  const { data } = props;
  const [open, setOpen] = useState(false);
  const [openNurseRequest, setOpenNurseRequest] = useState(false);
  const startDate = dayjs(data.fechaIngreso, 'DD/MM/YYYY HH:mm');
  const endDate = dayjs(data.fechaSalida, 'DD/MM/YYYY HH:mm');
  const diffHours = endDate.diff(startDate, 'hour');
  const diffMinutes = endDate.diff(startDate, 'minute') % 60;
  const formattedDiff = `${diffHours} horas y ${diffMinutes} minutos`;
  const { data: warehousePharmacyData } = useGetPharmacyConfig();
  const setData = useHospitalRoomsPaginationStore((state) => state.setData);
  const dataList = useHospitalRoomsPaginationStore((state) => state.data);
  const [openDischargeModal, setOpenDischargeModal] = useState(false);

  const patientName = data.nombrePaciente;
  const medicName = data.medico;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleDateButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateAccept = (newDate: Date) => {
    Swal.fire({
      title: 'Fecha de salida',
      text: `Fecha de salida sera ${newDate.toLocaleDateString()} ${newDate.toLocaleTimeString()}`,
      icon: 'info',
      confirmButtonText: 'Confirmar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: async () => {
        try {
          await updateHospitalRoomExitDate(data.id_CuentaEspacioHospitalario, newDate);
          Swal.fire({
            title: 'Fecha de salida actualizada',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
          setData(dataList.filter((item) => item.id_CuentaEspacioHospitalario !== data.id_CuentaEspacioHospitalario));
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: 'Error',
            text: 'Error al actualizar la fecha de salida',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      },
    });
  };

  return (
    <>
      <TableRow
        onClick={() => {
          setOpen(true);
        }}
        sx={{
          cursor: 'pointer',
          transition: '0.2s linear',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.07)',
            transition: '0.2s linear',
            '&:focus': {
              outline: 'none',
            },
          },
        }}
      >
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', columnGap: 0.5 }}>
            {data.enfermero ? (
              <Tooltip title="Enfermero Asignado">
                <Check color="success" />
              </Tooltip>
            ) : (
              <Tooltip title="Enfermero sin asignar">
                <Warning color="warning" />
              </Tooltip>
            )}
            <Typography sx={{ fontSize: 12, fontWeight: 400 }}>{data.nombreCuarto}</Typography>
          </Box>
        </TableCell>
        <TableCell>{data.nombrePaciente ? patientName : 'Sin asignar'}</TableCell>
        <TableCell>
          <SurgeryProceduresChip surgeries={[]} />
        </TableCell>
        <TableCell>{data.medico ? medicName : 'Sin asignar'}</TableCell>
        <TableCell>{data.fechaIngreso}</TableCell>
        <TableCell>{data.fechaSalida}</TableCell>
        <TableCell>{formattedDiff}</TableCell>
        <TableCell>
          <>
            {data.altaMedica ? (
              <>
                <Tooltip title="Asignar Fecha de Salida">
                  <IconButton onClick={handleDateButtonClick}>
                    <EventAvailable />
                  </IconButton>
                </Tooltip>
                <DateExitPopover
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  onAccept={handleDateAccept}
                  title="Fecha de salida"
                />
              </>
            ) : (
              <Tooltip title="Alta médica">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setOpenDischargeModal(true);
                  }}
                >
                  <CheckCircleOutlineOutlined />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Ver Información">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setOpen(true);
                }}
              >
                <InfoOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Solicitud de Medicamentos">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setOpenNurseRequest(true);
                }}
              >
                <MedicationOutlined />
              </IconButton>
            </Tooltip>
          </>
        </TableCell>
      </TableRow>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <>
          <HospitalRoomInformationModal hospitalSpaceAccountId={data.id_CuentaEspacioHospitalario} setOpen={setOpen} fromHospitalRoom />
        </>
      </Modal>
      <Modal open={openNurseRequest} onClose={() => setOpenNurseRequest(false)}>
        <>
          <NurseRequestModal
            setOpen={setOpenNurseRequest}
            refetch={fetch}
            warehouseId={warehousePharmacyData.id_Almacen}
            id_Patient={data.id_Paciente}
            id_PatientRoom={data.id_Cuarto}
            id_PatientAdmission={data.id_IngresoPaciente}
          />
        </>
      </Modal>
      <Modal open={openDischargeModal} onClose={() => setOpenDischargeModal(false)}>
        <>
          <PatientDischargeModal
            setOpen={setOpenDischargeModal}
            patientName={data.nombrePaciente}
            medicName={data.medico}
            admissionReason={data.motivoIngreso}
            surgeries={data.cirugias}
            id_IngresoPaciente={data.id_IngresoPaciente}
          />
        </>
      </Modal>
    </>
  );
};
