import { Box, Button, CircularProgress, DialogActions, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { ClinicalDataTab } from './tabs/ClinicalDataTab';
import { ChargedItemsTab } from './tabs/ChargedItemsTab';
import { useGetHospitalRoomInformation } from '../../../../../hooks/hospitalization/hospitalRoom/useGetHospitalRoomInformation';

interface Props {
  hospitalSpaceAccountId: string;
  setOpen: (open: boolean) => void;
}

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
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box
          sx={{
            p: 3,
            backgroundColor: 'white',
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

export const HospitalRoomInformationModal = ({ hospitalSpaceAccountId, setOpen }: Props) => {
  const { data: hospitalRoomInformation, isLoading } = useGetHospitalRoomInformation(hospitalSpaceAccountId);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  return (
    <Box sx={style}>
      <HeaderModal title="Información del Paciente" setOpen={setOpen} />
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            width: '100%',
            display: 'flex',
            p: 1,
            '& .MuiTab-root': {
              flex: 1,
            },
          }}
        >
          <Tab label="Datos Clínicos" sx={{ minWidth: '45%' }} />
          <Tab label="Artículos Cargados" sx={{ minWidth: '45%' }} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <ClinicalDataTab clinicalData={hospitalRoomInformation?.datosClinicos} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ChargedItemsTab chargedItems={hospitalRoomInformation?.articulosCargados} />
      </TabPanel>
      <DialogActions sx={{ backgroundColor: 'white', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
        <Button variant="outlined" color="error" onClick={() => setOpen(false)}>
          Cerrar
        </Button>
      </DialogActions>
    </Box>
  );
};
