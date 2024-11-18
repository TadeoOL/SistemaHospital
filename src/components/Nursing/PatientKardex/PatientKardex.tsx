import { Box, Modal, Paper } from '@mui/material';
import { useState } from 'react';
import { useGetPatientKardex } from '../../../hooks/nursing/useGetPatientKardex';
import { useLocation, useParams } from 'react-router-dom';
import LoadingView from '../../../views/LoadingView/LoadingView';
import { CreateKardexModal } from './MedicalInstructions/CreateKardexModal';
import { useCreateKardex } from '../../../hooks/nursing/useCreateKardex';
import { KardexFormData } from '../../../schema/nursing/karedexSchema';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { PatientHeader } from './PatientHeader';
import { KardexTabs } from './KardexTabs';
import { useGetPatientDiets } from '../../../hooks/nursing/useGetPatientDiets';
import { useGetPatientVitalSigns } from '../../../hooks/nursing/useGetPatientVitalSigns';
import { AddVitalSignsModal } from './PatientVitalSigns/AddVitalSignsModal';
import { VitalSignsFormData } from '../../../schema/nursing/vitalSignsSchema';
import { useCreatePatientVitalSigns } from '../../../hooks/nursing/useCreatePatientVitalSigns';
import { AddPatientDietModal, DietFormData } from './PatientDiet/AddPatientDietModal';

export const PatientKardex = () => {
  const { id } = useParams();
  const location = useLocation();
  const {
    nombrePaciente,
    nombreCuarto,
    medico,
    edad,
    genero,
    motivoIngreso,
    tipoSangre,
    alergias,
    comentarios,
    diagnosticoIngreso,
  } = location.state || {};
  const [expanded, setExpanded] = useState<string | false>(false);
  const { data, isLoading } = useGetPatientKardex(id || '');
  const { data: diets, isLoading: isLoadingDiets } = useGetPatientDiets(id || '');
  const { data: vitalSigns, isLoading: isLoadingVitalSigns } = useGetPatientVitalSigns(id || '');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openAddVitalSignsModal, setOpenAddVitalSignsModal] = useState(false);
  const [openAddPatientDietModal, setOpenAddPatientDietModal] = useState(false);
  const { mutate: createKardex } = useCreateKardex();
  const { mutate: createVitalSigns } = useCreatePatientVitalSigns();
  const queryClient = useQueryClient();

  const handleExpandClick = (kardexId: string) => {
    setExpanded(expanded === kardexId ? false : kardexId);
  };

  const handleCreateKardex = (data: KardexFormData) => {
    createKardex(data, {
      onSuccess: () => {
        setOpenCreateModal(false);
        toast.success('Kardex creado correctamente');
      },
      onError: () => {
        toast.error('Error al crear el kardex');
      },
    });
  };

  const handleCreateVitalSigns = (data: VitalSignsFormData) => {
    createVitalSigns(data, {
      onSuccess: () => {
        toast.success('Signos vitales creados correctamente');
        setOpenAddVitalSignsModal(false);
      },
      onError: () => {
        toast.error('Error al crear los signos vitales');
      },
    });
  };

  const handleCreatePatientDiet = (data: DietFormData) => {
    createKardex(data, {
      onSuccess: () => {
        toast.success('Dieta creada correctamente');
        queryClient.invalidateQueries({ queryKey: ['patient-diets', id] });
        setOpenAddPatientDietModal(false);
      },
      onError: () => {
        toast.error('Error al crear la dieta');
      },
    });
  };

  if (isLoading || isLoadingDiets || isLoadingVitalSigns) return <LoadingView />;

  return (
    <>
      <Box sx={{ py: { xs: 1, sm: 1 }, px: { xs: 2, sm: 4 } }}>
        <PatientHeader
          nombrePaciente={nombrePaciente}
          nombreCuarto={nombreCuarto}
          medico={medico}
          edad={edad}
          genero={genero}
          motivoIngreso={motivoIngreso}
          tipoSangre={tipoSangre}
          alergias={alergias}
          comentarios={comentarios}
          diagnosticoIngreso={diagnosticoIngreso}
        />
      </Box>
      <Paper
        elevation={0}
        sx={{
          borderRadius: { xs: 2, sm: 4 },
          overflow: 'hidden',
          minHeight: '90vh',
          bgcolor: 'background.paper',
        }}
      >
        <KardexTabs
          onAddIndication={() => setOpenCreateModal(true)}
          onAddVitalSigns={() => setOpenAddVitalSignsModal(true)}
          onAddDiet={() => setOpenAddPatientDietModal(true)}
          diets={diets || []}
          medicalInstructions={data || []}
          vitalSigns={vitalSigns || []}
          expanded={expanded}
          handleExpandClick={handleExpandClick}
        />
      </Paper>

      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)} hideBackdrop>
        <>
          <CreateKardexModal
            open={openCreateModal}
            onClose={() => setOpenCreateModal(false)}
            onSubmit={handleCreateKardex}
            id_IngresoPaciente={id || ''}
          />
        </>
      </Modal>

      <AddVitalSignsModal
        open={openAddVitalSignsModal}
        onClose={() => setOpenAddVitalSignsModal(false)}
        onSubmit={handleCreateVitalSigns}
        id_IngresoPaciente={id || ''}
      />
      <AddPatientDietModal
        open={openAddPatientDietModal}
        onClose={() => setOpenAddPatientDietModal(false)}
        onSubmit={handleCreatePatientDiet}
        id_IngresoPaciente={id || ''}
      />
    </>
  );
};
