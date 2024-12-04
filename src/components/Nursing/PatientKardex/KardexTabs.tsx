import { Box, Tab, Tabs } from '@mui/material';
import { useState, useEffect } from 'react';
import { KardexList } from './KardexList';
import { MedicalInstructionsCard } from './MedicalInstructions/MedicalInstructionsCard';
import { VitalSignsCard } from './PatientVitalSigns/VitalSignsCard';
import { DietCard } from './PatientDiet/DietCard';
import { IPatientKardex } from '../../../types/nursing/nursingTypes';
import { IPatientVitalSigns } from '../../../types/nursing/patientVitalSignsTypes';
import { IPatientDiet } from '../../../types/nursing/patientDietTypes';
import { MedicalInstructionsForm } from './MedicalInstructions/MedicalInstructionsForm';
import { DietForm, DietFormData } from './PatientDiet/DietForm';
import { VitalSignsForm } from './PatientVitalSigns/VitalSignsForm';
import { KardexFormData } from '@/schema/nursing/karedexSchema';
import { VitalSignsFormData } from '@/schema/nursing/vitalSignsSchema';
import { useGetPharmacyConfig } from '@/hooks/useGetPharmacyConfig';

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
  handleAddIndication: (data: KardexFormData) => void;
  handleAddVitalSigns: (data: VitalSignsFormData) => void;
  handleAddDiet: (data: DietFormData) => void;
  medicalInstructions: IPatientKardex[];
  vitalSigns: IPatientVitalSigns[];
  diets: IPatientDiet[];
  expanded: { [key: string]: boolean };
  handleExpandClick: (id: string) => void;
  handleCreateArticlesRequest: () => Promise<unknown>;
  handleCreateServicesRequest: () => Promise<unknown>;
  handleCheckMedication: (id: string, nombreArticulo: string) => void;
  handleCheckService: (id: string) => void;
  medicationChecked: string[];
  serviceChecked: string[];
}

export const KardexTabs = ({
  handleAddIndication,
  handleAddVitalSigns,
  handleAddDiet,
  medicalInstructions,
  vitalSigns,
  diets,
  expanded,
  handleExpandClick,
  handleCreateArticlesRequest,
  handleCreateServicesRequest,
  handleCheckMedication,
  handleCheckService,
  medicationChecked,
  serviceChecked,
}: KardexTabsProps) => {
  const [value, setValue] = useState(0);
  const [preloadedData, setPreloadedData] = useState<any>(null);
  const { data: pharmacyConfig } = useGetPharmacyConfig();

  useEffect(() => {
    if (value === 0 && medicalInstructions?.length > 0) {
      setPreloadedData(medicalInstructions[0]);
    } else if (value === 1 && vitalSigns?.length > 0) {
      setPreloadedData(vitalSigns[0]);
    } else if (value === 2 && diets?.length > 0) {
      setPreloadedData(diets[0]);
    }
  }, [value, medicalInstructions, vitalSigns, diets]);

  const getLastRecord = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        return medicalInstructions?.[0] || null;
      case 1:
        return vitalSigns?.[0] || null;
      case 2:
        return diets?.[0] || null;
      default:
        return null;
    }
  };

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setPreloadedData(getLastRecord(newValue));
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

      <Box sx={{ mt: 2 }}>
        {value === 0 && (
          <MedicalInstructionsForm
            initialData={preloadedData}
            onSubmit={handleAddIndication}
            pharmacyConfig={pharmacyConfig}
            handleCreateArticlesRequest={handleCreateArticlesRequest}
            handleCreateServicesRequest={handleCreateServicesRequest}
            handleCheckMedication={handleCheckMedication}
            handleCheckService={handleCheckService}
            medicationChecked={medicationChecked}
            serviceChecked={serviceChecked}
          />
        )}
        {value === 1 && <VitalSignsForm initialData={preloadedData} onSubmit={handleAddVitalSigns} />}
        {value === 2 && <DietForm initialData={preloadedData} onSubmit={handleAddDiet} />}
      </Box>

      <TabPanel value={value} index={0}>
        <KardexList<IPatientKardex>
          data={medicalInstructions}
          expanded={expanded}
          onExpandClick={handleExpandClick}
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
          CardComponent={DietCard}
          emptyStateProps={{
            type: 'diet',
          }}
        />
      </TabPanel>
    </Box>
  );
};
