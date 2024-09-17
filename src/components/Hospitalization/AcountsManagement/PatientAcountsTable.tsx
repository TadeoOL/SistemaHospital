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
import { Discount, Edit, Print } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { IPatientAccount } from '../../../types/admissionTypes';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { usePatientAccountPaginationStore } from '../../../store/hospitalization/patientAcountsPagination';
import { CloseAccountModal } from './Modal/CloseAccount';
import { IAcountAllInformation } from '../../../types/hospitalizationTypes';
import { pdf } from '@react-pdf/renderer';
import { BillCloseReport } from '../../Export/Account/BillCloseReport';
import { getAccountFullInformation } from '../../../services/programming/admissionRegisterService';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { DiscountModal } from './Modal/DiscountModal';
import { useGetDiscountConfig } from '../../../hooks/admission/useGetDiscountConfig';
import { useAuthStore } from '../../../store/auth';

const HEADERS = ['Nombre Completo', 'Cuartos', 'Medico', 'Fecha Apertura', 'Estatus', 'Acciones'];

interface PatientAccountTableBodyProps {
  data: IPatientAccount[];
  discountConfig: { id: string; name: string }[];
}

interface PatientAccountTableRowProps {
  data: IPatientAccount;
  discountConfig: { id: string; name: string }[];
}

const useGetPatientAccountData = () => {
  const fetchData = usePatientAccountPaginationStore((state) => state.fetchData);
  const data = usePatientAccountPaginationStore((state) => state.data);
  const search = usePatientAccountPaginationStore((state) => state.search);
  const status = usePatientAccountPaginationStore((state) => state.status);
  const pageSize = usePatientAccountPaginationStore((state) => state.pageSize);
  const pageIndex = usePatientAccountPaginationStore((state) => state.pageIndex);
  const setPageIndex = usePatientAccountPaginationStore((state) => state.setPageIndex);
  const setPageSize = usePatientAccountPaginationStore((state) => state.setPageSize);
  const count = usePatientAccountPaginationStore((state) => state.count);
  const isLoading = usePatientAccountPaginationStore((state) => state.loading);

  useEffect(() => {
    fetchData();
  }, [search, pageIndex, pageSize, status]);

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
  const { data: discountConfig, isLoading: isLoadingDiscountConfig } = useGetDiscountConfig();

  if ((isLoading && data.length === 0) || isLoadingDiscountConfig)
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
          <PatientAccountTableBody data={data} discountConfig={discountConfig} />
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
        <PatientAccountTableRow key={a.id_Cuenta} data={a} discountConfig={props.discountConfig} />
      ))}
    </TableBody>
  );
};

const PatientAccountTableRow = (props: PatientAccountTableRowProps) => {
  const [open, setOpen] = useState(false);
  const [openPrint, setOpenPrint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = props;
  const [accountInfo, setAccountInfo] = useState<IAcountAllInformation | null>(null);
  const [openDiscount, setOpenDiscount] = useState(false);
  const isAdmin = useAuthStore((state) => state.profile?.roles.includes('ADMIN'));
  const userId = useAuthStore((state) => state.profile?.id);

  const handleEdit = () => {
    setOpen(true);
  };

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
            {data.estatus === 1 ? (
              <Tooltip title="Cerrar">
                <IconButton onClick={handleEdit}>
                  <Edit color="primary" />
                </IconButton>
              </Tooltip>
            ) : (
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
            )}
            {(isAdmin || props.discountConfig.find((x) => x.id === userId)) && (
              <Tooltip title="Aplicar descuento">
                <IconButton onClick={() => setOpenDiscount(true)}>
                  <Discount color="success" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </TableCell>
      </TableRow>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <CloseAccountModal id_Cuenta={data.id_Cuenta} id_Paciente={data.id_Paciente} setOpen={setOpen} />
        </>
      </Modal>
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
      <Modal open={openDiscount} onClose={() => setOpenDiscount(false)}>
        <>
          <DiscountModal setOpen={setOpenDiscount} Id_CuentaPaciente={data.id_Cuenta} />
        </>
      </Modal>
    </>
  );
};
