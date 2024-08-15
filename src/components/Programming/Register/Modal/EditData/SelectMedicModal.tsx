import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  addMedicToRegister,
  getRegisterValidation,
} from '../../../../../services/programming/admissionRegisterService';
import Swal from 'sweetalert2';
import { usePatientRegisterPaginationStore } from '../../../../../store/programming/patientRegisterPagination';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { surgeonOperatingRoomSchema } from '../../../../../schema/operatingRoom/operatingRoomSchema';
import { useGetMedics } from '../../../../../hooks/programming/useGetDoctors';
import { useGetMedicalShiftsByDate } from '../../../../../hooks/hospitalization/useGetMedicalShiftsByDate';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';

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
  registerId: string;
  surgeon: { id?: string; nombre?: string };
}

interface Input {
  medical: { id: string; nombre: string } | null;
}

const useGetValidation = (registerId: string) => {
  const [validate, setValidate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const validateData = await getRegisterValidation(registerId);
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
  const { setOpen, registerId } = props;
  const refetch = usePatientRegisterPaginationStore((state) => state.fetchData);
  const { isLoading, validate } = useGetValidation(registerId);
  const { doctorsData, isLoadingMedics } = useGetMedics();
  const [date, _] = useState(new Date());
  const { medicalShiftsData, isLoadingMedicalShifts } = useGetMedicalShiftsByDate(date);

  const {
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
    clearErrors,
  } = useForm<Input>({
    defaultValues: { medical: props.surgeon.id ? props.surgeon : null },
    resolver: zodResolver(surgeonOperatingRoomSchema),
  });

  const [selectedOption, setSelectedOption] = useState<'guardia' | 'otro'>('guardia');

  const onSubmit: SubmitHandler<Input> = async (data) => {
    try {
      await addMedicToRegister({
        id_Registro: registerId,
        id_Medico: data.medical?.id as string,
      });
      toast.success('Medico agregado con éxito!');
      setOpen(false);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error('Error al agregar medico');
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as 'guardia' | 'otro';
    setSelectedOption(value);
    setValue('medical', null);
    clearErrors();
  };

  useEffect(() => {
    if (isLoading) return;
    if (!validate) {
      Swal.fire({
        title: 'Advertencia',
        text: 'Es necesario agregar un Cuarto y/o Quirófano y su procedimiento antes de seleccionar un Medico',
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

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Agregar/Editar Medico" />
      <Box sx={topContainerStyle}>
        <Box sx={{ mb: 2 }}>
          <Typography>
            Medico Actual: <b>{props.surgeon.id ? props.surgeon.nombre : 'Sin Medico'}</b>{' '}
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)} id="form1">
          <RadioGroup value={selectedOption} onChange={handleRadioChange} row sx={{ mb: 2 }}>
            <FormControlLabel value="guardia" control={<Radio />} label="Médicos en guardia" />
            <FormControlLabel value="otro" control={<Radio />} label="Otro" />
          </RadioGroup>

          {selectedOption === 'guardia' ? (
            <>
              <Typography>Agregar medico en guardia</Typography>
              <Autocomplete
                onChange={(_, val) => {
                  if (!val) return;
                  setValue('medical', val);
                }}
                loading={isLoadingMedicalShifts}
                getOptionLabel={(option) => option.nombre}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={medicalShiftsData}
                value={watch('medical') ?? null}
                onInputChange={(_, __, reason) => {
                  if (reason === 'clear') {
                    setValue('medical', null);
                  }
                }}
                noOptionsText="No se encontraron medicos en guardia"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Selecciona un medico en guardia"
                    error={!!errors.medical?.message}
                    helperText={errors.medical?.message && 'Seleccione un medico en guardia'}
                  />
                )}
              />
            </>
          ) : (
            <>
              <Typography>Agregar medico</Typography>
              <Autocomplete
                onChange={(_, val) => {
                  if (!val) return;
                  setValue('medical', val);
                }}
                loading={isLoadingMedics}
                getOptionLabel={(option) => option.nombre}
                isOptionEqualToValue={(option, value) => option.id === value.id}
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
            </>
          )}
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
