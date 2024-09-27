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
import { useSurgeriesHistoryPagination } from '../../../store/operatingRoom/surgeriesHistoryPagination';
import { useEffect, useState } from 'react';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { ISurgeryHistory } from '../../../types/operatingRoomTypes';
import dayjs from 'dayjs';
import { SurgeryProceduresChip } from '../../Commons/SurgeryProceduresChip';
import { AllSurgeryInfoModal } from './Modal/AllSurgeryInfoModal';
const HEADERS = ['Hora', 'Duración', 'Quirófano', 'Paciente', 'Cirugia', 'Cirujano', 'Anestesiologo'];

const useGetSurgeriesHistory = () => {
  const fetch = useSurgeriesHistoryPagination((state) => state.fetchData);
  const data = useSurgeriesHistoryPagination((state) => state.data);
  const isLoading = useSurgeriesHistoryPagination((state) => state.loading);
  const search = useSurgeriesHistoryPagination((state) => state.search);
  const pageSize = useSurgeriesHistoryPagination((state) => state.pageSize);
  const pageIndex = useSurgeriesHistoryPagination((state) => state.pageIndex);
  const setPageIndex = useSurgeriesHistoryPagination((state) => state.setPageIndex);
  const setPageSize = useSurgeriesHistoryPagination((state) => state.setPageSize);
  const count = useSurgeriesHistoryPagination((state) => state.count);
  const dateFilter = useSurgeriesHistoryPagination((state) => state.dateFilter);

  useEffect(() => {
    fetch();
  }, [search, pageSize, pageIndex, dateFilter]);
  return { data, isLoading, setPageIndex, setPageSize, count, pageIndex };
};

export const DailyOperatingHistoryTable = () => {
  const { data, isLoading, count, setPageIndex, setPageSize, pageIndex } = useGetSurgeriesHistory();
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
          <TableHeaderComponent headers={HEADERS} />
          {data.length > 0 && (
            <>
              <TableBody>
                {data.map((d) => (
                  <DailyOperatingHistoryTableRow key={d.id} data={d} />
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
      {data.length === 0 && <NoDataInTableInfo infoTitle="No hay cirugías registradas" />}
    </Card>
  );
};

const DailyOperatingHistoryTableRow = (props: { data: ISurgeryHistory }) => {
  const { data } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        sx={{
          transition: '0.1s ease-in-out',
          '&:hover': {
            cursor: 'pointer',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            transition: '0.1s ease-in-out',
          },
        }}
      >
        <TableCell>{dayjs(data.horaInicio).format('HH:mm') + ' - ' + dayjs(data.horaFin).format('HH:mm')}</TableCell>
        <TableCell>{data.duracion}</TableCell>
        <TableCell>{data.nombre}</TableCell>
        <TableCell>{data.paciente}</TableCell>
        <TableCell>
          <SurgeryProceduresChip surgeries={data.procedimientos} />
        </TableCell>
        <TableCell>{data.medico}</TableCell>
        <TableCell>{data.anestesiologo}</TableCell>
      </TableRow>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <AllSurgeryInfoModal setOpen={setOpen} roomId={data.id} />
        </>
      </Modal>
    </>
  );
};
