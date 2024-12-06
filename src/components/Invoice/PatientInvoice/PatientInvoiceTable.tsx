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
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { useEffect, useState } from 'react';
import { useInvoicePatientBillPaginationStore } from '../../../store/invoice/invoicePatientBillPagination';
import { InvoicePatientBillPagination } from '../../../types/invoiceTypes';
import { GenericChip } from '../../Commons/GenericChip';
import { CheckCircle, Info } from '@mui/icons-material';
import { FaFileInvoice } from 'react-icons/fa6';
import { GeneratePatientAccountInvoice } from './Modal/GeneratePatientAccountInvoice';

const TABLE_HEADERS = ['Clave Paciente', 'Nombre', 'Medico', 'Procedimientos', 'Acciones'];

const useGetPaginationData = () => {
  const fetch = useInvoicePatientBillPaginationStore((state) => state.fetchData);
  const data = useInvoicePatientBillPaginationStore((state) => state.data);
  const isLoading = useInvoicePatientBillPaginationStore((state) => state.loading);
  const search = useInvoicePatientBillPaginationStore((state) => state.search);
  const pageSize = useInvoicePatientBillPaginationStore((state) => state.pageSize);
  const pageIndex = useInvoicePatientBillPaginationStore((state) => state.pageIndex);
  const setPageIndex = useInvoicePatientBillPaginationStore((state) => state.setPageIndex);
  const setPageSize = useInvoicePatientBillPaginationStore((state) => state.setPageSize);
  const count = useInvoicePatientBillPaginationStore((state) => state.count);

  useEffect(() => {
    fetch();
  }, [search, pageSize, pageIndex]);

  return {
    data,
    isLoading,
    pageSize,
    pageIndex,
    count,
    setPageIndex,
    setPageSize,
  };
};
export const PatientInvoiceTable = () => {
  const { count, data, isLoading, pageIndex, pageSize, setPageIndex, setPageSize } = useGetPaginationData();

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
          <TableBody>
            {data.map((d) => (
              <PatientInvoiceTableRow data={d} key={d.clavePaciente} />
            ))}
          </TableBody>
          {data && data.length > 0 && (
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
      {(!data || data.length < 1) && <NoDataInTableInfo infoTitle="No hay pacientes" />}
    </Card>
  );
};
interface PatientInvoiceTableRowProps {
  data: InvoicePatientBillPagination;
}
const PatientInvoiceTableRow = ({ data }: PatientInvoiceTableRowProps) => {
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => {
    setOpen(true);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 0.5 }}>
            {data.facturada ? (
              <Tooltip title="Facturación realizada">
                <CheckCircle color="success" />
              </Tooltip>
            ) : (
              <Tooltip title="Pendiente por facturar">
                <Info color="info" />
              </Tooltip>
            )}
            {data.clavePaciente}
          </Box>
        </TableCell>
        <TableCell>{data.paciente}</TableCell>
        <TableCell>{data.medico}</TableCell>
        <TableCell>
          <GenericChip
            data={data.cirugias.map((p, i) => {
              return { id: i.toString(), nombre: p };
            })}
          />
        </TableCell>
        <TableCell>
          <Tooltip title="Generar factura">
            <IconButton onClick={handleOpenModal}>
              <FaFileInvoice style={{ color: 'gray' }} />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <Modal open={open}>
        <>
          <GeneratePatientAccountInvoice
            patientName={data.paciente}
            setOpen={setOpen}
            patientKey={data.clavePaciente}
            patientAccountId={data.id_CuentaPaciente}
            //patientId={data.id_CuentaPaciente}
          />
        </>
      </Modal>
    </>
  );
};
