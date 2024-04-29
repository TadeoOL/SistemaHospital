import { Box, Button, Card, Grid, Modal, Stack, Typography, alpha } from '@mui/material';
import AnimateButton from '../../@extended/AnimateButton';
import { neutral, primary } from '../../../theme/colors';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePosArticlesPaginationStore } from '../../../store/pharmacy/pointOfSale/posArticlesPagination';
import { CloseSaleRegisterModal } from './Modal/CloseSaleRegisterModal';
import { getCategoriesForPOS } from '../../../services/pharmacy/pointOfSaleService';
import { usePosTabNavStore } from '../../../store/pharmacy/pointOfSale/posTabNav';

interface CategoriesProps {
  sx?: any;
}
export const Categories = (props: CategoriesProps) => {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const warehouseId = usePosTabNavStore((state) => state.warehouseId);
  const { data } = useQuery({
    queryKey: ['categoriesForPOS'],
    queryFn: async () => getCategoriesForPOS(warehouseId),
  });
  const setSubCategoryId = usePosArticlesPaginationStore((state) => state.setSubCategoryId);

  return (
    <>
      <Box sx={{ ...props.sx }}>
        <Stack sx={{ display: 'flex', flex: 1 }}>
          <Typography variant="h5">Categorías</Typography>
          <Grid container spacing={3}>
            <Grid item xs={4} md={3} lg={2}>
              <AnimateButton>
                <Card
                  sx={{
                    p: 1,
                    borderRadius: 4,
                    '&:hover': {
                      cursor: 'pointer',
                      backgroundColor: value === 0 ? alpha(primary.main, 0.9) : neutral[50],
                      transform: 'scale(1.03)',
                      transition: '0.3 ease-in-out',
                    },
                    bgcolor: value === 0 ? alpha(primary.main, 0.7) : null,
                  }}
                  onClick={() => {
                    setValue(0);
                    setSubCategoryId('');
                  }}
                >
                  <Typography variant="body1">Todos los artículos</Typography>
                </Card>
              </AnimateButton>
            </Grid>
            {data?.map((category, i) => (
              <Grid key={category.id + 1} item xs={4} md={3} lg={2}>
                <AnimateButton>
                  <Card
                    sx={{
                      p: 1,
                      borderRadius: 4,
                      bgcolor: value === i + 1 ? alpha(primary.main, 0.7) : null,
                      '&:hover': {
                        cursor: 'pointer',
                        backgroundColor: value === i + 1 ? alpha(primary.main, 0.9) : neutral[50],
                        transform: 'scale(1.03)',
                        transition: '0.3 ease-in-out',
                      },
                    }}
                    onClick={() => {
                      setValue(i + 1);
                      setSubCategoryId(category.id);
                    }}
                  >
                    <Typography variant="body1">{category.nombre}</Typography>
                  </Card>
                </AnimateButton>
              </Grid>
            ))}
          </Grid>
        </Stack>
        <Box>
          <Button onClick={() => setOpen(true)} variant="contained" color="error">
            Cerrar caja
          </Button>
        </Box>
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <CloseSaleRegisterModal setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
