import {
  Box,
  Button,
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
import { Print } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { IPatientAccount } from '../../../types/admissionTypes';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { IAcountAllInformation } from '../../../types/hospitalizationTypes';
import { pdf } from '@react-pdf/renderer';
import { BillCloseReport } from '../../Export/Account/BillCloseReport';
import { getAccountFullInformation } from '../../../services/programming/admissionRegisterService';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { useOutstandingBillsPaginationStore } from '../../../store/admission/useOutstandingBillsPagination';

const HEADERS = ['Nombre Completo', 'Cuartos', 'Medico', 'Fecha Apertura', 'Estatus', 'Acciones'];

interface OutstandingBillsTableBodyProps {
  data: IPatientAccount[];
}

interface OutstandingBillsTableRowProps {
  data: IPatientAccount;
}

const useGetPatientAccountData = () => {
  const fetchData = useOutstandingBillsPaginationStore((state) => state.fetchData);
  const data = useOutstandingBillsPaginationStore((state) => state.data);
  const search = useOutstandingBillsPaginationStore((state) => state.search);
  const pageSize = useOutstandingBillsPaginationStore((state) => state.pageSize);
  const pageIndex = useOutstandingBillsPaginationStore((state) => state.pageIndex);
  const setPageIndex = useOutstandingBillsPaginationStore((state) => state.setPageIndex);
  const setPageSize = useOutstandingBillsPaginationStore((state) => state.setPageSize);
  const count = useOutstandingBillsPaginationStore((state) => state.count);
  const isLoading = useOutstandingBillsPaginationStore((state) => state.loading);

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

export const OutstandingBillsTable = () => {
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
          <OutstandingBillsTableBody data={data} />
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
      {data.length === 0 && <NoDataInTableInfo infoTitle="No hay cuentas pendientes" />}
    </Card>
  );
};

const OutstandingBillsTableBody = (props: OutstandingBillsTableBodyProps) => {
  return (
    <TableBody>
      {props.data.map((a) => (
        <OutstandingBillsTableRow key={a.id_Cuenta} data={a} />
      ))}
    </TableBody>
  );
};

const OutstandingBillsTableRow = (props: OutstandingBillsTableRowProps) => {
  const [openPrint, setOpenPrint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = props;
  const [accountInfo, setAccountInfo] = useState<IAcountAllInformation | null>(null);

  const handleOpenPDF = async () => {
    setIsLoading(true);
    try {
      const paramURL = `Id_Paciente=${data.id_Paciente}&Id_CuentaPaciente=${data.id_Cuenta}`;
      const accountRes = await getAccountFullInformation(paramURL);
      setAccountInfo(accountRes);

      const document = (
        <BillCloseReport
          cierreCuenta={accountInfo as any}
          descuento={undefined}
          total={accountInfo?.totalPagoCuentaRestante}
          notas={undefined}
        />
      );

      // Generar el PDF en formato blob
      const blob = await pdf(document).toBlob();

      // Crear una URL para el blob y abrir una nueva pestaña
      const url = URL.createObjectURL(blob);
      window.open(url);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      console.log('La cuenta aun no se puede cerrar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>{data.nombreCompleto}</TableCell>
        <TableCell>{data.cuartos}</TableCell>
        <TableCell>{data.medico}</TableCell>
        <TableCell>{data.fechaApertura}</TableCell>
        <TableCell>{data.estatus === 1 ? 'Pendiente' : 'Cerrada'}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Imprimir">
              <IconButton
                onClick={() => {
                  handleOpenPDF();
                }}
                disabled={isLoading}
              >
                <Print color="primary" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
      <Modal
        open={openPrint}
        onClose={() => {
          setOpenPrint(false);
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 380, sm: 550 },
            borderRadius: 2,
            boxShadow: 24,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: { xs: 650 },
          }}
        >
          <HeaderModal setOpen={setOpenPrint} title="PDF cuenta de paciente" />
          <Box sx={{ overflowY: 'auto', bgcolor: 'background.paper', p: 2 }}>
            {accountInfo !== null && !isLoading ? (
              <Button variant="contained" color="primary" disabled={isLoading}>
                {isLoading ? <CircularProgress size={25} /> : 'Ver PDF'}
              </Button>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={35} />
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};
