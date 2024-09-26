import { Backdrop, Box, Card, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { useGetSubCategory } from '../../../../../hooks/useGetSubCategory';

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

interface ISubCategoryInfoModal {
  id: string;
  setOpen: Function;
}
export const SubCategoryInfoModal = (props: ISubCategoryInfoModal) => {
  const { isLoading, data } = useGetSubCategory(props.id);

  const { nombre, descripcion, iva } = data ?? {};

  if (isLoading)
    return (
      <Backdrop open sx={{ color: '#fff', zIndex: (theme: any) => theme.zIndex.drawer + 1 }}>
        <CircularProgress />
      </Backdrop>
    );

  return (
    <Box sx={style}>
      <HeaderModal title="Información de la Sub Categoría" setOpen={props.setOpen} />
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
              <Grid item xs={12} md={6} lg={6}>
                <Stack>
                  <Typography fontWeight={700} fontSize={16}>
                    Nombre de la Sub Categoría:
                  </Typography>
                  <Typography>{nombre}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Stack>
                  <Typography fontWeight={700} fontSize={16}>
                    Descripción:
                  </Typography>
                  <Typography>{descripcion}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Stack>
                  <Typography fontWeight={700} fontSize={16}>
                    IVA:
                  </Typography>
                  <Typography>{iva} %</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                {/* <Stack>
                  <Typography fontWeight={700} fontSize={16}>
                    Categoría Relacionada:
                  </Typography>
                  <Typography>{categoria?.nombre}</Typography>
                </Stack> */}
              </Grid>
            </Grid>
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
};
