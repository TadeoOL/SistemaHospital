import {
  Box,
  Card,
  Chip,
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
import { CheckCircle, Close, Edit } from '@mui/icons-material';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { IProgrammingRequestPagination } from '../../../types/admissionTypes';
import { useEffect } from 'react';
import { useProgrammingRequestPaginationStore } from '../../../store/programming/programmingRequestPagination';
import dayjs from 'dayjs';
const HEADERS = [
  'Nombre paciente',
  'Nombre Medico',
  'Procedimiento',
  'Programación sugerida',
  'Tipo de ingreso',
  'Acciones',
];
interface TableRowProgrammingRequest {
  data: IProgrammingRequestPagination;
}
interface TableBodyProgrammingRequest {
  data: IProgrammingRequestPagination[];
}
const useGetProgrammingRequestData = () => {
  const fetchData = useProgrammingRequestPaginationStore((state) => state.fetchData);
  const data = useProgrammingRequestPaginationStore((state) => state.data);
  const search = useProgrammingRequestPaginationStore((state) => state.search);
  const pageSize = useProgrammingRequestPaginationStore((state) => state.pageSize);
  const pageIndex = useProgrammingRequestPaginationStore((state) => state.pageIndex);
  const setPageIndex = useProgrammingRequestPaginationStore((state) => state.setPageIndex);
  const setPageSize = useProgrammingRequestPaginationStore((state) => state.setPageSize);
  const count = useProgrammingRequestPaginationStore((state) => state.count);
  const isLoading = useProgrammingRequestPaginationStore((state) => state.loading);

  useEffect(() => {
    fetchData();
  }, [search, pageIndex, pageSize]);

  return {
    data,
    pageIndex,
    setPageIndex,
    setPageSize,
    count,
    isLoading,
    pageSize,
  };
};
export const ProgrammingRequestTable = () => {
  const { count, data, isLoading, pageIndex, pageSize, setPageIndex, setPageSize } = useGetProgrammingRequestData();

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 4 }}>
        <CircularProgress size={30} />
      </Box>
    );
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={HEADERS} />
          <TableBodyProgrammingRequest data={data} />
          {data.length > 0 && (
            <TableFooterComponent
              count={count}
              pageIndex={pageIndex}
              pageSize={pageSize}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
            />
          )}
        </Table>
      </TableContainer>
      {data.length === 0 && (
        <NoDataInTableInfo infoTitle="No hay solicitudes de programación" sizeIcon={40} variantText="h3" />
      )}
    </Card>
  );
};

const TableBodyProgrammingRequest = (props: TableBodyProgrammingRequest) => {
  return (
    <TableBody>
      {props.data.map((pr) => (
        <TableRowProgrammingRequest data={pr} key={pr.id} />
      ))}
    </TableBody>
  );
};

const TableRowProgrammingRequest = (props: TableRowProgrammingRequest) => {
  const { data } = props;
  return (
    <TableRow>
      <TableCell>{data.nombrePaciente}</TableCell>
      <TableCell>{data.nombreMedico}</TableCell>
      <TableCell>
        <ProceduresChips procedures={data.procedimientos} />
      </TableCell>
      <TableCell>{dayjs(data.fechaSugerida).format('DD-MM-YYYY HH:mm')}</TableCell>
      <TableCell>{data.recomendacionMedica ? 'Por medico' : 'Por su cuenta'}</TableCell>
      <TableCell>
        <Box>
          <Tooltip title="Aceptar">
            <IconButton>
              <CheckCircle color="success" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton>
              <Edit color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancelar">
            <IconButton>
              <Close color="error" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};

const ProceduresChips = (props: { procedures: { id: string; nombre: string }[] }) => {
  const { procedures } = props;
  const displayedProcedures = procedures.slice(0, 2);
  const remainingProcedures = procedures.slice(2);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {displayedProcedures.map((procedure) => (
        <Chip key={procedure.id} label={procedure.nombre} style={{ margin: 2 }} />
      ))}
      {remainingProcedures.length > 0 && (
        <Tooltip
          title={
            <div>
              {remainingProcedures.map((procedure) => (
                <div key={procedure.id}>{procedure.nombre}</div>
              ))}
            </div>
          }
        >
          <Chip label={`+${remainingProcedures.length}`} style={{ margin: 2 }} />
        </Tooltip>
      )}
    </Box>
  );
};
