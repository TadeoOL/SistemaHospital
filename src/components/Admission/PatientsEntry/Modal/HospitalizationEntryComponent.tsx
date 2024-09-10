import { useEffect } from 'react';
import { usePatientEntryRegisterStepsStore } from '../../../../store/admission/usePatientEntryRegisterSteps';
import { MedicalAndProcedureSelectorModal } from './PatientRegisterSteps/MedicalAndProcedureSelectorModal';
import { PatientRegisterResumeModal } from './PatientRegisterSteps/PatientRegisterResumeModal';
import { RegisterCalendarHospitalization } from './PatientRegisterSteps/RegisterCalendarHospitalization';
import { RegisterPatientInfoComponent } from './PatientRegisterSteps/RegisterPatientInfoComponent';

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
    0: <RegisterCalendarHospitalization setOpen={setOpen} />,
    1: <RegisterPatientInfoComponent setOpen={setOpen} hospitalization />,
    2: <MedicalAndProcedureSelectorModal setOpen={setOpen} />,
    3: <PatientRegisterResumeModal setOpen={setOpen} hospitalization />,
  };

  return RENDER_VIEW[step];
};
