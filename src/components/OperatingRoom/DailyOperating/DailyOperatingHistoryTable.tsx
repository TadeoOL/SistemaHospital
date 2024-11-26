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
import { GenericChip } from '../../Commons/GenericChip';
import { AllSurgeryInfoModal } from './Modal/AllSurgeryInfoModal';
import { IRoomInformationnew } from '../../../types/operatingRoom/operatingRoomTypes';
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
                  <DailyOperatingHistoryTableRow key={d.id_IngresoPaciente} data={d} />
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

const DailyOperatingHistoryTableRow = (props: { data: IRoomInformationnew }) => {
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
        <TableCell>{data.horaInicio + ' - ' + data.horaFin}</TableCell>
        <TableCell>{data.tiempoEstimado}</TableCell>
        <TableCell>{data.paciente}</TableCell>
        <TableCell>{data.paciente}</TableCell>
        <TableCell>
          <GenericChip data={data.cirugias?.map((cir, i) => ({ id: i.toString(), nombre: cir.nombre })) || []} />
        </TableCell>
        <TableCell>{data.medico}</TableCell>
        <TableCell>{data.anestesiologo}</TableCell>
      </TableRow>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <AllSurgeryInfoModal setOpen={setOpen} roomId={data.id_IngresoPaciente} />
        </>
      </Modal>
    </>
  );
};
