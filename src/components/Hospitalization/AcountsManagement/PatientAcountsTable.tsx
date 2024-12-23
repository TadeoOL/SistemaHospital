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
import { Edit, Print, Visibility } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { usePatientAccountPaginationStore } from '../../../store/checkout/patientAcountsPagination';
import { CloseAccountModal } from './Modal/CloseAccount';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { useGetDiscountConfig } from '../../../hooks/admission/useGetDiscountConfig';
import { useAuthStore } from '../../../store/auth';
import {
  IPatientAccount,
  IPatientAccountPagination,
  PatientAccountStatus,
  PatientAccountStatusLabels,
} from '../../../types/checkout/patientAccountTypes';
import { generateAccountPDF } from './generateAccountPDF';
import { getPatientAccount } from '@/services/checkout/patientAccount';
const HEADERS = ['Nombre Completo', 'Espacios Hospitalarios', 'Medico', 'Fecha Apertura', 'Estatus', 'Acciones'];
interface PatientAccountTableBodyProps {
  data: IPatientAccountPagination[];
  discountConfig: { id: string; name: string }[];
  status: number;
  setViewOnly: Function;
  setOpen: Function;
  setBillSelected: Function;
}

interface PatientAccountTableRowProps {
  data: IPatientAccountPagination;
  discountConfig: { id: string; name: string }[];
  status: number;
  setViewOnly: Function;
  setOpen: Function;
  setBillSelected: Function;
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

export const PatientAccountTable = ({ status }: { status: number }) => {
  const { data, pageIndex, setPageIndex, setPageSize, count, isLoading, pageSize } = useGetPatientAccountData();
  const { data: discountConfig, isLoading: isLoadingDiscountConfig } = useGetDiscountConfig();
  const [open, setOpen] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [billSelected, setBillSelected] = useState<IPatientAccountPagination | null>(null);

  if ((isLoading && data.length === 0) || isLoadingDiscountConfig)
    return (
      <Box sx={{ display: 'flex', p: 4, justifyContent: 'center' }}>
        <CircularProgress size={35} />
      </Box>
    );

  return (
    <>
      <Card>
        <TableContainer>
          <Table>
            <TableHeaderComponent headers={HEADERS} />
            <PatientAccountTableBody
              data={data}
              discountConfig={discountConfig}
              status={status}
              setOpen={setOpen}
              setViewOnly={setViewOnly}
              setBillSelected={setBillSelected}
            />
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
      <CloseAccountModal
        id_Cuenta={billSelected?.id_CuentaPaciente ?? ''}
        setOpen={setOpen}
        viewOnly={viewOnly}
        open={open}
      />
    </>
  );
};

const PatientAccountTableBody = (props: PatientAccountTableBodyProps) => {
  return (
    <TableBody>
      {props.data.map((a) => (
        <PatientAccountTableRow
          key={a.id_CuentaPaciente}
          data={a}
          discountConfig={props.discountConfig}
          status={props.status}
          setOpen={props.setOpen}
          setViewOnly={props.setViewOnly}
          setBillSelected={props.setBillSelected}
        />
      ))}
    </TableBody>
  );
};

const PatientAccountTableRow = (props: PatientAccountTableRowProps) => {
  const [openPrint, setOpenPrint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = props;
  const [accountInfo, setAccountInfo] = useState<IPatientAccount | null>(null);
  const isAdmin = useAuthStore((state) => state.profile?.roles.includes('ADMIN'));
  const userId = useAuthStore((state) => state.profile?.id);

  const handleEdit = () => {
    props.setOpen(true);
    props.setBillSelected(data);
  };

  const handleOpenPDF = async () => {
    setIsLoading(true);
    try {
      const accountRes = await getPatientAccount(data.id_CuentaPaciente);
      setAccountInfo(accountRes);
      generateAccountPDF(accountRes);
      // const document = (
      //   <BillCloseReport
      //     cierreCuenta={accountInfo as any}
      //     descuento={undefined}
      //     total={accountInfo?.total}
      //     notas={undefined}
      //   />
      // );
      // // Generar el PDF en formato blob
      // const blob = await pdf(document).toBlob();
      // // Crear una URL para el blob y abrir una nueva pestaña
      // const url = URL.createObjectURL(blob);
      // window.open(url);
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
        <TableCell>{data.espaciosHospitalarios?.join(', ')}</TableCell>
        <TableCell>{data.medico}</TableCell>
        <TableCell>{data.fechaIngreso}</TableCell>
        <TableCell>{PatientAccountStatusLabels[data.estatus as PatientAccountStatus]}</TableCell>
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
            {(isAdmin || props.discountConfig.find((x) => x.id === userId)) &&
              data.estatus === PatientAccountStatus.Closed &&
              !data.paseCaja && (
                <>
                  {/* <Tooltip title="Aplicar descuento">
                    <IconButton onClick={() => setOpenDiscount(true)}>
                      <Discount color="success" />
                    </IconButton>
                  </Tooltip> */}
                  {/* <Tooltip title="Pase de caja">
                    <IconButton onClick={handleGenerateCheckout}>
                      <ReceiptLong color="primary" />
                    </IconButton>
                  </Tooltip> */}
                </>
              )}
            {data.estatus !== PatientAccountStatus.Scheduled && (
              <Tooltip title="Ver cuenta">
                <IconButton
                  onClick={() => {
                    props.setViewOnly(true);
                    props.setOpen(true);
                    props.setBillSelected(data);
                  }}
                >
                  <Visibility color="primary" />
                </IconButton>
              </Tooltip>
            )}
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
