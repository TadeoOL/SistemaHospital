import { Info } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

interface NoDataInTableInfoProps {
  infoTitle: string;
}
export const NoDataInTableInfo = (props: NoDataInTableInfoProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', columnGap: 1, p: 4, color: 'gray' }}>
      <Info sx={{ width: 50, height: 50 }} />
      <Typography variant="h2">{props.infoTitle}</Typography>
    </Box>
  );
};
