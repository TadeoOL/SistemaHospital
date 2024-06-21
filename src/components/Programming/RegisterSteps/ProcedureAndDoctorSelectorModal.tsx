import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { Cancel, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useGetAllSurgeryProcedures } from '../../../hooks/programming/useGetAllSurgeryProcedure';
import {
  FieldErrorsImpl,
  SubmitHandler,
  UseControllerProps,
  UseFormSetValue,
  UseFormWatch,
  useForm,
} from 'react-hook-form';
import { useProgrammingRegisterStore } from '../../../store/programming/programmingRegister';
import { useGetMedics } from '../../../hooks/programming/useGetDoctors';
import { useGetAnesthesiologists } from '../../../hooks/hospitalization/useGetAnesthesiologists';
import { ChangeEvent, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { procedureAndDoctorSelectorSchema } from '../../../schema/programming/programmingSchemas';
import { UploadFile } from '../../Commons/UploadFile';
import { toast } from 'react-toastify';

interface Inputs {
  proceduresId: string[];
  medicId: string;
  anesthesiologistId: string;
}

interface ProcedureAndDoctorSelectorModalProps {
  setOpen: Function;
}
export const ProcedureAndDoctorSelectorModal = (props: ProcedureAndDoctorSelectorModalProps) => {
  const { data: proceduresRes, isLoadingProcedures } = useGetAllSurgeryProcedures();
  // const { doctorsData, isLoadingMedics } = useGetMedics();
  const { anesthesiologistsData, isLoadingAnesthesiologists } = useGetAnesthesiologists();
  const [valueRadioButton, setValueRadioButton] = useState('no');
  const setStep = useProgrammingRegisterStore((state) => state.setStep);
  const step = useProgrammingRegisterStore((state) => state.step);
  const evidencePdf = useProgrammingRegisterStore((state) => state.evidencePdf);
  const setEvidencePdf = useProgrammingRegisterStore((state) => state.setEvidencePdf);
  const rejectedMedicId = useProgrammingRegisterStore((state) => state.rejectedMedicId);
  const setRejectMedicId = useProgrammingRegisterStore((state) => state.setRejectedMedicId);
  const setProcedures = useProgrammingRegisterStore((state) => state.setProcedures);
  const setMedicId = useProgrammingRegisterStore((state) => state.setMedicId);
  const setAnesthesiologistId = useProgrammingRegisterStore((state) => state.setAnesthesiologistId);
  const procedures = useProgrammingRegisterStore((state) => state.procedures);
  const medicId = useProgrammingRegisterStore((state) => state.medicId);
  const anesthesiologistId = useProgrammingRegisterStore((state) => state.anesthesiologistId);

  const handleChange = (event: any) => {
    setValue('medicId', '');
    setValueRadioButton(event.target.value);
  };

  const {
    setValue,
    watch,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<Inputs>({
    resolver: zodResolver(procedureAndDoctorSelectorSchema),
    defaultValues: {
      proceduresId: procedures,
      medicId: medicId,
      anesthesiologistId: anesthesiologistId,
    },
  });
  const watchProceduresId = watch('proceduresId');
  const watchAnesthesiologistId = watch('anesthesiologistId');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (
      (rejectedMedicId.trim() !== '' && evidencePdf.trim() === '') ||
      (evidencePdf.trim() !== '' && rejectedMedicId.trim() === '')
    ) {
      toast.error('Error, debes seleccionar un medico y un archivo para continuar.');
    }
    console.log(data);
    setProcedures(data.proceduresId);
    setMedicId(data.medicId);
    setAnesthesiologistId(data.anesthesiologistId);
    setStep(step + 1);
  };

  useEffect(() => {
    setEvidencePdf('');
    setRejectMedicId('');
  }, [valueRadioButton]);

  if (isLoadingProcedures)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <>
      <HeaderModal setOpen={props.setOpen} title="Selección de procedimiento y medico" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ backgroundColor: 'background.paper', p: 3 }}>
          <Box>
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
          <Divider sx={{ my: 1 }} />
          <MedicSelectComponent
            error={errors}
            name="medicId"
            handleChange={handleChange}
            valueRadioButton={valueRadioButton}
            setValue={setValue}
            watch={watch}
          />
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography>Seleccione el anestesiólogo:</Typography>
            <Autocomplete
              disablePortal
              fullWidth
              loading={isLoadingAnesthesiologists}
              getOptionLabel={(option) => option.nombre}
              options={anesthesiologistsData}
              value={anesthesiologistsData.find((a) => a.id === watchAnesthesiologistId) ?? null}
              noOptionsText="No se encontraron anestesiólogos"
              onChange={(_, val) => {
                setValue('anesthesiologistId', val?.id ?? '');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!errors.anesthesiologistId?.message}
                  helperText={errors.anesthesiologistId?.message}
                  placeholder="Anestesiólogo"
                />
              )}
            />
          </Box>
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
            Aceptar
          </Button>
        </Box>
      </form>
    </>
  );
};

interface MedicSelectComponentProps<T extends Inputs> extends UseControllerProps<T> {
  handleChange: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
  valueRadioButton: string;
  setValue: UseFormSetValue<Inputs>;
  watch: UseFormWatch<Inputs>;
  error: FieldErrorsImpl<T>;
}

const MedicSelectComponent = <T extends Inputs>({
  error,
  handleChange,
  valueRadioButton,
  setValue,
  watch,
}: MedicSelectComponentProps<T>) => {
  const { doctorsData, isLoadingMedics } = useGetMedics();

  return (
    <Box sx={{ display: 'flex', columnGap: 4 }}>
      <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        <FormControl>
          <FormLabel>¿El paciente entro por su cuenta?</FormLabel>
          <RadioGroup value={valueRadioButton} onChange={handleChange} row>
            <FormControlLabel value="si" control={<Radio />} label="Si" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
        <Box>
          <Typography>{`Seleccione el medico ${valueRadioButton === 'no' ? 'que recomendó al paciente' : 'en guardia'}:`}</Typography>
          <Autocomplete
            disablePortal
            fullWidth
            loading={isLoadingMedics}
            getOptionLabel={(option) => option.nombre}
            options={doctorsData}
            noOptionsText="No se encontraron medicos"
            onChange={(_, val) => {
              setValue('medicId', val?.id ?? '');
            }}
            value={doctorsData.find((d) => d.id === watch('medicId')) ?? null}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!error?.medicId?.message}
                helperText={error?.medicId?.message as string}
                placeholder="Medico"
              />
            )}
            key={valueRadioButton}
          />
        </Box>
      </Box>
      {valueRadioButton === 'si' && <MedicRejectAppointment isLoading={isLoadingMedics} medicData={doctorsData} />}
    </Box>
  );
};
interface MedicRejectAppointmentProps {
  isLoading: boolean;
  medicData: { id: string; nombre: string }[];
}
const MedicRejectAppointment = (props: MedicRejectAppointmentProps) => {
  const { isLoading, medicData } = props;
  const [openCollapse, setOpenCollapse] = useState(false);
  const evidencePdf = useProgrammingRegisterStore((state) => state.evidencePdf);
  const setEvidencePdf = useProgrammingRegisterStore((state) => state.setEvidencePdf);
  const setRejectedMedicId = useProgrammingRegisterStore((state) => state.setRejectedMedicId);

  return (
    <Box sx={{ flex: 1 }}>
      <Card sx={{ display: 'flex', flexDirection: 'column', p: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>Evidencia de motivo rechazo de cita</Typography>
          <IconButton onClick={() => setOpenCollapse(!openCollapse)}>
            {openCollapse ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Collapse in={openCollapse}>
          <Typography>Seleccionar medico que rechazo:</Typography>
          <Autocomplete
            disablePortal
            fullWidth
            loading={isLoading}
            getOptionLabel={(option) => option.nombre}
            options={medicData}
            noOptionsText="No se encontraron medicos"
            onChange={(_, val) => val && setRejectedMedicId(val.id)}
            onInputChange={(_, __, reason) => {
              if (reason === 'clear') {
                setRejectedMedicId('');
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                // {...register('medicId')}
                // error={!!error?.medicId?.message}
                // helperText={error?.medicId?.message as string}
                placeholder="Medico"
              />
            )}
            // key={valueRadioButton}
          />
          <UploadFile pdf={evidencePdf} setPdf={setEvidencePdf} title="Evidencia" />
        </Collapse>
      </Card>
    </Box>
  );
};
