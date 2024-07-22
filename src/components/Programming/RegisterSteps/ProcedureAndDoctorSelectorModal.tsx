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
import { ChangeEvent, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { procedureAndDoctorSelectorSchema } from '../../../schema/programming/programmingSchemas';
import { UploadFile } from '../../Commons/UploadFile';
import { toast } from 'react-toastify';
import { useGetAllXRay } from '../../../hooks/hospitalization/useGetAllXRay';
import { useGetMedicalShiftsByDate } from '../../../hooks/hospitalization/useGetMedicalShiftsByDate';
import { useGetAnesthesiologistShiftsByDate } from '../../../hooks/hospitalization/useGetAnesthesiologistShiftsByDate';

interface Inputs {
  proceduresId: string[];
  xrayIds: string[];
  medicId: string;
  anesthesiologistId: string;
}

interface ProcedureAndDoctorSelectorModalProps {
  setOpen: Function;
}
export const ProcedureAndDoctorSelectorModal = (props: ProcedureAndDoctorSelectorModalProps) => {
  const { data: proceduresRes, isLoadingProcedures } = useGetAllSurgeryProcedures();
  const { doctorsData } = useGetMedics();

  const { xrayData, isLoadingXRay } = useGetAllXRay();
  const [valueRadioButton, setValueRadioButton] = useState('no');
  const setStep = useProgrammingRegisterStore((state) => state.setStep);
  const step = useProgrammingRegisterStore((state) => state.step);
  const evidencePdf = useProgrammingRegisterStore((state) => state.evidencePdf);
  const setEvidencePdf = useProgrammingRegisterStore((state) => state.setEvidencePdf);
  const rejectedMedicId = useProgrammingRegisterStore((state) => state.rejectedMedicId);
  const setRejectMedicId = useProgrammingRegisterStore((state) => state.setRejectedMedicId);
  const setProcedures = useProgrammingRegisterStore((state) => state.setProcedures);
  const setMedicId = useProgrammingRegisterStore((state) => state.setMedicId);
  const setXRayIds = useProgrammingRegisterStore((state) => state.setXRayIds);
  const setAnesthesiologistId = useProgrammingRegisterStore((state) => state.setAnesthesiologistId);
  const procedures = useProgrammingRegisterStore((state) => state.procedures);
  const medicId = useProgrammingRegisterStore((state) => state.medicId);
  const anesthesiologistId = useProgrammingRegisterStore((state) => state.anesthesiologistId);
  const xrayIds = useProgrammingRegisterStore((state) => state.xrayIds);
  const startDateSurgery = useProgrammingRegisterStore((state) => state.startDateSurgery);
  const { isLoadingAnesthesiologistShifts, anesthesiologistShiftsData } =
    useGetAnesthesiologistShiftsByDate(startDateSurgery);

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
      xrayIds: xrayIds,
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

    let xrayMap: { [key: string]: { id: string; name: string } } = {};
    for (let i = 0; i < xrayData.length; i++) {
      xrayMap[xrayData[i].id] = { id: xrayData[i].id, name: xrayData[i].nombre };
    }

    let xrayList = [];
    for (let i = 0; i < data.xrayIds.length; i++) {
      xrayList.push(xrayMap[data.xrayIds[i]]);
    }
    const anesthesiologist = anesthesiologistShiftsData.find((a) => a.id === data.anesthesiologistId);

    localStorage.setItem('proceduresList', JSON.stringify(proceduresList));
    localStorage.setItem('xrayList', JSON.stringify(xrayList));
    localStorage.setItem('medicData', JSON.stringify({ id: medicData?.id, name: medicData?.nombre }));
    localStorage.setItem(
      'anesthesiologist',
      JSON.stringify({ id: anesthesiologist?.id, name: anesthesiologist?.nombre })
    );

    setProcedures(data.proceduresId);
    setMedicId(data.medicId);
    setXRayIds(data.xrayIds);
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
            <Box sx={{ flex: 1 }}>
              <Typography>Seleccione los estudios de gabinete:</Typography>
              <Autocomplete
                disablePortal
                fullWidth
                loading={isLoadingXRay}
                getOptionLabel={(option) => option.nombre}
                options={xrayData}
                multiple
                noOptionsText="No se encontraron estudios de gabinete"
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, val) => {
                  setValue('xrayIds', val.flatMap((x) => x.id) ?? '');
                }}
                value={
                  watch('xrayIds').map((x) => {
                    const xray = xrayData.find((xr) => xr.id === x);
                    return {
                      id: xray?.id as string,
                      nombre: xray?.nombre as string,
                    };
                  }) ?? []
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!errors?.xrayIds?.message}
                    helperText={errors?.xrayIds?.message as string}
                    placeholder="Radiografías"
                  />
                )}
                key={valueRadioButton}
              />
            </Box>
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
            <Typography>Seleccione el anestesiólogo en guardia:</Typography>
            <Autocomplete
              disablePortal
              fullWidth
              loading={isLoadingAnesthesiologistShifts}
              getOptionLabel={(option) => option.nombre}
              options={anesthesiologistShiftsData}
              value={anesthesiologistShiftsData.find((a) => a.id === watchAnesthesiologistId) ?? null}
              noOptionsText="No se encontraron anestesiólogos en guardia"
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
            Siguiente
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
  const startDateSurgery = useProgrammingRegisterStore((state) => state.startDateSurgery);
  const { isLoadingMedicalShifts, medicalShiftsData } = useGetMedicalShiftsByDate(startDateSurgery);
  const valueToFind = valueRadioButton === 'no' ? doctorsData : medicalShiftsData;

  return (
    <Box sx={{ display: 'flex', columnGap: 4 }}>
      <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        <FormControl>
          <FormLabel>Tipo de Ingreso</FormLabel>
          <RadioGroup value={valueRadioButton} onChange={handleChange} row>
            <FormControlLabel value="si" control={<Radio />} label="Ingreso por SAMI" />
            <FormControlLabel value="no" control={<Radio />} label="Ingreso por Médico" />
          </RadioGroup>
        </FormControl>
        <Box>
          <Typography>{`Seleccione el medico ${valueRadioButton === 'no' ? 'que recomendó al paciente' : 'en guardia'}:`}</Typography>
          <Autocomplete
            disablePortal
            fullWidth
            loading={valueRadioButton === 'no' ? isLoadingMedics : isLoadingMedicalShifts}
            getOptionLabel={(option) => option.nombre}
            options={valueRadioButton === 'no' ? doctorsData : medicalShiftsData}
            noOptionsText={`No se encontraron medicos ${valueRadioButton === 'si' ? 'en guardia' : ''}`}
            onChange={(_, val) => {
              if (valueRadioButton === 'no') {
                setValue('medicId', val?.id ?? '');
              } else {
                const value = val as { id: string; id_Medico: string; nombre: string };
                setValue('medicId', (value?.id_Medico as any) ?? '');
              }
            }}
            value={
              valueToFind.find((d) => {
                if (valueRadioButton === 'no') {
                  return d.id === watch('medicId');
                } else {
                  const val = d as any;
                  return val.id_Medico === watch('medicId');
                }
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
