import { Box } from '@mui/material';
import { WaitingPackages } from '@/components/Pharmacy/Catalogue/WaitingPackages';

export const PackageBuilding = () => {
      
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: 4,
        boxShadow: 4,
        display: 'flex',
        flexDirection: 'column',
        rowGap: 2,
      }}
    >
      <WaitingPackages pharmacyFlag={false} />
    </Box>
  );
};
