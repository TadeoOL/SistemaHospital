import { useEffect, useState } from 'react';
import { HistorialClinico, Paciente } from '../../../../types/admissionTypes';
import { getClinicalHistoryById } from '../../../../services/programming/clinicalHistoryService';
import { getPatientById } from '../../../../services/programming/patientService';
import { Box, Button } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { EventPatientDetails } from '../../RegisterSteps/EventsModal/EventPatientDetails';
import { EventClinicalHistoryDetails } from '../../RegisterSteps/EventsModal/EventClinicalHistoryDetails';

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

interface PatientInfoModalProps {
  setOpen: Function;
  clinicalHistoryId?: string;
  patientId?: string;
}

const useGetData = (clinicalHistoryId?: string, patientId?: string) => {
  const [data, setData] = useState<HistorialClinico | Paciente>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (clinicalHistoryId) {
          const res = await getClinicalHistoryById(clinicalHistoryId);
          setData(res);
          setIsLoading(false);
        }
        if (patientId) {
          const res = await getPatientById(patientId);
          setData(res);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, isLoading };
};
export const PatientInfoModal = (props: PatientInfoModalProps) => {
  const patient = props.patientId ? true : false;
  const { data, isLoading } = useGetData(props.clinicalHistoryId, props.patientId);

  if (isLoading) return <div>Loading</div>;
  return (
    <Box sx={style}>
      <HeaderModal
        setOpen={props.setOpen}
        title={`Información del ${props.patientId ? 'Paciente' : 'Historial Clínico'}`}
      />
      <Box sx={{ bgcolor: 'background.paper', p: 3 }}>{data && showViewInfo(patient, data)}</Box>
      <Box sx={{ bgcolor: 'background.paper', display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <Button variant="outlined" color="error" onClick={() => props.setOpen(false)}>
          Cerrar
        </Button>
      </Box>
    </Box>
  );
};

const showViewInfo = (patient: boolean, data: HistorialClinico | Paciente) => {
  if (patient) {
    return <EventPatientDetails patientData={data as Paciente} />;
  } else {
    return <EventClinicalHistoryDetails clinicalHistory={data as HistorialClinico} />;
  }
};
