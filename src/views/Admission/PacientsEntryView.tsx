import { PatientsEntry } from '../../components/Admission/PatientsEntry/PatientsEntry';
import { Stack } from '@mui/material';
import { PatientsEntryTab } from './PatientsEntryTab';
import { PatientsEntrySami } from '../../components/Admission/PatientsEntrySami/PatientsEntrySami';
import { usePatientEntryTabStore } from '../../store/admission/usePatientEntryTab';
const PATIENT_ENTRIES_VIEW: Record<number, JSX.Element> = {
  1: <PatientsEntry />,
  2: <PatientsEntrySami />,
};

const PacientsEntryView = () => {
  const tab = usePatientEntryTabStore((state) => state.tabValue);
  return (
    <Stack>
      <PatientsEntryTab />
      {PATIENT_ENTRIES_VIEW[tab]}
    </Stack>
  );
};

export default PacientsEntryView;
