import { Box } from '@mui/material';
import { AlertArticlesTable } from './SubComponents/AlertArticlesTable';

export const PurchaseRequestCard = () => {
  return (
    <Box sx={{ minWidth: { xs: 950, xl: 0 } }}>
      <AlertArticlesTable />
    </Box>
  );
};
