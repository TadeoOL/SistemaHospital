import { useShallow } from 'zustand/react/shallow';
import { useDirectlyPurchaseRequestOrderStore } from '../../../../store/purchaseStore/directlyPurchaseRequestOrder';
import { Box, TextField } from '@mui/material';

export const Note = () => {
  const { setNote, note } = useDirectlyPurchaseRequestOrderStore(
    useShallow((state) => ({ setNote: state.setNote, note: state.note }))
  );
  return (
    <Box>
      <TextField
        value={note}
        fullWidth
        onChange={(e) => setNote(e.target.value)}
        multiline
        rows={5}
        label="Escribe una nota..."
        sx={{
          '& legend': { display: 'none' },
          '& .MuiInputLabel-shrink': {
            opacity: 0,
            transition: 'all 0.2s ease-in',
            padding: 1,
          },
        }}
        InputProps={{
          sx: {
            padding: 1,
          },
        }}
        InputLabelProps={{
          sx: {
            margin: -0.5,
          },
        }}
      />
    </Box>
  );
};
