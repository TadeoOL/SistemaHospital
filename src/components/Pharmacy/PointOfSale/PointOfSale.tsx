import { Box, Card, Stack } from '@mui/material';
import { Categories } from './Categories';
import { ResumeSale } from './ResumeSale';
import { ArticlesToSale } from './ArticlesToSale';
import { SearchBar } from '../../Inputs/SearchBar';
import { neutral } from '../../../theme/colors';

export const PointOfSale = () => {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Card sx={{ display: 'flex', flex: 1, bgcolor: neutral[100], minWidth: 700 }}>
        <Stack sx={{ display: 'flex', flex: 5 }}>
          <Categories sx={{ display: 'flex', columnGap: 1.5, p: 2 }} />
          <SearchBar title="Buscar el articulo..." searchState={() => {}} />
          <ArticlesToSale sx={{ p: 2 }} />
        </Stack>
        <ResumeSale sx={{ display: 'flex', flex: 1, px: 2, pb: 2, bgcolor: 'background.paper', minWidth: 250 }} />
      </Card>
    </Box>
  );
};
