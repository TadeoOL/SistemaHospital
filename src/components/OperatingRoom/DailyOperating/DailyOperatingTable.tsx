import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { IDailyOperatingRoom } from '../../../types/operatingRoomTypes';
import { useDailyOperatingRoomsPaginationStore } from '../../../store/operatingRoom/dailyOperatingRoomsPagination';
import { useEffect } from 'react';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import dayjs from 'dayjs';
import { Edit } from '@mui/icons-material';

const TABLE_HEADERS = [
  'Hora',
  'Quirófano',
  'Paciente',
  'Edad',
  'Cirugía',
  'Medico',
  'Anestesiólogo',
  'Tiempo',
  'Acciones',
];

const useGetDailyOperatingRooms = () => {
  const fetch = useDailyOperatingRoomsPaginationStore((state) => state.fetchData);
  const data = useDailyOperatingRoomsPaginationStore((state) => state.data);
  const isLoading = useDailyOperatingRoomsPaginationStore((state) => state.loading);
  const search = useDailyOperatingRoomsPaginationStore((state) => state.search);
  const pageSize = useDailyOperatingRoomsPaginationStore((state) => state.pageSize);
  const pageIndex = useDailyOperatingRoomsPaginationStore((state) => state.pageIndex);
  const setPageIndex = useDailyOperatingRoomsPaginationStore((state) => state.setPageIndex);
  const setPageSize = useDailyOperatingRoomsPaginationStore((state) => state.setPageSize);
  const count = useDailyOperatingRoomsPaginationStore((state) => state.count);
  const operatingRoomId = useDailyOperatingRoomsPaginationStore((state) => state.operatingRoomId);

  useEffect(() => {
    fetch();
  }, [search, pageSize, pageIndex, operatingRoomId]);
  return { data, isLoading, setPageIndex, setPageSize, count, pageIndex };
};
export const DailyOperatingTable = () => {
  const { data, isLoading, count, setPageIndex, setPageSize, pageIndex } = useGetDailyOperatingRooms();

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', flex: 1, p: 4, justifyContent: 'center' }}>
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
                {data.map((d, i) => (
                  <DailyOperatingTableRow key={i} data={d} />
                ))}
              </TableBody>
              <TableFooterComponent
                count={count}
                pageIndex={pageIndex}
                pageSize={10}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                isLoading={isLoading}
              />
            </>
          )}
        </Table>
      </TableContainer>
      {data.length === 0 && <NoDataInTableInfo infoTitle="No hay quirófanos registrados este dia" />}
    </Card>
  );
};

interface DailyOperatingTableRowProps {
  data: IDailyOperatingRoom;
}
const DailyOperatingTableRow = (props: DailyOperatingTableRowProps) => {
  const { data } = props;
  const patientName = data.paciente.nombre + ' ' + data.paciente.apellidoPaterno + ' ' + data.paciente.apellidoMaterno;
  const medicName = data.medico?.nombres + ' ' + data.medico?.apellidoPaterno + ' ' + data.medico?.apellidoMaterno;
  const anesthesiologistName =
    data.anestesiologo?.nombres + ' ' + data.anestesiologo?.apellidoPaterno + ' ' + data.anestesiologo?.apellidoMaterno;
  return (
    <TableRow>
      <TableCell>{dayjs(data.horaInicio).format('HH:mm')}</TableCell>
      <TableCell>{data.nombre}</TableCell>
      <TableCell>{patientName}</TableCell>
      <TableCell>{data.nombre}</TableCell>
      <TableCell>{data.medico ? medicName : 'Sin asignar'}</TableCell>
      <TableCell>{data.anestesiologo ? anesthesiologistName : 'Sin asignar'}</TableCell>
      <TableCell>{dayjs(data.horaFin).diff(data.horaInicio, 'hour')}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="editar">
            <IconButton>
              <Edit />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};
