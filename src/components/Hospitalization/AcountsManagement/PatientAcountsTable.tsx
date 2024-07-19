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
} from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { Edit } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { IPatientAccount } from '../../../types/admissionTypes';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { usePatientAccountPaginationStore } from '../../../store/hospitalization/patientAcountsPagination';
import { CloseAccountModal } from './Modal/CloseAccount';

const HEADERS = ['Nombre Completo', 'ID Paciente', 'ID Cuenta', 'Acciones'];

interface PatientAccountTableBodyProps {
  data: IPatientAccount[];
}

interface PatientAccountTableRowProps {
  data: IPatientAccount;
}

const useGetPatientAccountData = () => {
  const fetchData = usePatientAccountPaginationStore((state) => state.fetchData);
  const data = usePatientAccountPaginationStore((state) => state.data);
  const search = usePatientAccountPaginationStore((state) => state.search);
  const pageSize = usePatientAccountPaginationStore((state) => state.pageSize);
  const pageIndex = usePatientAccountPaginationStore((state) => state.pageIndex);
  const setPageIndex = usePatientAccountPaginationStore((state) => state.setPageIndex);
  const setPageSize = usePatientAccountPaginationStore((state) => state.setPageSize);
  const count = usePatientAccountPaginationStore((state) => state.count);
  const isLoading = usePatientAccountPaginationStore((state) => state.loading);

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

export const PatientAccountTable = () => {
  const { data, pageIndex, setPageIndex, setPageSize, count, isLoading, pageSize } = useGetPatientAccountData();

  if (isLoading && data.length === 0)
    return (
      <Box sx={{ display: 'flex', p: 4, justifyContent: 'center' }}>
        <CircularProgress size={35} />
      </Box>
    );

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={HEADERS} />
          <PatientAccountTableBody data={data} />
          {data.length > 0 && (
            <TableFooterComponent
              count={count}
              pageIndex={pageIndex}
              pageSize={pageSize}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              isLoading={isLoading}
            />
          )}
        </Table>
      </TableContainer>
      {data.length === 0 && <NoDataInTableInfo infoTitle="No hay registros" />}
    </Card>
  );
};

const PatientAccountTableBody = (props: PatientAccountTableBodyProps) => {
  return (
    <TableBody>
      {props.data.map((a) => (
        <PatientAccountTableRow key={a.id_Cuenta} data={a} />
      ))}
    </TableBody>
  );
};

const PatientAccountTableRow = (props: PatientAccountTableRowProps) => {
  const [open, setOpen] = useState(false);
  const { data } = props;

  const handleEdit = () => {
    setOpen(true);
  };

  return (
    <>
      <TableRow>
        <TableCell>{data.nombreCompleto}</TableCell>
        <TableCell>{data.id_Paciente}</TableCell>
        <TableCell>{data.id_Cuenta}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Cerrar">
              <IconButton onClick={handleEdit}>
                <Edit color="primary" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <CloseAccountModal id_Cuenta={data.id_Cuenta} id_Paciente={data.id_Paciente} setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
