import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { TableHeaderComponent } from '../../../../Commons/TableHeaderComponent';
import { usePatientEntryRegisterStepsStore } from '../../../../../store/admission/usePatientEntryRegisterSteps';
import { NoDataInTableInfo } from '../../../../Commons/NoDataInTableInfo';
import { Add, Delete } from '@mui/icons-material';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { medicPersonalBiomedicalEquipmentSchema } from '../../../../../schema/programming/programmingSchemas';
import { SubmitHandler, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { isValidFloat } from '../../../../../utils/functions/dataUtils';
import { IBiomedicalEquipment } from '../../../../../types/hospitalizationTypes';
import { useGetHospitalServices } from '../../../../../hooks/hospitalServices/useGetHospitalServices';
import { ServiceType } from '../../../../../types/hospitalServices/hospitalServiceTypes';

const HEADERS = ['Nombre', 'Acciones'];
const BIOMEDICAL_EQUIPMENT_HEADERS = ['Nombre', 'Precio', 'Acciones'];

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

interface CabinetStudyRequestModalProps {
  setOpen: Function;
}

interface Input {
  name: string;
  price: string;
  notes?: string;
}

export const CabinetStudyRequestModal = ({ setOpen }: CabinetStudyRequestModalProps) => {
  const step = usePatientEntryRegisterStepsStore((state) => state.step);
  const setStep = usePatientEntryRegisterStepsStore((state) => state.setStep);
  const { isLoading, data } = useGetHospitalServices({ serviceType: ServiceType.Radiografia });
  const [cabinetStudySelected, setCabinetStudySelected] = useState<{ id: string; nombre: string } | ''>('');
  const [isCabinetStudySelected, setIsCabinetStudySelected] = useState('yes');
  const medicPersonalBiomedicalEquipment = usePatientEntryRegisterStepsStore(
    (state) => state.medicPersonalBiomedicalEquipment
  );
  const setMedicPersonalBiomedicalEquipment = usePatientEntryRegisterStepsStore(
    (state) => state.setMedicPersonalBiomedicalEquipment
  );
  const setCabinetStudiesSelected = usePatientEntryRegisterStepsStore((state) => state.setCabinetStudiesSelected);
  const cabinetStudiesSelected = usePatientEntryRegisterStepsStore((state) => state.cabinetStudiesSelected);

  const handleReturn = () => {
    setStep(step - 1);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleSelectCabinetStudy = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const id = event.target.value;
    const cabinetStudy = data.find((x) => x.id_Servicio === id);
    if (cabinetStudy) {
      setCabinetStudySelected({ id: cabinetStudy.id_Servicio, nombre: cabinetStudy.nombre });
    }
  };

  const handleAdd = () => {
    if (cabinetStudySelected) {
      setCabinetStudiesSelected([...cabinetStudiesSelected, cabinetStudySelected]);
      setCabinetStudySelected('');
    }
  };
  const {
    setValue,
    formState: { errors },
    watch,
    register,
    handleSubmit,
  } = useForm<Input>({
    resolver: zodResolver(medicPersonalBiomedicalEquipmentSchema),
    defaultValues: {
      name: '',
      price: '0',
    },
  });
  const onSubmitPersonalEquipment: SubmitHandler<Input> = (data) => {
    setMedicPersonalBiomedicalEquipment([
      ...medicPersonalBiomedicalEquipment,
      { id: uuidv4(), precio: parseFloat(data.price), nombre: data.name, esPersonal: true, notas: data.notes },
    ]);
    setValue('name', '');
    setValue('price', '0');
  };

  if (isLoading)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <Box sx={style}>
      <HeaderModal setOpen={setOpen} title="Estudios de gabinete" />
      <Box sx={{ p: 2, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', rowGap: 2 }}>
        <Box>
          <Tabs
            variant="fullWidth"
            value={isCabinetStudySelected}
            onChange={(_, e) => {
              setIsCabinetStudySelected(e);
            }}
            sx={{ mb: 1 }}
          >
            <Tab label="Estudio de gabinete" value="yes" />
            <Tab label="Equipo Biomédico Honorario" value={'no'} />
          </Tabs>
        </Box>
        <Box sx={{ overflowY: 'auto' }}>
          <Box sx={{ maxHeight: { xs: 400, xl: 650 } }}>
            {isCabinetStudySelected == 'yes' ? (
              <Stack>
                <Typography>Selecciona el estudio de gabinete:</Typography>
                <TextField
                  select
                  label="Estudio de gabinete"
                  sx={{ width: { xs: '100%', md: '50%' } }}
                  onChange={handleSelectCabinetStudy}
                  value={cabinetStudySelected ? cabinetStudySelected.id : ''}
                >
                  {data.length > 0 &&
                  data.filter((x) => !cabinetStudiesSelected.some((c) => c.id === x.id_Servicio)).length > 0 ? (
                    data
                      .filter((x) => !cabinetStudiesSelected.some((c) => c.id === x.id_Servicio))
                      .map((cs) => (
                        <MenuItem value={cs.id_Servicio} key={cs.id_Servicio}>
                          {cs.nombre}
                        </MenuItem>
                      ))
                  ) : (
                    <MenuItem disabled>No se encontraron estudios de gabinete</MenuItem>
                  )}
                </TextField>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: { xs: '100%', md: '50%' }, mt: 1 }}>
                  <Button startIcon={<Add />} variant="contained" onClick={handleAdd}>
                    Agregar
                  </Button>
                </Box>
              </Stack>
            ) : (
              <form onSubmit={handleSubmit(onSubmitPersonalEquipment)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Stack>
                      <Typography>Nombre del equipo:</Typography>
                      <TextField
                        label="Equipo biomedico"
                        value={watch('name')}
                        onChange={(e) => setValue('name', e.target.value)}
                        error={!!errors.name?.message}
                        helperText={errors.name?.message}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack>
                      <Typography>Precio:</Typography>
                      <TextField
                        label="Precio"
                        inputProps={{
                          min: 0,
                        }}
                        error={!!errors.price?.message}
                        helperText={errors.price?.message}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (!isValidFloat(value)) return;
                          if (value === '.') {
                            setValue('price', '');
                            return;
                          }
                          if (value.trim() === '') {
                            setValue('price', '');
                          } else {
                            setValue('price', value);
                          }
                        }}
                        value={watch('price')}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField multiline fullWidth label="Notas" {...register('notes')} />
                  </Grid>
                  <Grid item xs={12} sx={{ justifyContent: 'flex-end', display: 'flex' }}>
                    <Button variant="contained" type="submit">
                      Agregar
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="h5" align="center" sx={{ mb: 1 }}>
                Estudios de Gabinete
              </Typography>
              <CabinetStudyRequestModalTable />
            </Box>
            <Box>
              <Typography variant="h5" align="center" sx={{ my: 1 }}>
                Equipo Biomedico
              </Typography>
              <BiomedicalEquipmentSelectedTable data={medicPersonalBiomedicalEquipment} />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          p: 1,
          bgcolor: 'background.paper',
          display: 'flex',
          justifyContent: 'space-between',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <Button variant="outlined" onClick={handleReturn}>
          Regresar
        </Button>
        <Button variant="contained" onClick={handleNextStep}>
          Siguiente
        </Button>
      </Box>
    </Box>
  );
};

const CabinetStudyRequestModalTable = () => {
  const cabinetStudiesSelected = usePatientEntryRegisterStepsStore((state) => state.cabinetStudiesSelected);
  const setCabinetStudiesSelected = usePatientEntryRegisterStepsStore((state) => state.setCabinetStudiesSelected);
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={HEADERS} align="center" />
          <TableBody>
            {cabinetStudiesSelected.map((cs) => (
              <CabinetStudyRequestModalTableRow
                cabinetStudy={cs}
                key={cs.id}
                setCabinetStudiesSelected={setCabinetStudiesSelected}
                cabinetStudiesSelected={cabinetStudiesSelected}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {cabinetStudiesSelected.length < 1 && (
        <NoDataInTableInfo infoTitle="No se han agregado estudios de gabinete" sizeIcon={25} variantText="h5" />
      )}
    </Card>
  );
};

const CabinetStudyRequestModalTableRow = ({
  cabinetStudy,
  setCabinetStudiesSelected,
  cabinetStudiesSelected,
}: {
  cabinetStudy: { id: string; nombre: string };
  setCabinetStudiesSelected: Function;
  cabinetStudiesSelected: { id: string; nombre: string }[];
}) => {
  const handleRemove = () => {
    setCabinetStudiesSelected(cabinetStudiesSelected.filter((c) => c.id != cabinetStudy.id));
  };
  return (
    <TableRow>
      <TableCell align="center">{cabinetStudy.nombre}</TableCell>
      <TableCell align="center">
        <Tooltip title="Eliminar">
          <IconButton onClick={handleRemove}>
            <Delete color="error" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

const BiomedicalEquipmentSelectedTable = (props: { data: IBiomedicalEquipment[] }) => {
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={BIOMEDICAL_EQUIPMENT_HEADERS} align="center" />
          <BiomedicalEquipmentSelectedTableBody data={props.data} />
        </Table>
      </TableContainer>
      {props.data.length < 1 && (
        <NoDataInTableInfo infoTitle="No hay equipo biomedico seleccionado" sizeIcon={30} variantText="h4" />
      )}
    </Card>
  );
};

const BiomedicalEquipmentSelectedTableBody = (props: { data: IBiomedicalEquipment[] }) => {
  return (
    <TableBody>
      {props.data.map((data) => {
        return <BiomedicalEquipmentSelectedTableRow data={data} key={data.id} />;
      })}
    </TableBody>
  );
};

const BiomedicalEquipmentSelectedTableRow = (props: { data: IBiomedicalEquipment }) => {
  const { data } = props;
  const medicPersonalBiomedicalEquipment = usePatientEntryRegisterStepsStore(
    (state) => state.medicPersonalBiomedicalEquipment
  );
  const setMedicPersonalBiomedicalEquipment = usePatientEntryRegisterStepsStore(
    (state) => state.setMedicPersonalBiomedicalEquipment
  );

  const handleRemoveBiomedicalEquipment = () => {
    setMedicPersonalBiomedicalEquipment(medicPersonalBiomedicalEquipment.filter((bed) => bed.id !== data.id));
  };

  return (
    <TableRow>
      <TableCell align="center">{data.nombre}</TableCell>
      <TableCell align="center">{data.precio}</TableCell>
      <TableCell align="center">
        <Tooltip title="Eliminar">
          <IconButton onClick={handleRemoveBiomedicalEquipment}>
            <Delete color="error" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};
