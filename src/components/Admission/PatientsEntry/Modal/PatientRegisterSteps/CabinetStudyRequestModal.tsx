import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { TableHeaderComponent } from '../../../../Commons/TableHeaderComponent';
import { usePatientEntryRegisterStepsStore } from '../../../../../store/admission/usePatientEntryRegisterSteps';
import { useGetAllXRay } from '../../../../../hooks/hospitalization/useGetAllXRay';
import { NoDataInTableInfo } from '../../../../Commons/NoDataInTableInfo';
import { Add } from '@mui/icons-material';

const HEADERS = ['Nombre', 'Acciones'];

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

export const CabinetStudyRequestModal = ({ setOpen }: CabinetStudyRequestModalProps) => {
  const step = usePatientEntryRegisterStepsStore((state) => state.step);
  const setStep = usePatientEntryRegisterStepsStore((state) => state.setStep);
  const { isLoadingXRay, xrayData } = useGetAllXRay();

  const handleReturn = () => {
    setStep(step - 1);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  if (isLoadingXRay)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <Box sx={style}>
      <HeaderModal setOpen={setOpen} title="Estudios de gabinete" />
      <Box sx={{ p: 2, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', rowGap: 2 }}>
        <Stack>
          <Typography>Selecciona el estudio de gabinete:</Typography>
          <TextField select label="Estudio de gabinete" sx={{ width: { xs: '100%', md: '50%' } }}>
            {xrayData.length > 0 ? (
              xrayData.map((cs) => (
                <MenuItem value={cs.id} key={cs.id}>
                  {cs.nombre}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No se encontraron estudios de gabinete</MenuItem>
            )}
          </TextField>
        </Stack>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button startIcon={<Add />} variant="contained">
              Agregar
            </Button>
          </Box>
          <CabinetStudyRequestModalTable />
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
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={HEADERS} />
          <TableBody></TableBody>
        </Table>
      </TableContainer>
      <NoDataInTableInfo infoTitle="No se han agregado estudios de gabinete" sizeIcon={25} variantText="h5" />
    </Card>
  );
};
