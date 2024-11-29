import { Autocomplete, Backdrop, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { surgeonOperatingRoomSchema } from '../../../../../schema/operatingRoom/operatingRoomSchema';
import { useGetMedics } from '../../../../../hooks/programming/useGetDoctors';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { modifyPatientMedic } from '@/services/admission/admisionService';
import { usePatientEntryPaginationStore } from '@/store/admission/usePatientEntryPagination';

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
  maxHeight: { xs: 650, md: 900 },
};
const topContainerStyle = {
  bgcolor: 'background.paper',
  p: 2,
};
const bottomContainerStyle = {
  bgcolor: 'background.paper',
  p: 1,
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
  display: 'flex',
  justifyContent: 'space-between',
};

interface SelectMedicModalProps {
  setOpen: Function;
  setValue: Function;
  surgeon: { id?: string; nombre?: string };
  patientAccountId: string;
}

interface Input {
  medical: { id_Medico: string; nombre: string; apellidoPaterno: string; apellidoMaterno: string } | null;
}

const useGetValidation = () => {
  const [validate, setValidate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const validateData = true; //await getRegisterValidation(registerId);
      setValidate(validateData);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return {
    validate,
    isLoading,
  };
};

export const SelectMedicModal = (props: SelectMedicModalProps) => {
  const { setOpen } = props;
  const refetch = usePatientEntryPaginationStore((state) => state.fetchData);
  const { isLoading, validate } = useGetValidation();
  const { doctorsData, isLoadingMedics } = useGetMedics();
  //const [date, _] = useState(new Date());
  const currentDoctor = doctorsData.find((doctor) => doctor.id_Medico === props.surgeon.id);

  const {
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<Input>({
    defaultValues: { medical: props.surgeon.id ? currentDoctor : null },
    resolver: zodResolver(surgeonOperatingRoomSchema),
  });

  const onSubmit: SubmitHandler<Input> = async (data) => {
    try {
      await modifyPatientMedic({
        id_Medico: data.medical?.id_Medico as string,
        id_CuentaPaciente: props.patientAccountId,
      });
      toast.success('Medico agregado con éxito!');
      setOpen(false);
      refetch();
    } catch (error: any) {
      if (error.errorCode == '1002') {
        toast.error(error.Detail);
      } else if (error.errorCode == '1003') {
        toast.error(error.Detail);
      } else {
        console.error(error);
        toast.error('Error al agregar medico');
      }
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!validate) {
      Swal.fire({
        title: 'Advertencia',
        text: 'Es necesario agregar un Quirófano y su procedimiento antes de seleccionar un Medico',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
      props.setValue(0);
      return;
    }
  }, [isLoading, validate]);

  if (isLoading)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );

  console.log({ doctorsData });
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Agregar/Editar Medico" />
      <Box sx={topContainerStyle}>
        <Box sx={{ mb: 2 }}>
          <Typography>
            Medico actual de ingreso: <b>{props.surgeon.id ? currentDoctor?.nombre : 'Sin Medico'}</b>{' '}
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)} id="form1">
          <Typography>Agregar medico</Typography>
          <Autocomplete
            onChange={(_, val) => {
              if (!val) return;
              setValue('medical', val);
            }}
            loading={isLoadingMedics}
            getOptionLabel={(option) => `${option.nombre}`}
            isOptionEqualToValue={(option, value) => {
              console.log({ option, value });
              return option.id_Medico === value.id_Medico;
            }}
            options={doctorsData}
            value={watch('medical') ?? null}
            onInputChange={(_, __, reason) => {
              if (reason === 'clear') {
                setValue('medical', null);
              }
            }}
            noOptionsText="No se encontraron medicos"
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Medicos"
                error={!!errors.medical?.message}
                helperText={errors.medical?.message && 'Seleccione un medico'}
              />
            )}
          />
        </form>
      </Box>
      <Box sx={bottomContainerStyle}>
        <Button onClick={() => props.setValue(0)} variant="outlined">
          Regresar
        </Button>
        <Button type="submit" form="form1" variant="contained">
          Agregar
        </Button>
      </Box>
    </Box>
  );
};
