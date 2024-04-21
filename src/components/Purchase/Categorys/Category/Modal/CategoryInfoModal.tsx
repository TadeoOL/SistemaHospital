import { Backdrop, Box, Card, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { useGetCategory } from '../../../../../hooks/useGetCategory';

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

interface ICategoryInfoModal {
  id: string;
  setOpen: Function;
}
export const CategoryInfoModal = (props: ICategoryInfoModal) => {
  const { isLoading, data } = useGetCategory(props.id);

  const { nombre, descripcion, almacen } = data ?? {};

  if (isLoading)
    return (
      <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress />
      </Backdrop>
    );

  return (
    <Box sx={style}>
      <HeaderModal title="Información de la Categoría" setOpen={props.setOpen} />
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
              <Grid item xs={12} md={6} lg={4}>
                <Stack>
                  <Typography fontWeight={700} fontSize={16}>
                    Nombre de la Categoría:
                  </Typography>
                  <Typography>{nombre}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Stack>
                  <Typography fontWeight={700} fontSize={16}>
                    Descripción:
                  </Typography>
                  <Typography>{descripcion}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Stack>
                  <Typography fontWeight={700} fontSize={16}>
                    Almacén:
                  </Typography>
                  <Typography>{almacen}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
};
