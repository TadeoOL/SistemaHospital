import { Close } from '@mui/icons-material';
import { Backdrop, Box, Button, CircularProgress, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getEventDetails } from '../../../../services/programming/admissionRegisterService';
import { EventGeneralDetails } from './EventGeneralDetails';
import { IEventDetails } from '../../../../types/admissionTypes';
import { EventPatientDetails } from './EventPatientDetails';
import { EventClinicalHistoryDetails } from './EventClinicalHistoryDetails';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';

// const StyledTab = styled(Tab)(({ theme }) => ({
//   [`&.${tabClasses.root}`]: {
//     fontWeight: 'bold',
//     fontSize: 12,
//     backgroundColor: 'white',
//     color: `${theme.palette.primary.main}`,
//     borderRadius: 12,
//     paddingRight: 10,
//     '&:hover': {
//       backgroundColor: alpha(`${theme.palette.grey[100]}`, 1),
//     },
//   },
// }));

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

const scrollBarStyle = {
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

interface EventDetailsModalProps {
  setOpen: Function;
  eventId: string;
}

const useGetEventDetails = (eventId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState<any>();
  useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      try {
        const res = await getEventDetails(eventId);
        setEventDetails(res);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchEventDetails();
  }, []);
  return { isLoading, eventDetails };
};

export const EventDetailsModal = (props: EventDetailsModalProps) => {
  const { isLoading, eventDetails } = useGetEventDetails(props.eventId);
  const [tabValue, setTabValue] = useState(0);

  if (isLoading)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Información detallada" />
      <Box sx={{ bgcolor: 'background.paper', p: 3 }}>
        <Tabs
          value={tabValue}
          variant="fullWidth"
          onChange={(e, val) => {
            e.preventDefault();
            setTabValue(val);
          }}
        >
          <Tab label="Información del registro" value={0} style={{ height: '15px', paddingInline: '2em' }} />
          <Tab label="Información del paciente" value={1} />
          <Tab label="Información clínica" value={2} />
        </Tabs>
      </Box>
      <Box sx={{ bgcolor: 'background.paper', p: 4, overflowY: 'auto', ...scrollBarStyle }}>
        <Box sx={{ maxHeight: { xs: 450 } }}>{renderViewByTabValue(tabValue, eventDetails)}</Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 1,
          bgcolor: 'background.paper',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <Button variant="contained" onClick={() => props.setOpen(false)}>
          Cerrar
        </Button>
      </Box>
    </Box>
  );
};

const renderViewByTabValue = (tabValue: number, eventDetails: IEventDetails) => {
  switch (tabValue) {
    case 0:
      return <EventGeneralDetails eventDetails={eventDetails} />;
    case 1:
      return <EventPatientDetails patientData={eventDetails.paciente} />;
    case 2:
      return <EventClinicalHistoryDetails clinicalHistory={eventDetails.historialClinico} />;
    default:
      break;
  }
};
