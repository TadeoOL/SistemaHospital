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
  id_Registro: string;
  id_Paciente: string;
}

export const PatientEntryAdvanceModal = (props: PatientEntryAdvanceModalProps) => {
  const conn = useConnectionSocket((state) => state.conn);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [accountInfo, setAccountInfo] = useState<IAcountAllInformationAdmission | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [advance, setAdvance] = useState('');
  const refetch = usePatientRegisterPaginationStore((state) => state.fetchData);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      setIsLoading(true);
      try {
        const paramURL = `Id_Paciente=${props.id_Paciente}&Id_Registro=${props.id_Registro}`;
        const accountRes = await getAccountAdmissionInformation(paramURL);
        setAccountInfo(accountRes);
        setAdvance(handleCalcAnticipo(accountRes.totalPagoCuenta as number));
      } catch (error) {
        console.log(error);
        console.log('La cuenta aun no se puede cerrar');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountInfo();
  }, []);

  const handleCalcAnticipo = (total: number) => {
    const result = (total * 0.2).toFixed(2);
    return result;
  };

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
      await admitRegister({ Id_Registro: accountInfo.id });
      const object = {
        paciente: `${accountInfo.paciente.nombre || ''} ${accountInfo.paciente.apellidoPaterno || ''} ${accountInfo.paciente.apellidoPaterno || ''}`,
        totalVenta: parseFloat(inputRef.current.value),
        moduloProveniente: 'Admision',
        id_CuentaPaciente: accountInfo.id_CuentaPaciente,
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

  return (
    <Box sx={style}>
      <HeaderModal
        setOpen={props.setOpen}
        title={`Admisión paciente ${
          accountInfo ? ` - Paciente: ${accountInfo.paciente.nombre} ${accountInfo.paciente.apellidoPaterno}` : ''
        }`}
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
                  { key: 'precioHora', header: 'Precio por Hora' },
                  { key: 'precioNeto', header: 'Precio Neto' },
                  { key: 'precioIVA', header: 'IVA' },
                  { key: 'precioTotal', header: 'Precio Total' },
                ]}
              />
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
                  { key: 'precioVenta', header: 'Precio Unitario' },
                  { key: 'precioNeto', header: 'Precio Neto' },
                  { key: 'precioIVA', header: 'Precio IVA' },
                  { key: 'precioTotal', header: 'Precio Total' },
                ]}
              />
              {!props.isEntryPayment && (
                <DataTable
                  title="Pagos de la Cuenta"
                  data={accountInfo.pagosCuenta}
                  columns={[
                    { key: 'folio', header: 'Folio' },
                    { key: 'total', header: 'Monto' },
                  ]}
                />
              )}
              <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', p: 1 }}>
                <Box sx={{ boxShadow: 5, border: 1, display: 'flex', flex: 1, p: 1, borderColor: 'GrayText' }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Subtotal: ${accountInfo.subTotal}</Typography>
                </Box>
                <Box sx={{ boxShadow: 5, border: 1, display: 'flex', flex: 1, p: 1, borderColor: 'GrayText' }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700 }}>IVA: ${accountInfo.iva}</Typography>
                </Box>
                <Box sx={{ boxShadow: 5, border: 1, display: 'flex', flex: 1, p: 1, borderColor: 'GrayText' }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Total: ${accountInfo.totalPagoCuenta}</Typography>
                </Box>
              </Box>
              {!props.isEntryPayment && accountInfo.totalPagoCuentaAbonos && accountInfo.totalPagoCuentaRestante && (
                <>
                  <Typography textAlign={'start'} variant="h4">
                    <b>Total Abonos:</b> {accountInfo?.totalPagoCuentaAbonos}
                  </Typography>
                </>
              )}
            </Box>
          )
        )}
      </Box>

      {!isLoading && (
        <Box
          sx={{ display: 'flex', py: 2, bgcolor: 'background.paper', alignContent: 'start', justifyContent: 'start' }}
        >
          {!props.isEntryPayment &&
          accountInfo &&
          accountInfo.totalPagoCuentaAbonos &&
          accountInfo.totalPagoCuentaRestante ? (
            <Typography sx={{ bgcolor: 'background.paper', py: 2 }} textAlign={'start'} variant="h4">
              <b>Total Restante:</b> {accountInfo?.totalPagoCuentaRestante}
            </Typography>
          ) : (
            <Typography sx={{ py: 2, my: 'auto' }} textAlign={'start'} variant="h5">
              <b>Total Cuenta:</b> {accountInfo?.totalPagoCuenta}
            </Typography>
          )}

          {props.isEntryPayment && (
            <Typography sx={{ py: 2 }} variant="h6" textAlign={'start'}>
              <b>Anticipo: {advance} (anticipo sugerido)</b>
            </Typography>
          )}
          <TextField
            sx={{ mx: 2, py: 2 }}
            variant="outlined"
            inputRef={inputRef}
            onKeyDown={handleKeyDown}
            inputProps={{
              inputMode: 'decimal',
              pattern: '[0-9]*',
            }}
            size="small"
            placeholder="Anticipo"
          />
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
          {isLoading || isLoadingSubmit ? <CircularProgress size={25} /> : 'Generar anticipo'}
        </Button>
      </Box>
    </Box>
  );
};
