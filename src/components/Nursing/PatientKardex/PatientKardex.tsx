import { Box, Modal, Paper } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useGetPatientKardex } from '../../../hooks/nursing/useGetPatientKardex';
import { useLocation, useParams } from 'react-router-dom';
import LoadingView from '../../../views/LoadingView/LoadingView';
import { useCreateKardex } from '../../../hooks/nursing/useCreateKardex';
import { KardexFormData } from '../../../schema/nursing/karedexSchema';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { PatientHeader } from './PatientHeader';
import { KardexTabs } from './KardexTabs';
import { useGetPatientDiets } from '../../../hooks/nursing/useGetPatientDiets';
import { useGetPatientVitalSigns } from '../../../hooks/nursing/useGetPatientVitalSigns';
import { VitalSignsFormData } from '../../../schema/nursing/vitalSignsSchema';
import { useCreatePatientVitalSigns } from '../../../hooks/nursing/useCreatePatientVitalSigns';
import Swal from 'sweetalert2';
import { IArticleDto } from '../../../types/hospitalization/articleRequestTypes';
import { useGetPharmacyConfig } from '../../../hooks/useGetPharmacyConfig';
import { NurseRequestModal } from '../../Pharmacy/UserRequest/Modal/NurseRequestModal';
import { AddXRayRequestModal } from '../../Hospitalization/XRayRequest/Modal/AddXRayRequest';
import { DietFormData } from './PatientDiet/DietForm';

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
    id_CuentaEspacioHospitalario: _id_CuentaEspacioHospitalario,
    id_Cuarto,
    id_Paciente,
  } = location.state || {};
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const { data, isLoading } = useGetPatientKardex(id || '');
  const { data: diets, isLoading: isLoadingDiets } = useGetPatientDiets(id || '');
  const { data: vitalSigns, isLoading: isLoadingVitalSigns } = useGetPatientVitalSigns(id || '');
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

  const handleCreateServicesRequest = useCallback(async () => {
    if (!selectedServices.length) {
      toast.info('No hay servicios seleccionados');
      return true;
    }

    const result = await Swal.fire({
      title: '¿Deseas realizar una solicitud de los servicios seleccionados?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, registrar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      return new Promise((resolve) => {
        const handleModalClose = () => {
          setOpenXRayRequestModal(false);
          setSelectedServices([]);
          resolve(true);
        };
        setModalCloseCallback(() => handleModalClose);
        setOpenXRayRequestModal(true);
      });
    }

    return false;
  }, [selectedServices]);

  const handleCreateArticlesRequest = useCallback(async () => {
    if (!selectedArticles.length) {
      toast.info('No hay artículos seleccionados');
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
      setOpenArticlesRequestModal(true);

      return new Promise((resolve) => {
        const handleModalClose = () => {
          setOpenArticlesRequestModal(false);
          setSelectedArticles([]);
          resolve(true);
        };
        setModalCloseCallback(() => handleModalClose);
      });
    }

    return false;
  }, [selectedArticles]);

  const handleCreateKardex = async (data: KardexFormData) => {
    createKardex(
      { ...data, id_IngresoPaciente: id || '' },
      {
        onSuccess: () => {
          toast.success('Kardex creado correctamente');
        },
        onError: () => {
          toast.error('Error al crear el kardex');
        },
      }
    );
  };

  const handleCreateVitalSigns = (data: VitalSignsFormData) => {
    createVitalSigns(
      { ...data, id_IngresoPaciente: id || '' },
      {
        onSuccess: () => {
          toast.success('Signos vitales creados correctamente');
        },
        onError: () => {
          toast.error('Error al crear los signos vitales');
        },
      }
    );
  };

  const handleCreatePatientDiet = (data: DietFormData) => {
    createKardex(
      { ...data, id_IngresoPaciente: id || '' },
      {
        onSuccess: () => {
          toast.success('Dieta creada correctamente');
          queryClient.invalidateQueries({ queryKey: ['patient-diets', id] });
        },
        onError: () => {
          toast.error('Error al crear la dieta');
        },
      }
    );
  };

  const handleCheckMedication = (id: string, nombreArticulo: string) => {
    if (selectedArticles.some((article) => article.id_Articulo === id)) {
      setSelectedArticles((prev) => prev.filter((article) => article.id_Articulo !== id));
    } else {
      setSelectedArticles((prev) => [...prev, { id_Articulo: id, nombreArticulo, cantidad: 1 }]);
    }
  };

  const handleCheckService = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices((prev) => prev.filter((service) => service !== id));
    } else {
      setSelectedServices((prev) => [...prev, id]);
    }
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
          handleAddIndication={handleCreateKardex}
          handleAddVitalSigns={handleCreateVitalSigns}
          handleAddDiet={handleCreatePatientDiet}
          diets={diets || []}
          medicalInstructions={data || []}
          vitalSigns={vitalSigns || []}
          expanded={expanded}
          handleExpandClick={handleExpandClick}
          handleCreateArticlesRequest={handleCreateArticlesRequest}
          handleCreateServicesRequest={handleCreateServicesRequest}
          handleCheckMedication={handleCheckMedication}
          handleCheckService={handleCheckService}
          medicationChecked={selectedArticles.map((article) => article.id_Articulo || '')}
          serviceChecked={selectedServices}
        />
      </Paper>

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
