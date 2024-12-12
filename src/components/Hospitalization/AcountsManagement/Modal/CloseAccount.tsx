import {
  Box,
  Button,
  CircularProgress,
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
  Tooltip,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useConnectionSocket } from '../../../../store/checkout/connectionSocket';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Settings } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { usePatientAccountPaginationStore } from '../../../../store/checkout/patientAcountsPagination';
import { PriceCell } from '../../../Commons/PriceCell';
import { useGetPatientAccount } from '../../../../hooks/checkout/useGetPatientAccount';
import { DepositType, IPatientInfo, PatientAccountStatus } from '../../../../types/checkout/patientAccountTypes';
import {
  changeStatusPatientAccount,
  createPatientAccountDeposit,
  updateOperatingRoomType,
} from '../../../../services/checkout/patientAccount';
import { ModalBasic } from '@/common/components';
import { DiscountModal } from './DiscountModal';
import { getAllSurgeryRoomTypes } from '@/services/programming/suergeryRoomTypes';

interface CloseAccountModalProps {
  setOpen: Function;
  id_Cuenta: string;
  viewOnly?: boolean;
  open?: boolean;
}

export const CloseAccountModal = (props: CloseAccountModalProps) => {
  // const [isLoading, setIsLoading] = useState(false);
  const refetch = usePatientAccountPaginationStore((state) => state.fetchData);
  // const inputRefSurgeryDiscount = useRef<HTMLInputElement>(null);
  // const profile = useAuthStore(useShallow((state) => state.profile));
  //const [notes, setNotes] = useState('');
  const { data, isLoading, error, refetch: refetchAccount } = useGetPatientAccount(props.id_Cuenta);
  const viewOnly = data?.estatusCuenta !== PatientAccountStatus.Admitted;

  // const [discount, setDiscount] = useState('');
  // const [discountPercent, setDiscountPercent] = useState('');

  //const [surgeryPrice] = useState('');
  const [modified, setModified] = useState(false);
  const [openDiscount, setOpenDiscount] = useState(false);

  // const [discountType, setDiscountType] = useState<'percentage' | 'amount' | null>(null);
  // const [discountValue, setDiscountValue] = useState('');
  // const [discountedTotal, setDiscountedTotal] = useState(accountInfo?.totalPagoCuentaRestante || 0);
  // const [discountReason, setDiscountReason] = useState('');
  console.log('los destos', data?.quirofanos);
  const handleSubmit = async () => {
    if (!data) {
      toast.error('No se encontró la cuenta');
      return;
    }
    try {
      await changeStatusPatientAccount({
        id: props.id_Cuenta,
        estatus: PatientAccountStatus.Closed,
      });
      refetch();
      refetchAccount();
      toast.success('Cierre de cuenta y Pase a caja generado correctamente');
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error((error as any).response.data.message[0]);
    }
  };

  const acceptRequest = () => {
    withReactContent(Swal).fire({
      title: 'Confirmación',
      text: `¿Estás seguro de CERRAR la cuenta por la cantidad de $${data?.totalRestante.toFixed(2)}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        handleSubmit();
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  console.log({ data });

  // const handleKeyDownDiscount = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   const { key } = event;
  //   const regex = /^[0-9.]$/;
  //   const currentValue = inputRefDiscount.current?.value || '';
  //   const newValue = currentValue + key;

  //   if (
  //     (!regex.test(key) && event.key !== 'Backspace') ||
  //     (key === '.' && currentValue.includes('.')) ||
  //     (discountType === 'percentage' && Number(newValue) > 100)
  //   ) {
  //     event.preventDefault();
  //     return;
  //   }

  //   if (inputRefDiscount.current && !isNaN(Number(newValue))) {
  //     const totalAmount = accountInfo?.totalPagoCuentaRestante || 0;
  //     let discountedAmount: number;

  //     if (discountType === 'percentage') {
  //       discountedAmount = totalAmount - (totalAmount * Number(newValue)) / 100;
  //       setDiscountPercent(newValue);
  //     } else {
  //       discountedAmount = totalAmount - Number(newValue);
  //     }

  //     setDiscount(discountedAmount.toFixed(2));
  //   }
  // };

  // const handleDiscountTypeChange = (type: 'percentage' | 'amount' | null) => {
  //   setDiscountType(type);
  //   if (type === null) {
  //     setDiscountValue('');
  //     setDiscountedTotal(accountInfo?.totalPagoCuentaRestante || 0);
  //     setDiscountflag(false);
  //   } else {
  //     setDiscountflag(true);
  //     if (discountValue) {
  //       calculateDiscount(discountValue, type);
  //     }
  //   }
  // };

  // const calculateDiscount = (value: string, type: 'percentage' | 'amount') => {
  //   const totalAmount = accountInfo?.totalPagoCuentaRestante || 0;
  //   const numValue = Number(value);

  //   if (type === 'percentage') {
  //     if (numValue > 100) {
  //       setDiscountValue('100');
  //       setDiscountedTotal(0);
  //     } else {
  //       setDiscountValue(value);
  //       setDiscountedTotal(totalAmount - (totalAmount * numValue) / 100);
  //     }
  //   } else {
  //     if (numValue > totalAmount) {
  //       setDiscountValue(totalAmount.toString());
  //       setDiscountedTotal(0);
  //     } else {
  //       setDiscountValue(value);
  //       setDiscountedTotal(totalAmount - numValue);
  //     }
  //   }
  // };

  // const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value } = event.target;
  //   if (value === '' || /^\d*\.?\d*$/.test(value)) {
  //     if (discountType) {
  //       calculateDiscount(value, discountType);
  //     } else {
  //       setDiscountValue(value);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (discountType && discountValue) {
  //     calculateDiscount(discountValue, discountType);
  //   }
  // }, [discountType, accountInfo?.totalPagoCuentaRestante]);

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
  // const calcularTotalConDescuento = () => {
  //   if (!data?.totalRestante || !data?.descuento) {
  //     return data?.totalRestante ?? 0;
  //   }

  //   const porcentajeDescuento = data.descuento / 100;
  //   const montoDescuento = data.totalRestante * porcentajeDescuento;
  //   return (data.totalRestante - montoDescuento).toFixed(2);
  // };

  // const result = calcularTotalConDescuento();
  const totalServices = data?.servicios?.reduce((acc, curr) => acc + curr.total, 0) ?? 0;
  const totalArticles = data?.articulos?.reduce((acc, curr) => acc + curr.total, 0) ?? 0;
  const totalEquipment = data?.equipoHonorario?.reduce((acc, curr) => acc + curr.total, 0) ?? 0;

  const conn = useConnectionSocket((state) => state.conn);

  const handleGenerateCheckout = () => {
    if (!data) return;

    Swal.fire({
      title: '¿Desea liquidar esta cuenta?',
      text: `Se generara una venta en caja de un monto de $${data.totalRestante}`,
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
            id_CuentaPaciente: props.id_Cuenta,
            cantidad: data.total,
            tipoDeposito: DepositType.Settlement,
          };
          const res = await createPatientAccountDeposit(object);
          const resObj = {
            estatus: res.estadoVenta,
            folio: res.folio,
            id_VentaPrincipal: res.id,
            moduloProveniente: 'Cierre cuenta',
            paciente: data.paciente?.nombrePaciente,
            totalVenta: res.totalVenta,
            tipoPago: res.tipoPago,
            id_UsuarioPase: res.id_UsuarioVenta,
            nombreUsuario: res.usuarioVenta?.nombre,
          };
          conn.invoke('SendSell', resObj);
          Swal.fire('Success', 'Pase de caja generado correctamente', 'success');
          refetch();
          refetchAccount();
        } catch (error: any) {
          console.log('error:', error);
          const message = error.response?.data?.message[0] || 'Error al generar el pase de caja';
          Swal.fire('Error', message, 'error');
        }
      },
    });
  };

  if (error && !isLoading) {
    return (
      <ModalBasic
        header={`Cierre de cuenta ${data ? ` - Paciente: ${data.paciente?.nombrePaciente}` : ''}`}
        open={props.open}
        onClose={() => props.setOpen(false)}
      >
        <Box>
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
      </ModalBasic>
    );
  }
  const paseCaja = data?.estatusCuenta === PatientAccountStatus.Closed && data?.paseCaja === false;

  const actions = (
    <>
      <Button variant="outlined" color="error" onClick={() => props.setOpen(false)}>
        Cancelar
      </Button>
      <div className="col"></div>
      {paseCaja && (
        <>
          <Button variant="contained" color="primary" onClick={() => setOpenDiscount(true)}>
            Descuento
          </Button>
          <Button variant="contained" color="primary" onClick={handleGenerateCheckout}>
            Liquidar cuenta
          </Button>
        </>
      )}
      {!viewOnly && (
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
      )}
    </>
  );

  const onCloseDiscount = () => {
    console.log('onCloseDiscount:');
    setOpenDiscount(false);
    refetchAccount();
  };

  return (
    <>
      <ModalBasic
        header={`Cierre de cuenta ${data ? ` - Paciente: ${data.paciente?.nombrePaciente}` : ''}`}
        open={props.open}
        onClose={() => props.setOpen(false)}
        actions={actions}
        maxWidth={'xl'}
      >
        <DiscountModal
          setOpen={setOpenDiscount}
          Id_CuentaPaciente={props.id_Cuenta}
          open={openDiscount}
          onClose={onCloseDiscount}
        />
        <Box>
          <Box>
            {isLoading && !error ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={35} />
              </Box>
            ) : (
              data && (
                <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                  <PatientInformation
                    date={data.fechaIngreso}
                    patient={data.paciente ?? ({} as IPatientInfo)}
                    medic={data.paciente?.nombreMedico ?? ''}
                    isHospitalization={data.cuentaConCuarto}
                    ventaConcepto={totalServices}
                    ventaArticuloIVA={totalArticles}
                    ventaArticuloSinIVA={totalEquipment}
                  />
                  <DataTable
                    title="Cuartos"
                    refreshAccount={refetchAccount}
                    hasRoom={data.cuentaConCuarto}
                    data={data.cuartos ?? []}
                    columns={[
                      { key: 'nombre', header: 'Nombre' },
                      { key: 'cantidadDias', header: 'Cantidad de Dias' },
                      { key: 'precioDia', header: 'Precio por Dia' },
                      { key: 'neto', header: 'Precio Neto' },
                      { key: 'iva', header: 'IVA' },
                      { key: 'total', header: 'Precio Total' },
                    ]}
                  />
                  <DataTable
                    title="Quirofanos / Recuperacion"
                    refreshAccount={refetchAccount}
                    hasRoom={data.cuentaConCuarto}
                    data={data.quirofanos ?? []}
                    columns={[
                      { key: 'nombre', header: 'Nombre' },
                      { key: 'tiempo', header: 'Tiempo' },
                      { key: 'neto', header: 'Precio Neto' },
                      { key: 'iva', header: 'IVA' },
                      { key: 'total', header: 'Precio Total' },
                    ]}
                    isOperatingRoom={!viewOnly}
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
                    refreshAccount={refetchAccount}
                    hasRoom={data.cuentaConCuarto}
                    data={data.cirugias ?? []}
                    columns={[
                      { key: 'nombre', header: 'Nombre' },
                      { key: 'neto', header: 'Precio Neto' },
                      { key: 'iva', header: 'IVA' },
                      { key: 'total', header: 'Precio Total' },
                      // { key: 'estatus', header: 'Estatus' },
                    ]}
                  />

                  <DataTable
                    title="Servicios"
                    refreshAccount={refetchAccount}
                    hasRoom={data.cuentaConCuarto}
                    data={data.servicios ?? []}
                    columns={[
                      { key: 'nombre', header: 'Nombre' },
                      { key: 'neto', header: 'Precio Neto' },
                      { key: 'iva', header: 'IVA' },
                      { key: 'total', header: 'Precio Total' },
                    ]}
                  />
                  {/* <DataTable
                title="Equipos Biomédicos"
                data={data.equiposBiomedicos ?? []}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'precioNeto', header: 'Precio Neto' },
                  { key: 'precioIVA', header: 'IVA' },
                  { key: 'precio', header: 'Precio Total' },
                ]}
                haveDiscount={data?.descuento}
              /> */}
                  <DataTable
                    title="Equipos Biomédicos Externos"
                    hasRoom={data.cuentaConCuarto}
                    refreshAccount={refetchAccount}
                    data={data.equipoHonorario ?? []}
                    columns={[
                      { key: 'nombre', header: 'Nombre' },
                      { key: 'neto', header: 'Precio Neto' },
                      { key: 'iva', header: 'IVA' },
                      { key: 'total', header: 'Precio Total' },
                    ]}
                  />
                  <DataTable
                    title="Artículos"
                    refreshAccount={refetchAccount}
                    hasRoom={data.cuentaConCuarto}
                    data={data.articulos ?? []}
                    columns={[
                      { key: 'nombre', header: 'Nombre' },
                      { key: 'cantidad', header: 'Cantidad' },
                      { key: 'solicitadoEn', header: 'Solicitado en' },
                      { key: 'fechaSolicitado', header: 'Fecha Solicitado' },
                      { key: 'precioUnitario', header: 'Precio Unitario', isPrice: true },
                      { key: 'neto', header: 'Precio Neto', isPrice: true },
                      { key: 'iva', header: 'IVA', isPrice: true },
                      { key: 'total', header: 'Precio Total', isPrice: true },
                    ]}
                  />
                  <DataTable
                    title="Pagos de la Cuenta"
                    refreshAccount={refetchAccount}
                    data={data.pagosCuenta ?? []}
                    hasRoom={data.cuentaConCuarto}
                    columns={[
                      { key: 'folio', header: 'Folio' },
                      { key: 'fechaPago', header: 'Fecha de Pago' },
                      { key: 'monto', header: 'Monto' },
                    ]}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%', p: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '33%', justifyContent: 'flex-end' }}>
                      <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>SubTotal:</Typography>
                      </Box>
                      <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>${data.subTotal.toFixed(2)}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '33%', justifyContent: 'flex-end' }}>
                      <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Descuento (Porcentaje):</Typography>
                      </Box>
                      <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{data.descuento?.toFixed(2)}%</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '33%', justifyContent: 'flex-end' }}>
                      <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>IVA:</Typography>
                      </Box>
                      <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>${data.iva.toFixed(2)}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '33%', justifyContent: 'flex-end' }}>
                      <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Total:</Typography>
                      </Box>
                      <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>${data.total.toFixed(2)}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%', p: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '33%', justifyContent: 'flex-end' }}>
                      <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Total Abonos:</Typography>
                      </Box>
                      <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>${data.totalPagos.toFixed(2)}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '33%', justifyContent: 'flex-end' }}>
                      <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Total Restante:</Typography>
                      </Box>
                      <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                          ${(data.total - data.totalPagos).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )
            )}
          </Box>
          <Typography
            sx={{
              bgcolor: 'background.paper',
              py: 2,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            variant="h4"
            textAlign={'center'}
          ></Typography>
          {/* <Box sx={{ bgcolor: 'background.paper', py: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
        </Box>
        {profile?.roles.includes('ADMIN') && discountflag && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                p: 1,
              }}
            >
              <Typography variant="subtitle1">Tipo de descuento:</Typography>
              <Box display="flex" flexDirection="row">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={discountType === 'percentage'}
                      onChange={() => handleDiscountTypeChange(discountType === 'percentage' ? null : 'percentage')}
                    />
                  }
                  label="Porcentaje"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={discountType === 'amount'}
                      onChange={() => handleDiscountTypeChange(discountType === 'amount' ? null : 'amount')}
                    />
                  }
                  label="Monto"
                />
              </Box>
              <Box>
                <Typography>Descuento en {discountType === 'percentage' ? 'Porcentaje' : 'Monto'}</Typography>
                <TextField
                  value={discountValue}
                  inputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*',
                  }}
                  size="small"
                  placeholder={discountType === 'percentage' ? 'Porcentaje' : 'Monto'}
                  onChange={handleDiscountChange}
                  disabled={!discountType}
                />
                <TextField
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                  margin="normal"
                  label="Motivo del descuento"
                  placeholder="Ingrese el motivo del descuento"
                  disabled={!discountType}
                />
              </Box>
            </Box>
          </>
        )}

        {discountflag && (
          <Box sx={{ my: 1 }}>
            <Typography textAlign={'center'} variant="h5">
              Total con descuento:
              {discountedTotal.toFixed(2)}
            </Typography>
          </Box>
        )}
      </Box> */}

          <Box
            sx={{
              bgcolor: 'background.paper',
              display: 'flex',
              justifyContent: 'space-between',
              p: 1,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          ></Box>
        </Box>
      </ModalBasic>
    </>
  );
};

interface PatientInformationProps {
  patient: IPatientInfo;
  medic: string;
  date: string;
  isHospitalization: boolean;
  ventaConcepto: number;
  ventaArticuloIVA: number;
  ventaArticuloSinIVA: number;
}

export const PatientInformation: React.FC<PatientInformationProps> = ({ patient, medic, isHospitalization, date }) => (
  <Grid container sx={{ p: 1 }} spacing={1}>
    <Grid item xs={12}>
      <Typography variant="h6">
        <b>Información del Paciente</b>
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>
        <b>Nombre:</b> {`${patient.nombrePaciente}`}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>
        <b>Fecha ingreso:</b> {date}
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography>
        <b>Nombre Doctor:</b> {medic}
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography>
        <b>Tipo:</b> {isHospitalization ? 'Hospitalización' : 'Ambulatoria'}
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
  hasRoom: boolean;
  refreshAccount: Function;
}
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
  isPrice?: boolean;
}

export const DataTable = <T,>({
  title,
  data,
  columns,
  isOperatingRoom,
  modified,
  setModified,
  hasRoom,
  refreshAccount,
}: DataTableProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [tipoQuirofano, setTipoQuirofano] = useState<string>('');

  const { data: operatingRoomsList = [] } = useQuery<{ id_TipoQuirofano: string; nombre: string }[]>({
    queryKey: ['allOperatingRoomsTypes'],
    queryFn: getAllSurgeryRoomTypes,
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
    try {
      await updateOperatingRoomType({
        id_CuentaEspacioHospitalario: selectedRow.id ?? '',
        id_TipoQuirofano: tipoQuirofano,
        CuentaConCuarto: hasRoom,
      });
      if (setModified) setModified(!modified);
      refreshAccount();
      toast.success('Tipo de cuarto modificado correctamente');
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error('Error al modificar el tipo de cuarto');
    }
  };

  return (
    <>
      <Box sx={{ p: 1, width: '100%', margin: 'auto', fontSize: '0.875rem' }}>
        <Typography variant="h6" sx={{ mb: 2, fontSize: '1.1rem' }}>
          {title}
        </Typography>
        <TableContainer sx={{ border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.875rem' }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={String(col.key)} sx={{ fontSize: '0.875rem' }}>
                    {col.header}
                  </TableCell>
                ))}
                {isOperatingRoom && <TableCell sx={{ fontSize: '0.875rem' }}>Acciones</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 ? (
                data.map((row: any, index) => (
                  <TableRow key={index}>
                    {columns.map((col) => {
                      const cellValue = row[col.key];
                      if (col.key === 'neto' && row.netoDescuento !== undefined && row.netoDescuento !== null) {
                        return (
                          <TableCell key={String(col.key)} sx={{ fontSize: '0.875rem' }}>
                            <PriceCell originalPrice={cellValue} discountedPrice={row.netoDescuento} />
                          </TableCell>
                        );
                      }
                      const formattedValue =
                        typeof cellValue === 'number' && col.isPrice ? `$${cellValue.toFixed(2)}` : String(cellValue);
                      return (
                        <TableCell key={String(col.key)} sx={{ fontSize: '0.875rem' }}>
                          {formattedValue}
                        </TableCell>
                      );
                    })}
                    {isOperatingRoom && (
                      <TableCell sx={{ fontSize: '0.875rem' }}>
                        {row['esRecuperacion'] === false && (
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
              onChange={(e) => {
                handleChangeTipoQuirofano(e);
              }}
              displayEmpty
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="">
                <em>Seleccionar tipo de quirófano</em>
              </MenuItem>
              {operatingRoomsList.map((opRoom) => (
                <MenuItem key={opRoom.id_TipoQuirofano} value={opRoom.id_TipoQuirofano}>
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
    </>
  );
};
