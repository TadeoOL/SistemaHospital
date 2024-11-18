import { Box, Tab, Tabs, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { KardexList } from './KardexList';
import { MedicalInstructionsCard } from './MedicalInstructions/MedicalInstructionsCard';
import { VitalSignsCard } from './PatientVitalSigns/VitalSignsCard';
import { DietCard } from './PatientDiet/DietCard';
import { IPatientKardex } from '../../../types/nursing/nursingTypes';
import { IPatientVitalSigns } from '../../../types/nursing/patientVitalSignsTypes';
import { IPatientDiet } from '../../../types/nursing/patientDietTypes';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`kardex-tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3, position: 'relative' }}>{children}</Box>}
    </div>
  );
}

interface KardexTabsProps {
  onAddIndication?: () => void;
  onAddVitalSigns?: () => void;
  onAddDiet?: () => void;
  medicalInstructions: IPatientKardex[];
  vitalSigns: IPatientVitalSigns[];
  diets: IPatientDiet[];
  expanded: { [key: string]: boolean };
  handleExpandClick: (id: string) => void;
}

export const KardexTabs = ({
  onAddIndication,
  onAddVitalSigns,
  onAddDiet,
  medicalInstructions,
  vitalSigns,
  diets,
  expanded,
  handleExpandClick,
}: KardexTabsProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getButtonLabel = () => {
    switch (value) {
      case 0:
        return 'Agregar Indicación';
      case 1:
        return 'Registrar Signos Vitales';
      case 2:
        return 'Agregar Dieta';
      default:
        return '';
    }
  };

  const handleAddClick = () => {
    switch (value) {
      case 0:
        onAddIndication?.();
        break;
      case 1:
        onAddVitalSigns?.();
        break;
      case 2:
        onAddDiet?.();
        break;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="kardex tabs"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              color: 'white',
              bgcolor: 'primary.main',
              '&.Mui-selected': {
                color: 'white',
                bgcolor: 'primary.dark',
              },
            },
          }}
        >
          <Tab label="Instrucciones médicas" sx={{ flex: 1 }} />
          <Tab label="Registros de enfermería" sx={{ flex: 1 }} />
          <Tab label="Dietas" sx={{ flex: 1 }} />
        </Tabs>
      </Box>

      <Box
        sx={{
          position: 'relative',
          mt: 2,
          px: 3,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{
            position: 'absolute',
            right: 24,
            top: 0,
            zIndex: 1,
          }}
        >
          {getButtonLabel()}
        </Button>
      </Box>

      <TabPanel value={value} index={0}>
        <KardexList<IPatientKardex>
          data={medicalInstructions}
          expanded={expanded}
          onExpandClick={handleExpandClick}
          onCreateClick={onAddIndication || (() => {})}
          CardComponent={MedicalInstructionsCard}
          emptyStateProps={{
            type: 'kardex',
          }}
        />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <KardexList<IPatientVitalSigns>
          data={vitalSigns}
          expanded={expanded}
          onExpandClick={handleExpandClick}
          onCreateClick={onAddVitalSigns || (() => {})}
          CardComponent={VitalSignsCard}
          emptyStateProps={{
            type: 'vitalsigns',
          }}
        />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <KardexList<IPatientDiet>
          data={diets}
          expanded={expanded}
          onExpandClick={handleExpandClick}
          onCreateClick={onAddDiet || (() => {})}
          CardComponent={DietCard}
          emptyStateProps={{
            type: 'diet',
          }}
        />
      </TabPanel>
    </Box>
  );
};
