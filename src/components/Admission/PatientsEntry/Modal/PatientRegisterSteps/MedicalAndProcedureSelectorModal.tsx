import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { Cancel } from '@mui/icons-material';
import {
  FieldErrorsImpl,
  SubmitHandler,
  UseControllerProps,
  UseFormSetValue,
  UseFormWatch,
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useGetMedics } from '../../../../../hooks/programming/useGetDoctors';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { useGetAllSurgeryProcedures } from '../../../../../hooks/programming/useGetAllSurgeryProcedure';
import { medicalAndProcedureSchema } from '../../../../../schema/admission/admissionSchema';
import { usePatientEntryRegisterStepsStore } from '../../../../../store/admission/usePatientEntryRegisterSteps';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 900, lg: 1100 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 550, xl: 900 },
};

interface Inputs {
  proceduresId: string[];
  xrayIds: string[];
  medicId: string;
  anesthesiologistId: string;
}

interface MedicalAndProcedureSelectorModalProps {
  setOpen: Function;
}
export const MedicalAndProcedureSelectorModal = (props: MedicalAndProcedureSelectorModalProps) => {
  const { data: proceduresRes, isLoadingProcedures } = useGetAllSurgeryProcedures();
  const { doctorsData } = useGetMedics();

  const setStep = usePatientEntryRegisterStepsStore((state) => state.setStep);
  const step = usePatientEntryRegisterStepsStore((state) => state.step);
  const setProcedures = usePatientEntryRegisterStepsStore((state) => state.setProcedures);
  const setMedicId = usePatientEntryRegisterStepsStore((state) => state.setMedicId);
  const procedures = usePatientEntryRegisterStepsStore((state) => state.procedures);
  const medicId = usePatientEntryRegisterStepsStore((state) => state.medicId);

  const {
    setValue,
    watch,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<Inputs>({
    resolver: zodResolver(medicalAndProcedureSchema),
    defaultValues: {
      proceduresId: procedures,
      medicId: medicId,
    },
  });
  const watchProceduresId = watch('proceduresId');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const medicData = doctorsData.find((m) => m.id === data.medicId);

    let proceduresMap: { [key: string]: { id: string; name: string; price: number } } = {};
    for (let i = 0; i < proceduresRes.length; i++) {
      proceduresMap[proceduresRes[i].id] = {
        id: proceduresRes[i].id,
        name: proceduresRes[i].nombre,
        price: proceduresRes[i].precio,
      };
    }

    let proceduresList = [];
    for (let i = 0; i < data.proceduresId.length; i++) {
      proceduresList.push(proceduresMap[data.proceduresId[i]]);
    }

    localStorage.setItem('proceduresList', JSON.stringify(proceduresList));
    localStorage.setItem('medicData', JSON.stringify({ id: medicData?.id, name: medicData?.nombre }));

    setProcedures(data.proceduresId);
    setMedicId(data.medicId);
    toast.success('Procedimiento y medico agregados!');
    setStep(step + 1);
  };

  if (isLoadingProcedures)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Selección de procedimiento y medico" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ backgroundColor: 'background.paper', p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, columnGap: 2, rowGap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography>Seleccione los procedimientos:</Typography>
              <TextField
                select
                SelectProps={{
                  multiple: true,
                  renderValue: (selected: any) => {
                    return (
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {selected &&
                          selected.map((value: string) => (
                            <Chip
                              key={value}
                              label={proceduresRes.find((v) => v.id === value)?.nombre}
                              style={{ margin: 2 }}
                              onDelete={() => {
                                const procedureList = watchProceduresId.filter((p) => p !== value);
                                setValue('proceduresId', procedureList);
                              }}
                              deleteIcon={<Cancel onMouseDown={(event) => event.stopPropagation()} />}
                            />
                          ))}
                      </div>
                    );
                  },
                }}
                label="Procedimientos"
                fullWidth
                error={!!errors.proceduresId?.message}
                helperText={errors.proceduresId?.message}
                value={watchProceduresId}
                {...register('proceduresId')}
              >
                {proceduresRes.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          <MedicSelectComponent error={errors} name="medicId" setValue={setValue} watch={watch} />
          <Divider sx={{ my: 1 }} />
        </Box>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            p: 1,
            display: 'flex',
            justifyContent: 'space-between',
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
        >
          <Button variant="outlined" onClick={() => setStep(step - 1)}>
            Regresar
          </Button>
          <Button variant="contained" type="submit">
            Siguiente
          </Button>
        </Box>
      </form>
    </Box>
  );
};

interface MedicSelectComponentProps<T extends Inputs> extends UseControllerProps<T> {
  setValue: UseFormSetValue<Inputs>;
  watch: UseFormWatch<Inputs>;
  error: FieldErrorsImpl<T>;
}

const MedicSelectComponent = <T extends Inputs>({ error, setValue, watch }: MedicSelectComponentProps<T>) => {
  const { doctorsData, isLoadingMedics } = useGetMedics();
  const valueToFind = doctorsData;

  return (
    <Box sx={{ display: 'flex', columnGap: 4 }}>
      <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        <Box>
          <Typography>Seleccione el medico que recomendó al paciente</Typography>
          <Autocomplete
            disablePortal
            fullWidth
            loading={isLoadingMedics}
            getOptionLabel={(option) => option.nombre}
            options={doctorsData}
            noOptionsText={`No se encontraron medicos`}
            onChange={(_, val) => {
              setValue('medicId', val?.id ?? '');
            }}
            value={
              valueToFind.find((d) => {
                return d.id === watch('medicId');
              }) ?? null
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!error?.medicId?.message}
                helperText={error?.medicId?.message as string}
                placeholder="Medico"
              />
            )}
          />
        </Box>
      </Box>
    </Box>
  );
};
