import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import {
  IAcountAllInformation,
  IPatientInAccount,
  IOperatingRoomsAccount,
} from '../../../../types/hospitalizationTypes';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import {
  closeRegisterAndAccount,
  getAccountFullInformation,
} from '../../../../services/programming/admissionRegisterService';
import { registerSell } from '../../../../services/checkout/checkoutService';
import { useConnectionSocket } from '../../../../store/checkout/connectionSocket';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../store/auth';
import { useShallow } from 'zustand/react/shallow';
import dayjs from 'dayjs';
import { Settings } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getAllOperatingRoomsTypes } from '../../../../services/operatingRoom/operatingRoomRegisterService';
import { updateOperatingRoomType } from '../../../../services/hospitalization/patientBillService';
import { usePatientAccountPaginationStore } from '../../../../store/hospitalization/patientAcountsPagination';
import { pdf } from '@react-pdf/renderer';
import { BillCloseReport } from '../../../Export/Account/BillCloseReport';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 600, xl: 900 },
};
const style2 = {
  bgcolor: 'background.paper',
  p: 2,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey',
  },
};
interface CloseAccountModalProps {
  setOpen: Function;
  id_Cuenta: string;
  id_Paciente: string;
}

export const CloseAccountModal = (props: CloseAccountModalProps) => {
  const conn = useConnectionSocket((state) => state.conn);
  const [isLoading, setIsLoading] = useState(false);
  const [accountInfo, setAccountInfo] = useState<IAcountAllInformation | null>(null);
  const refetch = usePatientAccountPaginationStore((state) => state.fetchData);
  const inputRefDiscount = useRef<HTMLInputElement>(null);
  // const inputRefSurgeryDiscount = useRef<HTMLInputElement>(null);
  const profile = useAuthStore(useShallow((state) => state.profile));
  const [notes, setNotes] = useState('');

  const [discountflag, setDiscountflag] = useState(false);
  const [errorflag, setErrorflag] = useState(true);
  const [discount, setDiscount] = useState('');
  const [discountPercent, setDiscountPrecent] = useState('');

  const [discountSurgeryRoomFlag, _] = useState(false);
  const [surgeryPrice, __] = useState('');
  const [initialSurgeryPrice, setInitialSurgeryPrice] = useState(0);
  const [modified, setModified] = useState(false);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      setIsLoading(true);
      try {
        const paramURL = `Id_Paciente=${props.id_Paciente}&Id_CuentaPaciente=${props.id_Cuenta}`;
        const accountRes = await getAccountFullInformation(paramURL);
        setAccountInfo(accountRes);
        let totalQuirofanos = 0;
        accountRes.quirofanos.forEach((quirofano: IOperatingRoomsAccount) => {
          totalQuirofanos += quirofano.precioTotal;
        });
        setInitialSurgeryPrice(totalQuirofanos);
        setErrorflag(false);
      } catch (error) {
        setErrorflag(true);
        console.log(error);
        console.log('La cuenta aun no se puede cerrar');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountInfo();
  }, [modified]);

  const handleSubmit = async (totalVentaV: number) => {
    if (!accountInfo) {
      toast.error('No se encontro la cuenta');
      return;
    }
    if (
      discountflag &&
      (inputRefDiscount.current === null ||
        inputRefDiscount.current.value === undefined ||
        isNaN(Number(inputRefDiscount.current.value)) ||
        inputRefDiscount.current.value === '')
    ) {
      toast.error('Ingresa un monto valido parar el descuento');
      return;
    }
    if (conn === null) {
      toast.error('Error, sin conexión al websocket');
      return;
    }
    try {
      await closeRegisterAndAccount({
        Id_Registro: accountInfo.id,
        Id_Paciente: props.id_Paciente,
        Id_CuentaPaciente: props.id_Cuenta,
        TotalCuenta: accountInfo.totalPagoCuenta,
        Descuento: discountflag && inputRefDiscount.current ? Number(inputRefDiscount.current.value) : undefined,
        SubTotal: accountInfo.subTotal,
        IVA: accountInfo.iva,
      });
      const object = {
        paciente: `${accountInfo.paciente.nombre || ''} ${accountInfo.paciente.apellidoPaterno || ''} ${accountInfo.paciente.apellidoPaterno || ''}`,
        totalVenta: totalVentaV,
        moduloProveniente: 'Cierre de cuenta',
        id_CuentaPaciente: props.id_Cuenta,
      };
      const res = await registerSell(object);
      const resObj = {
        estatus: res.estadoVenta,
        folio: res.folio,
        id_VentaPrincipal: res.id,
        moduloProveniente: res.moduloProveniente,
        paciente: res.paciente,
        totalVenta: res.totalVenta,
        tipoPago: res.tipoPago,
        id_UsuarioPase: res.id_UsuarioPase,
        nombreUsuario: res.nombreUsuario,
      };
      conn.invoke('SendSell', resObj);

      refetch();
      toast.success('Cierre de cuenta y Pase a caja generado correctamente');
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Error al cerrar la cuenta');
    }
  };

  const acceptRequest = () => {
    let totalVentaV = 0;
    if (discountflag) {
      totalVentaV = parseFloat(discount);
    } else if (discountSurgeryRoomFlag) {
      totalVentaV = parseFloat(
        (
          (accountInfo ? accountInfo.totalPagoCuentaRestante : 0) -
          (initialSurgeryPrice - Number(surgeryPrice))
        ).toFixed(2)
      );
    } else {
      totalVentaV = accountInfo ? accountInfo.totalPagoCuentaRestante : 0;
    }
    withReactContent(Swal).fire({
      title: 'Confirmación',
      text: `¿Estás seguro de CERRAR la cuenta por la cantidad de ${totalVentaV}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        handleSubmit(totalVentaV);
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const handleKeyDownDiscount = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    const regex = /^[0-9.]$/;
    if (
      (!regex.test(key) && event.key !== 'Backspace') || //no numerico y que no sea backspace
      (event.key === '.' && inputRefDiscount.current && inputRefDiscount.current.value.includes('.')) || //punto y ya incluye punto
      (inputRefDiscount.current && Number(inputRefDiscount.current.value + event.key) > 100)
    ) {
      event.preventDefault(); // Evitar la entrada si no es válida
    } else if (
      inputRefDiscount.current &&
      !isNaN(Number(inputRefDiscount.current.value + event.key)) /* && (inputRefDiscount.current.value ! || event.key)*/
    ) {
      setDiscount(
        discountSurgeryRoomFlag
          ? (
              (accountInfo?.totalPagoCuentaRestante || 0) -
              (initialSurgeryPrice - Number(surgeryPrice)) -
              ((accountInfo?.totalPagoCuentaRestante || 0) - (initialSurgeryPrice - Number(surgeryPrice))) *
                (Number(inputRefDiscount.current.value + event.key) / 100)
            ).toFixed(2)
          : (
              (accountInfo?.totalPagoCuentaRestante || 0) -
              (accountInfo?.totalPagoCuentaRestante || 0) * (Number(inputRefDiscount.current.value + event.key) / 100)
            ).toFixed(2)
      );
      setDiscountPrecent(inputRefDiscount.current.value + event.key);
    }
  };

  // const handleKeyDownSurgery = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   const { key } = event;
  //   const regex = /^[0-9.]$/;
  //   if (
  //     (!regex.test(key) && event.key !== 'Backspace') || //no numerico y que no sea backspace
  //     (event.key === '.' && inputRefSurgeryDiscount.current && inputRefSurgeryDiscount.current.value.includes('.')) //punto y ya incluye punto
  //   ) {
  //     event.preventDefault(); // Evitar la entrada si no es válida
  //   } else if (
  //     (inputRefSurgeryDiscount.current && !isNaN(Number(inputRefSurgeryDiscount.current.value + event.key))) ||
  //     (inputRefSurgeryDiscount.current && (event.key === 'Backspace' || event.key === '0'))
  //   ) {
  //     setSurgeryPrice(inputRefSurgeryDiscount.current.value + event.key);
  //   }
  // };
  const CaclTotalBill = () => {
    let result = 0;
    if (discountflag && discountSurgeryRoomFlag) {
      result = parseFloat(discount);
    } else if (discountSurgeryRoomFlag) {
      result =
        (accountInfo?.totalPagoCuentaRestante ?? 0) +
        (isNaN(Number(surgeryPrice) - initialSurgeryPrice) ? 0 : Number(surgeryPrice) - initialSurgeryPrice);
    } else if (discountflag) {
      result = parseFloat(discount);
    } else {
      result = accountInfo?.totalPagoCuentaRestante ?? 0;
    }
    return result;
  };
  if (errorflag && !isLoading) {
    return (
      <Box sx={style}>
        <HeaderModal
          setOpen={props.setOpen}
          title={`Cierre de cuenta ${
            accountInfo ? ` - Paciente: ${accountInfo.paciente.nombre} ${accountInfo.paciente.apellidoPaterno}` : ''
          }`}
        />
        <Typography sx={{ bgcolor: 'background.paper', py: 2 }} textAlign={'center'} variant="h4">
          <b>La información de la cuenta del paciente no esta completa</b>
        </Typography>
        <Box
          sx={{
            bgcolor: 'background.paper',
            display: 'flex',
            p: 1,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
        >
          <Button sx={{ ml: 'auto' }} variant="outlined" color="error" onClick={() => props.setOpen(false)}>
            Cerrar
          </Button>
        </Box>
      </Box>
    );
  }

  const handleOpenPDF = async () => {
    setIsLoading(true);

    const document = (
      <BillCloseReport
        cierreCuenta={{ ...accountInfo, notas: notes } as any}
        descuento={discountPercent !== '' ? discountPercent : undefined}
        total={CaclTotalBill()}
        notas={
          discountflag && discountSurgeryRoomFlag
            ? 'Se le hizo Descuento porcentual y cambio de precio en quirofano '
            : discountflag
              ? 'Se le hizo descuento'
              : discountSurgeryRoomFlag
                ? 'Se cambio el precio de quirofano'
                : ''
        }
      />
    );

    // Generar el PDF en formato blob
    const blob = await pdf(document).toBlob();

    // Crear una URL para el blob y abrir una nueva pestaña
    const url = URL.createObjectURL(blob);
    window.open(url);

    setIsLoading(false);
  };

  return (
    <Box sx={style}>
      <HeaderModal
        setOpen={props.setOpen}
        title={`Cierre de cuenta ${
          accountInfo ? ` - Paciente: ${accountInfo.paciente.nombre} ${accountInfo.paciente.apellidoPaterno}` : ''
        }`}
      />
      <Box sx={style2}>
        {isLoading && !errorflag ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={35} />
          </Box>
        ) : (
          accountInfo && (
            <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <PatientInformation
                patient={accountInfo.paciente}
                medic={accountInfo.medico}
                isHospitalization={accountInfo.esHospitalizacion}
              />
              <DataTable
                title="Cuartos"
                data={accountInfo.cuartos}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'cantidadDias', header: 'Cantidad de Dias' },
                  { key: 'precioDia', header: 'Precio por Dia' },
                  { key: 'precioNeto', header: 'Precio Neto' },
                  { key: 'precioIVA', header: 'IVA' },
                  { key: 'precioTotal', header: 'Precio Total' },
                ]}
              />
              <DataTable
                title="Quirofanos / Recuperacion"
                data={accountInfo.quirofanos}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'tiempoCirugia', header: 'Tiempo' },
                  { key: 'precioNeto', header: 'Precio Neto' },
                  { key: 'precioIVA', header: 'IVA' },
                  { key: 'precioTotal', header: 'Precio Total' },
                ]}
                isOperatingRoom
                modified={modified}
                setModified={setModified}
                id_PatientBill={props.id_Cuenta}
              />
              {/* <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <FormControlLabel
                  required
                  control={
                    <Checkbox
                      onChange={() => {
                        setDiscountSurgeryRoomFlag(!discountSurgeryRoomFlag);
                      }}
                    />
                  }
                  label="Cambiar precio de quirofano"
                />
                {discountSurgeryRoomFlag && (
                  <Box>
                    <Typography>Precio de quirofano en total:</Typography>
                    <TextField
                      variant="outlined"
                      inputRef={inputRefSurgeryDiscount}
                      onKeyDown={handleKeyDownSurgery}
                      inputProps={{
                        inputMode: 'decimal',
                        pattern: '[0-9]*',
                      }}
                      size="small"
                      placeholder="Monto"
                    />
                  </Box>
                )}
              </Box> */}
              <DataTable
                title="Procedimientos"
                data={accountInfo.procedimientos}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'precioNeto', header: 'Precio Neto' },
                  { key: 'precioIVA', header: 'IVA' },
                  { key: 'precio', header: 'Precio Total' },
                  // { key: 'estatus', header: 'Estatus' },
                ]}
              />

              <DataTable
                title="Estudios de Gabinete"
                data={accountInfo.registrosRadiografias}
                columns={[
                  { key: 'folio', header: 'Folio' },
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'nombreSolicitante', header: 'Nombre del Solicitante' },
                  { key: 'precioNeto', header: 'Precio Neto' },
                  { key: 'precioIVA', header: 'IVA' },
                  { key: 'precio', header: 'Precio Total' },
                  // { key: 'estatus', header: 'Estatus' },
                ]}
              />
              <DataTable
                title="Equipos Biomédicos"
                data={accountInfo.registrosEquiposBiomedicos}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'precioNeto', header: 'Precio Neto' },
                  { key: 'precioIVA', header: 'IVA' },
                  { key: 'precio', header: 'Precio Total' },
                ]}
              />
              <DataTable
                title="Equipos Biomédicos Externos"
                data={accountInfo.registrosEquiposBiomedicosHonorario}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'precioNeto', header: 'Precio Neto' },
                  { key: 'precioIVA', header: 'IVA' },
                  { key: 'precio', header: 'Precio Total' },
                ]}
              />
              <DataTable
                title="Artículos"
                data={accountInfo.articulos}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'cantidad', header: 'Cantidad' },
                  { key: 'solicitud', header: 'Solicitud' },
                  { key: 'fechaSolicitado', header: 'Fecha Solicitado' },
                  { key: 'precioVenta', header: 'Precio Unitario' },
                  { key: 'precioNeto', header: 'Precio Neto' },
                  { key: 'precioIVA', header: 'Precio IVA' },
                  { key: 'precioTotal', header: 'Precio Total' },
                ]}
              />
              <DataTable
                title="Pagos de la Cuenta"
                data={accountInfo.pagosCuenta}
                columns={[
                  { key: 'folio', header: 'Folio' },
                  { key: 'fechaPago', header: 'Fecha de Pago' },
                  { key: 'total', header: 'Monto' },
                ]}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%', p: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '33%', justifyContent: 'flex-end' }}>
                  <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Subtotal:</Typography>
                  </Box>
                  <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>${accountInfo.subTotal}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '33%', justifyContent: 'flex-end' }}>
                  <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>IVA:</Typography>
                  </Box>
                  <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>${accountInfo.iva}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '33%', justifyContent: 'flex-end' }}>
                  <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Total:</Typography>
                  </Box>
                  <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>${accountInfo.totalPagoCuenta}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%', p: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '33%', justifyContent: 'flex-end' }}>
                  <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Total Abonos:</Typography>
                  </Box>
                  <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                      ${accountInfo?.totalPagoCuentaAbonos}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '33%', justifyContent: 'flex-end' }}>
                  <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Total Restante:</Typography>
                  </Box>
                  <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                      ${accountInfo?.totalPagoCuenta - accountInfo.totalPagoCuentaAbonos}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography textAlign={'start'} variant="h4">
                <b>Pago SAMI:</b> ${accountInfo?.totalPagoSami ?? 0}
              </Typography>

              <Box sx={{ display: 'flex', flex: 1, mt: 2 }}>
                <TextField multiline label="Notas" fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} />
              </Box>
            </Box>
          )
        )}
      </Box>
      <Typography sx={{ bgcolor: 'background.paper', py: 2 }} textAlign={'center'} variant="h4">
        {discountSurgeryRoomFlag ? (
          <>
            <b>Total Restante:</b> $
            {(
              (accountInfo?.totalPagoCuentaRestante ?? 0) +
              (isNaN(Number(surgeryPrice) - initialSurgeryPrice) ? 0 : Number(surgeryPrice) - initialSurgeryPrice)
            ).toFixed(2)}{' '}
          </>
        ) : (
          <>
            <b>Total Restante:</b> ${accountInfo?.totalPagoCuentaRestante}
          </>
        )}
      </Typography>
      <Box sx={{ bgcolor: 'background.paper', py: 2 }}>
        {profile?.roles.includes('ADMIN') && (
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
            <FormControlLabel
              required
              control={
                <Checkbox
                  onChange={() => {
                    setDiscountflag(!discountflag);
                  }}
                />
              }
              label="Aplicar descuento"
            />
            {discountflag && (
              <Box>
                <Typography>Descuento en porcentaje</Typography>
                <TextField
                  variant="outlined"
                  inputRef={inputRefDiscount}
                  onKeyDown={handleKeyDownDiscount}
                  inputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*',
                  }}
                  size="small"
                  placeholder="Descuento"
                />
              </Box>
            )}
          </Box>
        )}

        {discountflag && (
          <Box sx={{ my: 1 }}>
            <Typography textAlign={'center'} variant="h5">
              Total con descuento:
              {discount}
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          bgcolor: 'background.paper',
          display: 'flex',
          justifyContent: 'space-between',
          p: 1,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <Button variant="outlined" color="error" onClick={() => props.setOpen(false)}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          type="submit"
          disabled={isLoading}
          onClick={() => {
            acceptRequest();
          }}
        >
          {isLoading ? <CircularProgress size={25} /> : 'Cerrar Cuenta'}
        </Button>
        {!isLoading && !errorflag && (
          <Button variant="contained" color="primary" disabled={isLoading} onClick={handleOpenPDF}>
            {isLoading ? <CircularProgress size={25} /> : 'Ver PDF'}
          </Button>
        )}
      </Box>
    </Box>
  );
};

interface PatientInformationProps {
  patient: IPatientInAccount;
  medic: string;
  isHospitalization: boolean;
}

export const PatientInformation: React.FC<PatientInformationProps> = ({ patient, medic, isHospitalization }) => (
  <Grid container sx={{ p: 1 }} spacing={1}>
    <Grid item xs={12}>
      <Typography variant="h6">
        <b>Información del Paciente</b>
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>
        <b>Nombre:</b> {`${patient.nombre} ${patient.apellidoPaterno} ${patient.apellidoMaterno}`}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>
        <b>Fecha:</b> {dayjs().format('DD/MM/YYYY - HH:mm')}
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography>
        <b>Nombre Doctor:</b> {medic}
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography>
        <b>Tipo:</b> {isHospitalization ? 'Hospitalización' : 'Ambulatoria o Endopro'}
      </Typography>
    </Grid>
  </Grid>
);

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  isOperatingRoom?: boolean;
  modified?: boolean;
  setModified?: Function;
  id_PatientBill?: string;
}
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
}

export const DataTable = <T,>({
  title,
  data,
  columns,
  isOperatingRoom,
  modified,
  setModified,
  id_PatientBill,
}: DataTableProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [tipoQuirofano, setTipoQuirofano] = useState<string>('');

  const { data: operatingRoomsList = [] } = useQuery<{ id: string; nombre: string }[]>({
    queryKey: ['allOperatingRoomsTypes'],
    queryFn: getAllOperatingRoomsTypes,
    enabled: !!anchorEl,
  });

  const handleClick = async (event: React.MouseEvent<HTMLElement>, row: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleChangeTipoQuirofano = (event: any) => {
    setTipoQuirofano(event.target.value as string);
  };

  const handleConfirm = async () => {
    if (!tipoQuirofano) return handleClose();
    console.log('Tipo de quirófano seleccionado:', tipoQuirofano);
    console.log('Fila seleccionada:', selectedRow);
    try {
      await updateOperatingRoomType({
        id_RegistroCuarto: selectedRow.id_RegistroCuarto,
        id_TipoCuarto: tipoQuirofano,
        id_CuentaPaciente: id_PatientBill as string,
      });
      if (setModified) setModified(!modified);
      toast.success('Tipo de cuarto modificado correctamente');
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error('Error al modificar el tipo de cuarto');
    }
  };

  return (
    <Box sx={{ p: 1, width: '100%', margin: 'auto', fontSize: '0.875rem' }}>
      <Typography variant="h6" sx={{ mb: 2, fontSize: '1.1rem' }}>
        {title}
      </Typography>
      <TableContainer sx={{ border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.875rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={String(col.key)} sx={{ p: 1, fontSize: '0.875rem' }}>
                  {col.header}
                </TableCell>
              ))}
              {isOperatingRoom && <TableCell sx={{ p: 1, fontSize: '0.875rem' }}>Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((row: any, index) => (
                <TableRow key={index}>
                  {columns.map((col) => {
                    const cellValue = row[col.key];
                    const formattedValue =
                      (col.key as String).toLowerCase().includes('precio') && typeof cellValue === 'number'
                        ? `$${cellValue}`
                        : String(cellValue);
                    return (
                      <TableCell key={String(col.key)} sx={{ p: 1, fontSize: '0.875rem' }}>
                        {formattedValue}
                      </TableCell>
                    );
                  })}
                  {isOperatingRoom && (
                    <TableCell sx={{ p: 1, fontSize: '0.875rem' }}>
                      {row['nombre'] !== 'Recuperacion' && (
                        <Tooltip title="Cambiar configuración">
                          <IconButton size="small" onClick={(event) => handleClick(event, row)}>
                            <Settings fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ p: 1, fontSize: '0.875rem', textAlign: 'center' }}>
                  Sin registros
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{ paper: { sx: { p: 2, width: '250px' } } }}
      >
        {[
          <Typography key="title" variant="subtitle1" gutterBottom>
            Configurar Quirófano
          </Typography>,
          <Select
            key="select"
            value={tipoQuirofano}
            onChange={(e) => handleChangeTipoQuirofano(e)}
            displayEmpty
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="">
              <em>Seleccionar tipo de quirófano</em>
            </MenuItem>
            {operatingRoomsList.map((opRoom) => (
              <MenuItem key={opRoom.id} value={opRoom.id}>
                {opRoom.nombre}
              </MenuItem>
            ))}
          </Select>,
          <Button key="button" variant="contained" color="primary" fullWidth onClick={handleConfirm}>
            Aceptar
          </Button>,
        ]}
      </Menu>
    </Box>
  );
};
