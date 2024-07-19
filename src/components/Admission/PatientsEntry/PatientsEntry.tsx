import { Box, Card, Stack } from '@mui/material';
import { useState } from 'react';
import { TablePatientsEntry } from './PatientsEntryTable';
// import { RegisterSteps } from '../RegisterSteps/RegisterSteps';

export const PatientsEntry = () => {
  //const [open, setOpen] = useState(false);
  return (
    <>
      <Card sx={{ px: 2, pt: 4, pb: 2 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between' }}></Box>
          <TablePatientsEntry />
        </Stack>
      </Card>
    </>
  );
};
