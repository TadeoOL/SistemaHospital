import {
  Box,
  Card,
  CircularProgress,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { IRoomInformation } from '../../../types/operatingRoom/operatingRoomTypes';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { SurgeryProceduresChip } from '../../Commons/SurgeryProceduresChip';
import { AllSurgeryInfoModal } from '../../OperatingRoom/DailyOperating/Modal/AllSurgeryInfoModal';
import { useAssignedRoomsPaginationStore } from '../../../store/hospitalization/assignedRoomsPagination';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';

const TABLE_HEADERS = [
  'Cuarto',
  'Paciente',
  'Cirugía',
  'Medico',
  'Fecha de entrada',
  'Fecha de salida',
  'Estancia estimada',
];

const useGetAssignedRooms = () => {
  const fetch = useAssignedRoomsPaginationStore((state) => state.fetchData);
  const data = useAssignedRoomsPaginationStore((state) => state.data);
  const isLoading = useAssignedRoomsPaginationStore((state) => state.loading);
  const search = useAssignedRoomsPaginationStore((state) => state.search);
  const pageSize = useAssignedRoomsPaginationStore((state) => state.pageSize);
  const pageIndex = useAssignedRoomsPaginationStore((state) => state.pageIndex);
  const setPageIndex = useAssignedRoomsPaginationStore((state) => state.setPageIndex);
  const setPageSize = useAssignedRoomsPaginationStore((state) => state.setPageSize);
  const count = useAssignedRoomsPaginationStore((state) => state.count);

  useEffect(() => {
    fetch();
  }, [search, pageSize, pageIndex]);
  return { data, isLoading, pageSize, pageIndex, count, setPageIndex, setPageSize };
};

export const AssignedRoomsTable = () => {
  const { data, isLoading, pageSize, pageIndex, count, setPageIndex, setPageSize } = useGetAssignedRooms();

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
                {data.map((d) => (
                  <AssignedRoomsTableRow data={d} key={d.id} />
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
      {data.length === 0 && <NoDataInTableInfo infoTitle="No hay cuartos asignados" />}
    </Card>
  );
};

const AssignedRoomsTableRow = (props: { data: IRoomInformation }) => {
  const { data } = props;
  const [open, setOpen] = useState(false);
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
        <TableCell>{data.nombre}</TableCell>
        <TableCell>{data.paciente?.nombre ? patientName : 'Sin asignar'}</TableCell>
        <TableCell>
          <SurgeryProceduresChip surgeries={data.procedimientos ?? []} />
        </TableCell>
        <TableCell>{data.medico ? medicName : 'Sin asignar'}</TableCell>
        <TableCell>{dayjs(data.horaInicio).format('DD/MM/YYYY - HH:mm')}</TableCell>
        <TableCell>{dayjs(data.horaFin).format('DD/MM/YYYY - HH:mm')}</TableCell>
        <TableCell>{formattedDiff}</TableCell>
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
    </>
  );
};
