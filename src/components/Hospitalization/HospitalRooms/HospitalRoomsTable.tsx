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
import { IRoomInformation } from '../../../types/operatingRoomTypes';
import { SurgeryProceduresChip } from '../../Commons/SurgeryProceduresChip';
import dayjs from 'dayjs';
import { useHospitalRoomsPaginationStore } from '../../../store/hospitalization/hospitalRoomsPagination';
import { useEffect, useState } from 'react';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { AllSurgeryInfoModal } from '../../OperatingRoom/DailyOperating/Modal/AllSurgeryInfoModal';
import { Check, PersonAdd, Warning } from '@mui/icons-material';
import { AssignNurseModal } from './Modal/AssignNurseModal';

const TABLE_HEADERS = [
  'Cuarto',
  'Paciente',
  'Cirugía',
  'Medico',
  'Fecha de entrada',
  'Fecha de salida',
  'Estancia estimada',
  'Asignar Enfermero',
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
                  <HospitalRoomsTableRow data={room} key={room.id} />
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

const HospitalRoomsTableRow = (props: { data: IRoomInformation }) => {
  const { data } = props;
  const [open, setOpen] = useState(false);
  const [openAssignNurse, setOpenAssignNurse] = useState(false);
  const diffHours = dayjs(data.horaFin).diff(data.horaInicio, 'hour');
  const diffMinutes = dayjs(data.horaFin).diff(data.horaInicio, 'minute') % 60;
  const formattedDiff = `${diffHours} horas y ${diffMinutes} minutos`;

  const patientName =
    data.paciente?.nombre + ' ' + data.paciente?.apellidoPaterno + ' ' + data.paciente?.apellidoMaterno;
  const medicName = data.medico?.nombres + ' ' + data.medico?.apellidoPaterno + ' ' + data.medico?.apellidoMaterno;

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
            {data.enfermeros && data.enfermeros.length > 0 ? (
              <Tooltip title="Enfermero Asignado">
                <Check color="success" />
              </Tooltip>
            ) : (
              <Tooltip title="Enfermero sin asignar">
                <Warning color="warning" />
              </Tooltip>
            )}
            <Typography sx={{ fontSize: 12, fontWeight: 400 }}>{data.nombre}</Typography>
          </Box>
        </TableCell>
        <TableCell>{data.paciente?.nombre ? patientName : 'Sin asignar'}</TableCell>
        <TableCell>
          <SurgeryProceduresChip surgeries={data.procedimientos ?? []} />
        </TableCell>
        <TableCell>{data.medico ? medicName : 'Sin asignar'}</TableCell>
        <TableCell>{dayjs(data.horaInicio).format('DD/MM/YYYY - HH:mm')}</TableCell>
        <TableCell>{dayjs(data.horaFin).format('DD/MM/YYYY - HH:mm')}</TableCell>
        <TableCell>{formattedDiff}</TableCell>
        <TableCell>
          <Tooltip title="Asignar">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setOpenAssignNurse(true);
              }}
            >
              <PersonAdd />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <>
          <AllSurgeryInfoModal setOpen={setOpen} roomId={data.id} isHospitalizationRoom={true} />
        </>
      </Modal>
      <Modal open={openAssignNurse} onClose={() => setOpenAssignNurse(false)}>
        <>
          <AssignNurseModal setOpen={setOpenAssignNurse} nurses={data.enfermeros ?? []} registerRoomId={data.id} />
        </>
      </Modal>
    </>
  );
};
