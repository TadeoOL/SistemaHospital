import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import AnimateButton from '../../@extended/AnimateButton';
import { primary } from '../../../theme/colors';
import { useState } from 'react';

const categoriesArray = [
  { id: 1, name: 'Analgesico' },
  { id: 2, name: 'Farmacia' },
  { id: 3, name: 'Penesito' },
  { id: 4, name: 'Obo' },
];
interface CategoriesProps {
  sx?: any;
}
export const Categories = (props: CategoriesProps) => {
  const [value, setValue] = useState(0);
  return (
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
                  ':hover': { cursor: 'pointer' },
                  bgcolor: value === 0 ? primary.light : null,
                }}
                onClick={() => setValue(0)}
              >
                <Typography variant="body1">Todos los artículos</Typography>
              </Card>
            </AnimateButton>
          </Grid>
          {categoriesArray.map((category, i) => (
            <Grid key={category.id} item xs={4} md={3} lg={2}>
              <AnimateButton>
                <Card
                  sx={{
                    p: 1,
                    borderRadius: 4,
                    ':hover': { cursor: 'pointer' },
                    bgcolor: value === i + 1 ? primary.light : null,
                  }}
                  onClick={() => setValue(i + 1)}
                >
                  <Typography variant="body1">{category.name}</Typography>
                </Card>
              </AnimateButton>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
};
