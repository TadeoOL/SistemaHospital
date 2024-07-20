import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
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
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { IBiomedicalEquipment } from '../../../types/hospitalizationTypes';
import { Delete } from '@mui/icons-material';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { useGetAllBiomedicalEquipment } from '../../../hooks/hospitalization/useGetAllBiomedicalEquipment';
import { useState } from 'react';
import { useProgrammingRegisterStore } from '../../../store/programming/programmingRegister';
import { SubmitHandler, useForm } from 'react-hook-form';
import { isValidFloat } from '../../../utils/functions/dataUtils';
import { zodResolver } from '@hookform/resolvers/zod';
import { medicPersonalBiomedicalEquipmentSchema } from '../../../schema/programming/programmingSchemas';
import { v4 as uuidv4 } from 'uuid';
const TABLE_HEADERS = ['Nombre', 'Precio', 'Acciones'];
interface BiomedicalEquipmentSelectorModalProps {
  setOpen: Function;
}
interface Input {
  name: string;
  price: string;
  notes?: string;
}

export const BiomedicalEquipmentSelectorModal = (props: BiomedicalEquipmentSelectorModalProps) => {
  const { biomedicalEquipmentData, isLoadingBiomedicalEquipment } = useGetAllBiomedicalEquipment();
  const [biomedicalEquipmentSelected, setBiomedicalEquipmentSelected] = useState<IBiomedicalEquipment | null>(null);
  const setBiomedicalEquipmentsSelected = useProgrammingRegisterStore((state) => state.setBiomedicalEquipmentsSelected);
  const biomedicalEquipmentsSelected = useProgrammingRegisterStore((state) => state.biomedicalEquipmentsSelected);
  const medicPersonalBiomedicalEquipment = useProgrammingRegisterStore(
    (state) => state.medicPersonalBiomedicalEquipment
  );
  const setMedicPersonalBiomedicalEquipment = useProgrammingRegisterStore(
    (state) => state.setMedicPersonalBiomedicalEquipment
  );
  const setStep = useProgrammingRegisterStore((state) => state.setStep);
  const step = useProgrammingRegisterStore((state) => state.step);
  const biomedicalEquipmentDataFiltered = biomedicalEquipmentData.filter(
    (bed) => !biomedicalEquipmentsSelected.some((b) => b.id === bed.id)
  );
  const [hospitalEquipment, setHospitalEquipment] = useState('yes');
  const biomedicalEquipmentsList = [...medicPersonalBiomedicalEquipment, ...biomedicalEquipmentsSelected];

  const handleAddBiomedicalEquipment = () => {
    if (biomedicalEquipmentSelected) {
      setBiomedicalEquipmentsSelected([...biomedicalEquipmentsSelected, biomedicalEquipmentSelected]);
    }
    setBiomedicalEquipmentSelected(null);
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

  const handleNextStep = () => {
    setStep(step + 1);
  };

  return (
    <>
      <HeaderModal setOpen={props.setOpen} title="Selección de equipo biomedico" />
      <Box sx={{ backgroundColor: 'background.paper', p: 2 }}>
        <Box sx={{}}>
          <Tabs
            variant="fullWidth"
            value={hospitalEquipment}
            onChange={(_, e) => {
              setHospitalEquipment(e);
            }}
            sx={{ mb: 1 }}
          >
            <Tab label="Equipo Biomédico" value="yes" />
            <Tab label="Equipo Biomédico Honorario" value={'no'} />
          </Tabs>
        </Box>
        {hospitalEquipment === 'yes' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography>Selección de equipo biomédico:</Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: { xs: 'flex-end', sm: 'center' },
                columnGap: 4,
                flexDirection: { xs: 'column', sm: 'row' },
                rowGap: 2,
              }}
            >
              <Autocomplete
                disablePortal
                fullWidth
                // filterOptions={filterPackageOptions}
                loading={isLoadingBiomedicalEquipment}
                getOptionLabel={(option) => option.nombre}
                options={biomedicalEquipmentDataFiltered ?? []}
                sx={{ width: { xs: 350, sm: 400 } }}
                noOptionsText="No se encontraron equipos"
                renderInput={(params) => <TextField {...params} placeholder="Equipos biomedicos" />}
                onChange={(_, val) => {
                  setBiomedicalEquipmentSelected(val);
                }}
                // onInputChange={(_, __, reason) => {}}
                value={biomedicalEquipmentSelected}
              />
              <Button variant="contained" onClick={handleAddBiomedicalEquipment}>
                Agregar
              </Button>
            </Box>
          </Box>
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
        <Divider sx={{ my: 1 }} />
        <BiomedicalEquipmentSelectedTable data={biomedicalEquipmentsList} />
      </Box>
      <Box sx={{ backgroundColor: 'background.paper', p: 1, justifyContent: 'space-between', display: 'flex' }}>
        <Button variant="outlined" onClick={() => setStep(step - 1)}>
          Regresar
        </Button>
        <Button variant="contained" onClick={handleNextStep}>
          Siguiente
        </Button>
      </Box>
    </>
  );
};

const BiomedicalEquipmentSelectedTable = (props: { data: IBiomedicalEquipment[] }) => {
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={TABLE_HEADERS} />
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
  const setBiomedicalEquipmentsSelected = useProgrammingRegisterStore((state) => state.setBiomedicalEquipmentsSelected);
  const biomedicalEquipmentsSelected = useProgrammingRegisterStore((state) => state.biomedicalEquipmentsSelected);
  const medicPersonalBiomedicalEquipment = useProgrammingRegisterStore(
    (state) => state.medicPersonalBiomedicalEquipment
  );
  const setMedicPersonalBiomedicalEquipment = useProgrammingRegisterStore(
    (state) => state.setMedicPersonalBiomedicalEquipment
  );

  const handleRemoveBiomedicalEquipment = () => {
    if (data.esPersonal) {
      setMedicPersonalBiomedicalEquipment(medicPersonalBiomedicalEquipment.filter((bed) => bed.id !== data.id));
    } else {
      setBiomedicalEquipmentsSelected(biomedicalEquipmentsSelected.filter((bed) => bed.id !== data.id));
    }
  };

  return (
    <TableRow>
      <TableCell>{data.nombre}</TableCell>
      <TableCell>{data.precio}</TableCell>
      <TableCell>
        <Tooltip title="Eliminar">
          <IconButton onClick={handleRemoveBiomedicalEquipment}>
            <Delete color="error" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};
