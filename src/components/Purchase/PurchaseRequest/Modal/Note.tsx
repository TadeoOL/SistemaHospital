import { useDirectlyPurchaseRequestOrderStore } from '../../../../store/purchaseStore/directlyPurchaseRequestOrder';
import { Box, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

export const Note = () => {
  const note = useDirectlyPurchaseRequestOrderStore(useShallow((state) => state.note));
  const [localNote, setLocalNote] = useState(note ? note : '');
  const setNote = useDirectlyPurchaseRequestOrderStore(useShallow((state) => state.setNote));

  useEffect(() => {
    const timer = setTimeout(() => {
      setNote(localNote);
    }, 250);

    return () => clearTimeout(timer);
  }, [localNote]);

  const handleChange = (e: any) => {
    setLocalNote(e.target.value);
  };

  return (
    <Box>
      <TextField
        fullWidth
        multiline
        value={localNote}
        onChange={handleChange}
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
