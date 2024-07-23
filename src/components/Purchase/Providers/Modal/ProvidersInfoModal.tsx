import { Backdrop, Box, Card, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { useGetProvider } from '../../../../hooks/useGetProvider';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, md: 800, lg: 1000 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 600,
};

const styleBar = {
  '&::-webkit-scrollbar': {
    width: '0.4em',
    zIndex: 1,
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    zIndex: 1,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey',
    zIndex: 1,
  },
};

const processType = (number: number) => {
  if (number === 1) {
    return 'Física';
  } else {
    return 'Moral';
  }
};

interface IProviderInfoModal {
  providerId: string;
  setOpen: Function;
}
export const ProvidersInfoModal = (props: IProviderInfoModal) => {
  const { isLoading, providerData } = useGetProvider(props.providerId);

  const {
    nombreCompania,
    nombreContacto,
    puesto,
    direccion,
    correoElectronico,
    telefono,
    rfc,
    tipoContribuyente,
    direccionFiscal,
    giroEmpresa,
    nif,
  } = providerData ?? {};

  if (isLoading)
    return (
      <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress />
      </Backdrop>
    );

  return (
    <Box sx={style}>
      <HeaderModal title="Información del proveedor" setOpen={props.setOpen} />
      <Stack
        spacing={2}
        sx={{
          display: 'flex',
          flex: 1,
          p: 2,
          bgcolor: 'background.paper',
          overflowY: 'auto',
          ...styleBar,
        }}
      >
        <Stack>
          <Card sx={{ p: 2 }}>
            <Grid container spacing={3} sx={{ justifyContent: 'start', display: 'flex', flex: 1 }}>
              <Grid item xs={12}>
                <Typography fontWeight={700} fontSize={24}>
                  Información general:
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Stack>
                  <Typography fontWeight={500} fontSize={16}>
                    Nombre de la compañía:
                  </Typography>
                  <Typography>{nombreCompania}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Stack>
                  <Typography fontWeight={500} fontSize={16}>
                    Nombre del contacto:
                  </Typography>
                  <Typography>{nombreContacto}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Stack>
                  <Typography fontWeight={500} fontSize={16}>
                    Puesto:
                  </Typography>
                  <Typography>{puesto}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Stack>
                  <Typography fontWeight={500} fontSize={16}>
                    Dirección:
                  </Typography>
                  <Typography>{direccion}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Stack>
                  <Typography fontWeight={500} fontSize={16}>
                    Teléfono:
                  </Typography>
                  <Typography>{telefono}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Stack>
                  <Typography fontWeight={500} fontSize={16}>
                    Correo electrónico:
                  </Typography>
                  <Typography>{correoElectronico}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Card>
          <Card sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography fontWeight={700} fontSize={24}>
                  Información fiscal:
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Stack>
                  <Typography fontWeight={500} fontSize={16}>
                    RFC:
                  </Typography>
                  <Typography>{rfc}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Stack>
                  <Typography fontWeight={500} fontSize={16}>
                    Domicilio fiscal:
                  </Typography>
                  <Typography>{direccionFiscal}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Stack>
                  <Typography fontWeight={500} fontSize={16}>
                    Numero de identificación fiscal:
                  </Typography>
                  <Typography>{nif}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Stack>
                  <Typography fontWeight={500} fontSize={16}>
                    Giro de la empresa:
                  </Typography>
                  <Typography>{giroEmpresa}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Stack>
                  <Typography fontWeight={500} fontSize={16}>
                    Tipo de contribuyente:
                  </Typography>
                  <Typography>{processType(tipoContribuyente ?? 0)}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Card>

          <Card>
            <Stack>
              <Typography fontWeight={700} fontSize={24}>
                Certificaciones
              </Typography>
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
};
