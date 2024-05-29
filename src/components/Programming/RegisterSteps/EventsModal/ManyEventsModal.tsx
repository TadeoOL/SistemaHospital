import { Box, Button, Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 950 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
};

interface ManyEventsModalProps {
  setOpen: Function;
}

export const ManyEventsModal = (props: ManyEventsModalProps) => {
  return (
    <Box sx={style}>
      <Box>
        <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Registros de cuartos - 24/05/2024</Typography>
        <Typography sx={{ fontSize: 13, fontWeight: 200 }}>Revisa los detalles de los registros de cuartos.</Typography>
        <Typography>Registros de cuartos</Typography>
      </Box>
      <Box sx={{ bgcolor: 'background.paper', p: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={() => props.setOpen(false)}>
          Cerrar
        </Button>
      </Box>
    </Box>
  );
};
