import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { IAcountAllInformationAdmission } from '../../../../types/hospitalizationTypes';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import {
  admitRegister,
  getAccountAdmissionInformation,
} from '../../../../services/programming/admissionRegisterService';
import { registerSell } from '../../../../services/checkout/checkoutService';
import { useConnectionSocket } from '../../../../store/checkout/connectionSocket';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { DataTable, PatientInformation } from '../../../Hospitalization/AcountsManagement/Modal/CloseAccount';
import { usePatientRegisterPaginationStore } from '../../../../store/programming/patientRegisterPagination';
import { useGetPatientAccount } from '../../../../hooks/checkout/useGetPatientAccount';
import { createPatientAccountDeposit } from '../../../../services/checkout/patientAccount';
import { DepositType, IPatientInfo } from '../../../../types/checkout/patientAccountTypes';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 750, xl: 850 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 650, xl: 900 },
};
const style2 = {
  bgcolor: 'background.paper',
  overflowY: 'auto',
  p: 2,
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
interface PatientEntryAdvanceModalProps {
  setOpen: Function;
  isEntryPayment: boolean; //Si es true es el anticipo para darle admision, si no es un abono a la cuenta normal
  id_CuentaPaciente: string;
}

export const PatientEntryAdvanceModal = (props: PatientEntryAdvanceModalProps) => {
  const conn = useConnectionSocket((state) => state.conn);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const refetch = usePatientRegisterPaginationStore((state) => state.fetchData);
  const { data: accountInfo, isLoading } = useGetPatientAccount(props.id_CuentaPaciente);
  const [advance, setAdvance] = useState('');

  const handleCalcAnticipo = (total: number) => {
    const result = (total * 0.2).toFixed(2);
    return result;
  };

  useEffect(() => {
    if (accountInfo) {
      setAdvance(handleCalcAnticipo(accountInfo.totalRestante));
    }
  }, [accountInfo]);

  const handleSubmit = async () => {
    setIsLoadingSubmit(true);
    if (!accountInfo) {
      toast.error('No se encontro la cuenta');
      return;
    }
    if (
      inputRef.current === null ||
      inputRef.current.value === undefined ||
      isNaN(Number(inputRef.current.value)) ||
      inputRef.current.value === '' ||
      Number(inputRef.current.value) <= 0
    ) {
      toast.error('Ingresa un monto valido parar el descuento');
      return;
    }
    if (conn === null) {
      toast.error('Error, sin conexión al websocket');
      return;
    }
    try {
      // await admitRegister({ Id_Registro: accountInfo.id });
      const object = {
        cantidad: parseFloat(inputRef.current.value),
        tipoDeposito: DepositType.Advance,
        id_CuentaPaciente: props.id_CuentaPaciente,
      };
      console.log({ object });
      const res = await createPatientAccountDeposit(object);
      const resObj = {
        estatus: res.estadoVenta,
        folio: res.folio,
        id_VentaPrincipal: res.id,
        moduloProveniente: 'Cierre cuenta',
        paciente: `${accountInfo.paciente?.nombrePaciente || ''}`,
        totalVenta: res.totalVenta,
        tipoPago: res.tipoPago,
        id_UsuarioPase: res.id_UsuarioVenta,
        nombreUsuario: res.usuarioVenta?.nombre,
      };
      conn.invoke('SendSell', resObj);
      refetch();
      toast.success('Anticipo y Pase a caja generado correctamente');
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Error al generar anticipo');
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const acceptRequest = () => {
    withReactContent(Swal).fire({
      title: 'Confirmación',
      text: `¿Estás seguro de generar el anticipo?`,
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    const regex = /^[0-9.]$/;
    if (
      (!regex.test(key) && event.key !== 'Backspace') || //no numerico y que no sea backspace
      (event.key === '.' && inputRef.current && inputRef.current.value.includes('.')) //punto y ya incluye punto
    ) {
      event.preventDefault(); // Evitar la entrada si no es válida
    }
  };
  const totalServices = accountInfo?.servicios?.reduce((acc, curr) => acc + curr.total, 0) ?? 0;
  const totalArticles = accountInfo?.articulos?.reduce((acc, curr) => acc + curr.total, 0) ?? 0;
  const totalEquipment = accountInfo?.equipoHonorario?.reduce((acc, curr) => acc + curr.total, 0) ?? 0;

  return (
    <Box sx={style}>
      <HeaderModal
        setOpen={props.setOpen}
        title={`Admisión paciente ${accountInfo ? ` - Paciente: ${accountInfo.paciente?.nombrePaciente || ''}` : ''}`}
      />
      <Box sx={style2}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={35} />
          </Box>
        ) : (
          accountInfo && (
            <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <PatientInformation
                patient={accountInfo.paciente ?? ({} as IPatientInfo)}
                medic={accountInfo.paciente?.nombreMedico || ''}
                isHospitalization={false}
                ventaConcepto={totalServices}
                ventaArticuloIVA={totalArticles}
                ventaArticuloSinIVA={totalEquipment}
              />
              <DataTable
                title="Cuartos"
                data={accountInfo.cuartos ?? []}
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
                data={accountInfo.quirofanos ?? []}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'tiempo', header: 'Tiempo' },
                  { key: 'neto', header: 'Precio Neto' },
                  { key: 'iva', header: 'IVA' },
                  { key: 'total', header: 'Precio Total' },
                ]}
              />
              <DataTable
                title="Procedimientos"
                data={accountInfo.cirugias ?? []}
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
                data={accountInfo.servicios ?? []}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'neto', header: 'Precio Neto' },
                  { key: 'iva', header: 'IVA' },
                  { key: 'total', header: 'Precio Total' },
                ]}
              />

              <DataTable
                title="Equipos Biomédicos Externos"
                data={accountInfo.equipoHonorario ?? []}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'neto', header: 'Precio Neto' },
                  { key: 'iva', header: 'IVA' },
                  { key: 'total', header: 'Precio Total' },
                ]}
              />
              <DataTable
                title="Artículos"
                data={accountInfo.articulos ?? []}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'solicitadoEn', header: 'Solicitado en' },
                  { key: 'fechaSolicitado', header: 'Fecha Solicitado' },
                  { key: 'neto', header: 'Precio Neto' },
                  { key: 'iva', header: 'IVA' },
                  { key: 'total', header: 'Precio Total' },
                ]}
              />

              <DataTable
                title="Pagos de la Cuenta"
                data={accountInfo.pagosCuenta ?? []}
                columns={[
                  { key: 'folio', header: 'Folio' },
                  { key: 'fechaPago', header: 'Fecha de Pago' },
                  { key: 'monto', header: 'Monto' },
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
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>${accountInfo.total.toFixed(2)}</Typography>
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
                      ${accountInfo?.totalPagos.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '33%', justifyContent: 'flex-end' }}>
                  <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Total Restante:</Typography>
                  </Box>
                  <Box sx={{ boxShadow: 5, border: 1, flex: 1, p: 1, borderColor: 'GrayText' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                      ${(accountInfo?.total - accountInfo?.totalPagos).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {!props.isEntryPayment && accountInfo.total && accountInfo.totalRestante && (
                <>
                  <Typography textAlign={'start'} variant="h4">
                    <b>Total Abonos:</b> {accountInfo?.totalPagos.toFixed(2)}
                  </Typography>
                </>
              )}
            </Box>
          )
        )}
      </Box>

      {!isLoading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ my: 'auto' }} textAlign={'start'} variant="h5">
              <b>Total Cuenta:</b> {accountInfo?.totalRestante.toFixed(2)}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', mx: 2 }}>
              <TextField
                variant="outlined"
                inputRef={inputRef}
                onKeyDown={handleKeyDown}
                inputProps={{
                  inputMode: 'decimal',
                  pattern: '[0-9]*',
                }}
                size="small"
                placeholder="Deposito"
              />
              {props.isEntryPayment && (
                <Typography
                  component="span"
                  sx={{
                    color: 'error.main',
                    fontSize: '0.65rem',
                    mt: 1,
                  }}
                >
                  Deposito sugerido: ${advance}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}
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
          disabled={isLoading || isLoadingSubmit}
          onClick={() => {
            acceptRequest();
          }}
        >
          {isLoading || isLoadingSubmit ? <CircularProgress size={25} /> : 'Generar deposito'}
        </Button>
      </Box>
    </Box>
  );
};
