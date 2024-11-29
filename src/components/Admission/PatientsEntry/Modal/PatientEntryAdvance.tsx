import { Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import { useConnectionSocket } from '../../../../store/checkout/connectionSocket';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { usePatientRegisterPaginationStore } from '../../../../store/programming/patientRegisterPagination';
import { useGetPatientAccount } from '../../../../hooks/checkout/useGetPatientAccount';
import { createPatientAccountDeposit } from '../../../../services/checkout/patientAccount';
import { DepositType } from '../../../../types/checkout/patientAccountTypes';

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

  return (
    <Box sx={style}>
      <HeaderModal
        setOpen={props.setOpen}
        title={`Admisión paciente ${accountInfo ? ` - Paciente: ${accountInfo.paciente?.nombrePaciente || ''}` : ''}`}
      />

      {!isLoading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  gap: 2,
                }}
              >
                <Typography variant="h5" sx={{ whiteSpace: 'nowrap' }}>
                  <b>Total a depositar:</b>
                </Typography>
                <Box sx={{ width: '100%', maxWidth: { md: '200px' } }}>
                  <TextField
                    fullWidth
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
                        display: 'block',
                      }}
                    >
                      Deposito sugerido: ${advance}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
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
