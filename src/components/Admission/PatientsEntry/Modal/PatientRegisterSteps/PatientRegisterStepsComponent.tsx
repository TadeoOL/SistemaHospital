import { useEffect } from 'react';
import { usePatientEntryRegisterStepsStore } from '../../../../../store/admission/usePatientEntryRegisterSteps';
import { RegisterCalendarHospitalization } from './RegisterCalendarHospitalization';
import { RegisterPatientInfoComponent } from './RegisterPatientInfoComponent';
import { MedicalAndProcedureSelectorModal } from './MedicalAndProcedureSelectorModal';
import { AdmissionMedicinePackageSelectorModal } from './AdmissionMedicinePackageSelectorModal';
import { CabinetStudyRequestModal } from './CabinetStudyRequestModal';
import { PatientRegisterResumeModal } from './PatientRegisterResumeModal';
import { RegisterCalendarSurgery } from './RegisterCalendarSurgery';
interface PatientRegisterStepsComponentProps {
  setOpen: (open: boolean) => void;
}
export const PatientRegisterStepsComponent = ({ setOpen }: PatientRegisterStepsComponentProps) => {
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
    0: <RegisterCalendarSurgery setOpen={setOpen} />,
    1: <RegisterCalendarHospitalization setOpen={setOpen} />,
    2: <RegisterPatientInfoComponent setOpen={setOpen} />,
    3: <MedicalAndProcedureSelectorModal setOpen={setOpen} />,
    4: <AdmissionMedicinePackageSelectorModal setOpen={setOpen} />,
    5: <CabinetStudyRequestModal setOpen={setOpen} />,
    6: <PatientRegisterResumeModal setOpen={setOpen} />,
  };
  return RENDER_VIEW[step];
};
