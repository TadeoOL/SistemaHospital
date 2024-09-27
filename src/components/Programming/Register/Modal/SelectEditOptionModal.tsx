import {
  AirlineSeatFlatOutlined,
  Close,
  MedicalServices,
  PermIdentity,
  TextSnippet,
  Vaccines,
} from '@mui/icons-material';
import { Box, Grid, IconButton, Stack, Typography } from '@mui/material';
import { EditPersonalInfoModal } from './EditData/EditPersonalInfoModal';
import { EditClinicalInfoModal } from './EditData/EditClinicalInfoModal';
import { SelectProcedureToEdit } from './EditData/SelectProcedureToEdit';
import { EditCalendarEventModal } from './EditData/EditCalendarEventModal';
import { Procedimiento } from '../../../../types/admissionTypes';
import { SelectMedicModal } from './EditData/SelectMedicModal';

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
  fontSize: { xs: 14, md: 18 },
  fontWeight: 500,
};

const iconStyle = {
  color: 'rgba(0, 0, 0, 0.54)',
  height: { md: 50, xs: 25 },
  width: { md: 50, xs: 25 },
};

const cardStyle = {
  width: { md: '100%', xs: '50%' },
  height: { md: 200, xs: 75 },
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
  registerId: string;
  setRegisterRoomId: Function;
  registerRoomId: string;
  procedures?: Procedimiento[];
  medic: { id?: string; nombre?: string };
}
export const SelectEditOptionModal = (props: SelectEditOptionModalProps) => {
  switch (props.value) {
    case 0:
      return <MainMenuEditView setOpen={props.setOpen} setValue={props.setValue} />;
    case 1:
      return <EditPersonalInfoModal setOpen={props.setOpen} patientId={props.patientId} />;
    case 2:
      return <EditClinicalInfoModal clinicalDataId={props.clinicalHistoryId} setOpen={props.setOpen} />;
    case 3:
      return <EditCalendarEventModal setOpen={props.setOpen} registerId={props.registerId} />;
    case 4:
      return (
        <SelectProcedureToEdit
          setOpen={props.setOpen}
          setValue={props.setValue}
          procedures={props.procedures as Procedimiento[]}
          registerId={props.registerId}
        />
      );
    case 5:
      return (
        <SelectMedicModal
          setOpen={props.setOpen}
          setValue={props.setValue}
          registerId={props.registerId}
          surgeon={props.medic}
        />
      );
    default:
      break;
  }
};

export const MainMenuEditView = (props: { setOpen: Function; setValue: Function }) => {
  return (
    <Box sx={style}>
      <Stack sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: 'gray' }}>
            Selecciona una opción para editar
          </Typography>
          <IconButton onClick={() => props.setOpen(false)}>
            <Close sx={{ top: 'auto', left: 'auto' }} />
          </IconButton>
        </Box>
        <Grid container spacing={2} justifyContent="space-around" alignItems="center">
          <Grid
            sx={cardStyle}
            item
            md={5}
            onClick={() => {
              props.setValue(1);
            }}
          >
            <PermIdentity sx={iconStyle} />
            <Typography sx={typographyStyle}>Información personal</Typography>
          </Grid>
          <Grid
            item
            md={5}
            sx={cardStyle}
            onClick={() => {
              props.setValue(2);
            }}
          >
            <TextSnippet sx={iconStyle} />
            <Typography sx={typographyStyle}>Información clínica</Typography>
          </Grid>
          <Grid
            item
            md={5}
            sx={cardStyle}
            onClick={() => {
              props.setValue(3);
            }}
          >
            <AirlineSeatFlatOutlined sx={iconStyle} />
            <Typography sx={typographyStyle}>Cuartos</Typography>
          </Grid>
          <Grid
            item
            md={5}
            sx={cardStyle}
            onClick={() => {
              props.setValue(4);
            }}
          >
            <Vaccines sx={iconStyle} />
            <Typography sx={typographyStyle}>Procedimientos</Typography>
          </Grid>
          <Grid
            item
            md={5}
            sx={cardStyle}
            onClick={() => {
              props.setValue(5);
            }}
          >
            <MedicalServices sx={iconStyle} />
            <Typography sx={typographyStyle}>Medico</Typography>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};
