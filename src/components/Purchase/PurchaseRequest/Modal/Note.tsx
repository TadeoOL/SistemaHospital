import { Box, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
interface NoteProps {
  note: string;
  setNote: Function;
  sx?: any;
}
export const Note = (props: NoteProps) => {
  const { note, setNote } = props;
  const [localNote, setLocalNote] = useState(note ? note : '');

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
          '& .MuiInputBase-root': {
            height: 150,
          },
        }}
        InputProps={{
          sx: {
            paddingTop: -1,
          },
        }}
        InputLabelProps={{
          sx: {
            margin: -0.1,
          },
        }}
      />
    </Box>
  );
};
