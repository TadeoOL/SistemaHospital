import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { IBiomedicalEquipment } from '../../../types/hospitalizationTypes';
import { Delete } from '@mui/icons-material';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { useGetAllBiomedicalEquipment } from '../../../hooks/programming/useGetAllBiomedicalEquipment';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useProgrammingRegisterStore } from '../../../store/programming/programmingRegister';
const TABLE_HEADERS = ['Nombre', 'Precio', 'Acciones'];
interface BiomedicalEquipmentSelectorModalProps {
  setOpen: Function;
}
export const BiomedicalEquipmentSelectorModal = (props: BiomedicalEquipmentSelectorModalProps) => {
  const { biomedicalEquipmentData, isLoadingBiomedicalEquipment } = useGetAllBiomedicalEquipment();
  const [biomedicalEquipmentSelected, setBiomedicalEquipmentSelected] = useState<IBiomedicalEquipment | null>(null);
  const setBiomedicalEquipmentsSelected = useProgrammingRegisterStore((state) => state.setBiomedicalEquipmentsSelected);
  const biomedicalEquipmentsSelected = useProgrammingRegisterStore((state) => state.biomedicalEquipmentsSelected);
  const setStep = useProgrammingRegisterStore((state) => state.setStep);
  const step = useProgrammingRegisterStore((state) => state.step);
  const biomedicalEquipmentDataFiltered = biomedicalEquipmentData.filter(
    (bed) => !biomedicalEquipmentsSelected.some((b) => b.id === bed.id)
  );
  const [hospitalEquipment, setHospitalEquipment] = useState('yes');

  const handleAddBiomedicalEquipment = () => {
    if (!biomedicalEquipmentSelected) return toast.warning('Por favor selecciona un equipo biomedico');
    setBiomedicalEquipmentsSelected([...biomedicalEquipmentsSelected, biomedicalEquipmentSelected]);
    setBiomedicalEquipmentSelected(null);
  };

  useEffect(() => {
    setBiomedicalEquipmentsSelected([]);
  }, [hospitalEquipment]);

  return (
    <>
      <HeaderModal setOpen={props.setOpen} title="Selección de equipo biomedico" />
      <Box sx={{ backgroundColor: 'background.paper', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <FormControl>
            <FormLabel>¿Se utilizara el equipo biomedico del hospital?</FormLabel>
            <RadioGroup
              value={hospitalEquipment}
              onChange={(e) => {
                setHospitalEquipment(e.currentTarget.value);
              }}
              row
              sx={{ justifyContent: 'center', display: 'flex' }}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Si" />
              <FormControlLabel value="not" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Box>
        {hospitalEquipment === 'yes' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography>Seleccion de equipo biomedico:</Typography>
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Equipo Biomedico del Medico</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack>
                <Typography>Nombre del equipo:</Typography>
                <TextField label="Equipo biomedico" />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack>
                <Typography>Precio:</Typography>
                <TextField label="Precio" />
              </Stack>
            </Grid>
            <Grid item xs={12} sx={{ justifyContent: 'flex-end', display: 'flex' }}>
              <Button variant="contained">Agregar</Button>
            </Grid>
          </Grid>
        )}
        <Divider sx={{ my: 1 }} />
        <BiomedicalEquipmentSelectedTable data={biomedicalEquipmentsSelected} />
      </Box>
      <Box sx={{ backgroundColor: 'background.paper', p: 1, justifyContent: 'space-between', display: 'flex' }}>
        <Button variant="outlined" onClick={() => setStep(step - 1)}>
          Regresar
        </Button>
        <Button variant="contained">Aceptar</Button>
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

  const handleRemoveBiomedicalEquipment = () => {
    setBiomedicalEquipmentsSelected(biomedicalEquipmentsSelected.filter((bed) => bed.id !== data.id));
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
