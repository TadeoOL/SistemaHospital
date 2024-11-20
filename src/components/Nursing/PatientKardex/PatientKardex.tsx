import { Box, Modal, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
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
import Swal from 'sweetalert2';
import { IArticleDto } from '../../../types/hospitalization/articleRequestTypes';
import { useGetPharmacyConfig } from '../../../hooks/useGetPharmacyConfig';
import { NurseRequestModal } from '../../Pharmacy/UserRequest/Modal/NurseRequestModal';
import { AddXRayRequestModal } from '../../Hospitalization/XRayRequest/Modal/AddXRayRequest';

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
    id_CuentaEspacioHospitalario,
    id_CuentaPaciente,
    id_Cuarto,
    id_Paciente,
  } = location.state || {};
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const { data, isLoading } = useGetPatientKardex(id || '');
  const { data: diets, isLoading: isLoadingDiets } = useGetPatientDiets(id || '');
  const { data: vitalSigns, isLoading: isLoadingVitalSigns } = useGetPatientVitalSigns(id || '');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openAddVitalSignsModal, setOpenAddVitalSignsModal] = useState(false);
  const [openAddPatientDietModal, setOpenAddPatientDietModal] = useState(false);
  const { mutate: createKardex } = useCreateKardex();
  const { mutate: createVitalSigns } = useCreatePatientVitalSigns();
  const { data: pharmacyConfig } = useGetPharmacyConfig();
  const [openArticlesRequestModal, setOpenArticlesRequestModal] = useState(false);
  const [openXRayRequestModal, setOpenXRayRequestModal] = useState(false);
  const queryClient = useQueryClient();
  const [selectedArticles, setSelectedArticles] = useState<(IArticleDto & { nombreArticulo: string })[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [modalCloseCallback, setModalCloseCallback] = useState<() => void>(() => {});

  useEffect(() => {
    if (data) {
      setExpanded({
        ...data.reduce((acc, kardex) => ({ ...acc, [kardex.id]: true }), {}),
        ...(diets?.reduce((acc, diet) => ({ ...acc, [diet.id]: true }), {}) || {}),
        ...(vitalSigns?.reduce((acc, vitalSign) => ({ ...acc, [vitalSign.id]: true }), {}) || {}),
      });
    }
  }, [data, diets, vitalSigns]);

  const handleExpandClick = (kardexId: string) => {
    if (expanded[kardexId]) {
      setExpanded({ ...expanded, [kardexId]: !expanded[kardexId] });
    } else {
      setExpanded({ ...expanded, [kardexId]: true });
    }
  };

  const handleCreateServicesRequest = async (data: { Id_CuentaPaciente: string; Id_Servicios: string[] }) => {
    if (!data.Id_Servicios.length) return true;

    const result = await Swal.fire({
      title: '¿Deseas realizar una solicitud de los servicios seleccionados?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, registrar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setSelectedServices(data.Id_Servicios);
      return new Promise((resolve) => {
        const handleModalClose = () => {
          setOpenXRayRequestModal(false);
          resolve(true);
        };
        setModalCloseCallback(() => handleModalClose);
        setOpenXRayRequestModal(true);
      });
    }

    return false;
  };

  const handleCreateArticlesRequest = async (data: {
    Id_CuentaEspacioHospitalario: string;
    articulos: (IArticleDto & { nombreArticulo: string })[];
  }) => {
    if (!data.articulos.length) {
      return true;
    }

    const result = await Swal.fire({
      title: '¿Deseas realizar una solicitud de los artículos seleccionados?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, registrar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setSelectedArticles(data.articulos);
      setOpenArticlesRequestModal(true);

      return new Promise((resolve) => {
        const handleModalClose = () => {
          setOpenArticlesRequestModal(false);
          resolve(true);
        };
        setModalCloseCallback(() => handleModalClose);
      });
    }

    return false;
  };

  const handleCreateKardex = async (data: KardexFormData) => {
    createKardex(data, {
      onSuccess: async () => {
        const servicios = data.servicios?.map((service) => service.id_Servicio) || [];
        const articulos =
          data.medicamentos?.map((medicament) => ({
            id_Articulo: medicament.id_Articulo || '',
            cantidad: 1,
            nombreArticulo: medicament.nombreArticulo || '',
          })) || [];

        const servicesResult = await handleCreateServicesRequest({
          Id_CuentaPaciente: id_CuentaPaciente,
          Id_Servicios: servicios,
        });

        if (servicesResult) {
          const articlesResult = await handleCreateArticlesRequest({
            Id_CuentaEspacioHospitalario: id_CuentaEspacioHospitalario,
            articulos: articulos,
          });

          if (articlesResult) {
            setOpenCreateModal(false);
            toast.success('Kardex creado correctamente');
          }
        }
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
            pharmacyConfig={pharmacyConfig}
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
      <Modal
        open={openArticlesRequestModal}
        onClose={() => {
          setOpenArticlesRequestModal(false);
        }}
      >
        <Box>
          <NurseRequestModal
            setOpen={(value: boolean) => {
              if (!value) {
                modalCloseCallback?.();
              }
              setOpenArticlesRequestModal(value);
            }}
            refetch={() => {}}
            warehouseId={pharmacyConfig?.id_Almacen || ''}
            id_PatientAdmission={id || ''}
            id_PatientRoom={id_Cuarto || ''}
            id_Patient={id_Paciente || ''}
            articles={selectedArticles}
          />
        </Box>
      </Modal>
      <Modal open={openXRayRequestModal} onClose={() => setOpenXRayRequestModal(false)}>
        <>
          <AddXRayRequestModal
            setOpen={(value: boolean) => {
              if (!value) {
                modalCloseCallback();
              }
              setOpenXRayRequestModal(value);
            }}
            refetch={() => {}}
            services={selectedServices}
            id_Patient={id_Paciente}
            isPreselected
          />
        </>
      </Modal>
    </>
  );
};