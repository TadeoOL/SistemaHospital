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
import { Discount, Edit, Print, ReceiptLong, Visibility } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { usePatientAccountPaginationStore } from '../../../store/checkout/patientAcountsPagination';
import { CloseAccountModal } from './Modal/CloseAccount';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { DiscountModal } from './Modal/DiscountModal';
import { useGetDiscountConfig } from '../../../hooks/admission/useGetDiscountConfig';
import { useAuthStore } from '../../../store/auth';
import {
  DepositType,
  IPatientAccount,
  IPatientAccountPagination,
  PatientAccountStatus,
  PatientAccountStatusLabels,
} from '../../../types/checkout/patientAccountTypes';
import { createPatientAccountDeposit, getPatientAccount } from '../../../services/checkout/patientAccount';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useConnectionSocket } from '../../../store/checkout/connectionSocket';
import { generateAccountPDF } from './generateAccountPDF';
const HEADERS = ['Nombre Completo', 'Espacios Hospitalarios', 'Medico', 'Fecha Apertura', 'Estatus', 'Acciones'];

interface PatientAccountTableBodyProps {
  data: IPatientAccountPagination[];
  discountConfig: { id: string; name: string }[];
  status: number;
}

interface PatientAccountTableRowProps {
  data: IPatientAccountPagination;
  discountConfig: { id: string; name: string }[];
  status: number;
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
          <PatientAccountTableBody data={data} discountConfig={discountConfig} status={status} />
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
        <PatientAccountTableRow
          key={a.id_CuentaPaciente}
          data={a}
          discountConfig={props.discountConfig}
          status={props.status}
        />
      ))}
    </TableBody>
  );
};

const PatientAccountTableRow = (props: PatientAccountTableRowProps) => {
  const [open, setOpen] = useState(false);
  const [openPrint, setOpenPrint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = props;
  const [accountInfo, setAccountInfo] = useState<IPatientAccount | null>(null);
  const isAdmin = useAuthStore((state) => state.profile?.roles.includes('ADMIN'));
  const userId = useAuthStore((state) => state.profile?.id);
  const [viewOnly, setViewOnly] = useState(false);
  const conn = useConnectionSocket((state) => state.conn);
  const fetchData = usePatientAccountPaginationStore((state) => state.fetchData);

  const handleEdit = () => {
    setOpen(true);
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

  const handleGenerateCheckout = () => {
    Swal.fire({
      title: '¿Estás seguro de querer generar el pase de caja?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true,
      preConfirm: async () => {
        if (conn === null) {
          toast.error('Error, sin conexión al websocket');
          return;
        }
        try {
          const object = {
            id_CuentaPaciente: data.id_CuentaPaciente,
            cantidad: data.totalVenta,
            tipoDeposito: DepositType.Settlement,
          };
          const res = await createPatientAccountDeposit(object);
          const resObj = {
            estatus: res.estadoVenta,
            folio: res.folio,
            id_VentaPrincipal: res.id,
            moduloProveniente: 'Cierre cuenta',
            paciente: data.nombreCompleto,
            totalVenta: res.totalVenta,
            tipoPago: res.tipoPago,
            id_UsuarioPase: res.id_UsuarioVenta,
            nombreUsuario: res.usuarioVenta?.nombre,
          };
          conn.invoke('SendSell', resObj);
          Swal.fire('Success', 'Pase de caja generado correctamente', 'success');
          fetchData();
        } catch (error) {
          Swal.fire('Error', 'Error al generar el pase de caja', 'error');
        }
      },
    });
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
                    setViewOnly(true);
                    setOpen(true);
                  }}
                >
                  <Visibility color="primary" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </TableCell>
      </TableRow>
      <CloseAccountModal id_Cuenta={data.id_CuentaPaciente} setOpen={setOpen} viewOnly={viewOnly} open={open} />
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
