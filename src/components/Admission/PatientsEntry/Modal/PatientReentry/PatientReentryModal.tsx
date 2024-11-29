import { usePatientEntryRegisterStepsStore } from '@/store/admission/usePatientEntryRegisterSteps';
import { RegisterCalendarSurgery } from '../PatientRegisterSteps/RegisterCalendarSurgery';
import { MedicalAndProcedureSelectorModal } from '../PatientRegisterSteps/MedicalAndProcedureSelectorModal';
import { useGetPatientReentryInfo } from '@/hooks/admission/useGetPatientReentryInfo';
import { FullscreenLoader } from '@/common/components';
import { useSetPatientReentryInfo } from '@/hooks/admission/useSetPatientReentryInfo';
import { useEffect } from 'react';
import { AdmissionMedicinePackageSelectorModal } from '../PatientRegisterSteps/AdmissionMedicinePackageSelectorModal';
import { CabinetStudyRequestModal } from '../PatientRegisterSteps/CabinetStudyRequestModal';
import { PatientRegisterResumeModal } from '../PatientRegisterSteps/PatientRegisterResumeModal';

interface Props {
  setOpen: Function;
  patientAccountId: string;
}

export const PatientReentryModal = ({ setOpen, patientAccountId }: Props) => {
  const step = usePatientEntryRegisterStepsStore((state) => state.step);
  const clearData = usePatientEntryRegisterStepsStore((state) => state.clearStore);
  const { data: patientReentryInfo, isLoading } = useGetPatientReentryInfo(patientAccountId);

  useSetPatientReentryInfo(patientReentryInfo);

  useEffect(() => {
    return () => {
      clearData();
    };
  }, []);

  const RENDER_VIEW: Record<number, JSX.Element> = {
    0: <RegisterCalendarSurgery setOpen={setOpen} />,
    1: <MedicalAndProcedureSelectorModal setOpen={setOpen} />,
    2: <AdmissionMedicinePackageSelectorModal setOpen={setOpen} />,
    3: <CabinetStudyRequestModal setOpen={setOpen} />,
    4: <PatientRegisterResumeModal setOpen={setOpen} reentry patientAccountId={patientAccountId} />,
  };

  if (isLoading) return <FullscreenLoader />;
  return RENDER_VIEW[step];
};
