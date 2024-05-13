import { Box, Button, Card, Modal, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { CheckoutTableComponent } from './CheckoutTableComponent';
import { GenerateReceiptModal } from './Modal/GenerateReceiptModal';

export const ReceiptEmitter = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack spacing={4}>
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Departamento de ?</Typography>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Generar recibo
            </Button>
          </Box>
          <CheckoutTableComponent data={[]} />
        </Stack>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <GenerateReceiptModal setOpen={setOpen} from="toluca" />
        </>
      </Modal>
    </>
  );
};
