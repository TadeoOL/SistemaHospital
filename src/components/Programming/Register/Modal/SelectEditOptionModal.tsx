import { CalendarMonth, Close, PermIdentity, TextSnippet } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { EditPersonalInfoModal } from './EditData/EditPersonalInfoModal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 650 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
};

const typographyStyle = {
  fontSize: 18,
  fontWeight: 500,
};

const iconStyle = {
  color: 'rgba(0, 0, 0, 0.54)',
  height: 50,
  width: 50,
};

const cardStyle = {
  width: '100%',
  height: 200,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 10,
  boxShadow: '5px 5px 5px 5px rgba(0,0,0,.1)',
  m: 2,
  cursor: 'pointer',
  p: 4,
  transition: '0.15s ease-in-out',
  '&:hover': {
    transition: '0.15s ease-in-out',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    cursor: 'pointer',
    transform: 'scale(1.05)',
    boxShadow: '7px 7px 7px 7px rgba(0,0,0,.1)',
  },
};
interface SelectEditOptionModalProps {
  setOpen: Function;
  patientId: string;
  clinicalHistoryId: string;
  value: number;
  setValue: Function;
}
export const SelectEditOptionModal = (props: SelectEditOptionModalProps) => {
  switch (props.value) {
    case 0:
      return <MainMenuEditView setOpen={props.setOpen} setValue={props.setValue} />;
    case 1:
      return <EditPersonalInfoModal setOpen={props.setOpen} patientId={props.patientId} />;
    case 2:
      return <h1>clinico</h1>;
    case 3:
      return <h1>Calendario</h1>;
    default:
      break;
  }
};

export const MainMenuEditView = (props: { setOpen: Function; setValue: Function }) => {
  return (
    <Box sx={style}>
      <Stack sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700 }}>Selecciona una opción para editar</Typography>
          <IconButton onClick={() => props.setOpen(false)}>
            <Close sx={{ top: 'auto', left: 'auto' }} />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <Box sx={cardStyle}>
            <CalendarMonth sx={iconStyle} />
            <Typography sx={typographyStyle}>Calendario</Typography>
          </Box>
          <Box
            sx={cardStyle}
            onClick={() => {
              props.setValue(1);
            }}
          >
            <PermIdentity sx={iconStyle} />
            <Typography sx={typographyStyle}>Información personal</Typography>
          </Box>
          <Box sx={cardStyle}>
            <TextSnippet sx={iconStyle} />
            <Typography sx={typographyStyle}>Información clínica</Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};
