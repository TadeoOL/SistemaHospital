import { Box, Modal, Paper } from '@mui/material';
import { useState } from 'react';
import { useGetPatientKardex } from '../../../hooks/nursing/useGetPatientKardex';
import { useLocation, useParams } from 'react-router-dom';
import LoadingView from '../../../views/LoadingView/LoadingView';
import { CreateKardexModal } from './CreateKardexModal';
import { useCreateKardex } from '../../../hooks/nursing/useCreateKardex';
import { KardexFormData } from '../../../schema/nursing/karedexSchema';
import { toast } from 'react-toastify';
import { IPatientKardex } from '../../../types/nursing/nursingTypes';
import { useQueryClient } from '@tanstack/react-query';
import { KardexStats } from './KardexStats';
import { PatientHeader } from './PatientHeader';
import { KardexHeader } from './KardexHeader';
import { KardexList } from './KardexList';

export const PatientKardex = () => {
  const { id } = useParams();
  const location = useLocation();
  const { nombrePaciente, nombreCuarto, medico } = location.state || {};
  const [expanded, setExpanded] = useState<string | false>(false);
  const { data, isLoading } = useGetPatientKardex(id || '');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { mutate: createKardex } = useCreateKardex();
  const queryClient = useQueryClient();

  const handleExpandClick = (kardexId: string) => {
    setExpanded(expanded === kardexId ? false : kardexId);
  };

  const handleCreateKardex = (data: KardexFormData) => {
    createKardex(data, {
      onSuccess: (data) => {
        setOpenCreateModal(false);
        toast.success('Kardex creado correctamente');
        queryClient.setQueryData(['patient-kardex', id], (oldData: IPatientKardex[] | undefined) => {
          return [...(oldData || []), data];
        });
      },
      onError: () => {
        toast.error('Error al crear el kardex');
      },
    });
  };

  if (isLoading) return <LoadingView />;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: { xs: 2, sm: 4 },
        overflow: 'hidden',
        bgcolor: 'grey.50',
        minHeight: '90vh',
      }}
    >
      <Box
        sx={{
          bgcolor: 'primary.main',
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 4 },
          color: 'primary.contrastText',
          borderBottom: '4px solid',
        }}
      >
        <KardexHeader onCreateClick={() => setOpenCreateModal(true)} />
        <PatientHeader nombrePaciente={nombrePaciente} nombreCuarto={nombreCuarto} medico={medico} />
      </Box>

      <Box
        sx={{
          p: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, sm: 3 },
        }}
      >
        <KardexStats data={data} />
        <KardexList
          data={data}
          expanded={expanded}
          onExpandClick={handleExpandClick}
          onCreateClick={() => setOpenCreateModal(true)}
        />
      </Box>

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
    </Paper>
  );
};
