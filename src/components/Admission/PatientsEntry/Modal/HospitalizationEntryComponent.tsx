import { useEffect } from 'react';
import { usePatientEntryRegisterStepsStore } from '../../../../store/admission/usePatientEntryRegisterSteps';
import { MedicalAndProcedureSelectorModal } from './PatientRegisterSteps/MedicalAndProcedureSelectorModal';
import { PatientRegisterResumeModal } from './PatientRegisterSteps/PatientRegisterResumeModal';
import { RegisterCalendarHospitalization } from './PatientRegisterSteps/RegisterCalendarHospitalization';
import { RegisterPatientInfoComponent } from './PatientRegisterSteps/RegisterPatientInfoComponent';
import { ClinicalDataForm } from '../../../Programming/RegisterSteps/ClinicalDataForm';
import { Box } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 900, lg: 1100 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 550, xl: 900 },
};

interface HospitalizationEntryComponentProps {
  setOpen: Function;
}
export const HospitalizationEntryComponent = ({ setOpen }: HospitalizationEntryComponentProps) => {
  const step = usePatientEntryRegisterStepsStore((state) => state.step);
  const clearStore = usePatientEntryRegisterStepsStore((state) => state.clearStore);

  useEffect(() => {
    return () => {
      clearStore();
      localStorage.removeItem('medicData');
      localStorage.removeItem('proceduresList');
    };
  }, [clearStore]);

  const RENDER_VIEW: Record<number, JSX.Element> = {
    0: <RegisterCalendarHospitalization setOpen={setOpen} hospitalization />,
    1: <RegisterPatientInfoComponent setOpen={setOpen} hospitalization />,
    2: <MedicalAndProcedureSelectorModal setOpen={setOpen} />,
    3: (
      <Box sx={modalStyle}>
        <ClinicalDataForm setOpen={setOpen} hospitalization />
      </Box>
    ),
    4: <PatientRegisterResumeModal setOpen={setOpen} hospitalization />,
  };

  return RENDER_VIEW[step];
};
