import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import dayjs from 'dayjs';
import { DisabledByDefault } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { disableAnesthesiologistShift } from '../../../../services/hospitalization/anesthesiologistShift';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
};
interface AnesthesiologistShiftInfoModalProps {
  setOpen: Function;
  anesthesiologistName: string;
  startShift: Date;
  endShift: Date;
  shiftId: string;
}

export const AnesthesiologistShiftInfoModal = (props: AnesthesiologistShiftInfoModalProps) => {
  const handleDisableShift = async () => {
    try {
      await disableAnesthesiologistShift(props.shiftId);
      // refetch();
      Swal.fire('Guardia deshabilitada', 'La guardia ha sido deshabilitada correctamente', 'success');
      props.setOpen(false);
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al deshabilitar la guardia', 'error');
    }
  };

  const handleDisable = () => {
    Swal.fire({
      title: '¿Estás seguro de deshabilitar la guardia?',
      text: 'Esta acción no se puede revertir.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, deshabilitar!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDisableShift();
      }
    });
  };
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Información de la guardia" />
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <Typography>Nombre del anestesiólogo:</Typography>
            <Typography>{props.anesthesiologistName}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>Fecha de inicio:</Typography>
            <Typography>{dayjs(props.startShift).format('DD/MM/YYYY - HH:mm')}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>Fecha de fin:</Typography>
            <Typography>{dayjs(props.endShift).format('DD/MM/YYYY - HH:mm')}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 1 }} />
        <Button fullWidth color="error" variant="contained" startIcon={<DisabledByDefault />} onClick={handleDisable}>
          Deshabilitar guardia
        </Button>
      </Box>
      <Box sx={{ bgcolor: 'background.paper', p: 1, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
        <Button variant="outlined" color="error" onClick={() => props.setOpen(false)}>
          Cerrar
        </Button>
      </Box>
    </Box>
  );
};
