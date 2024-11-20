import { Autocomplete, Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { User } from '../../../hooks/useGetUsersBySearch';

export const DiscountInputs = ({
  setUsersDiscount,
  usersDiscount,
  usersRes,
  isLoadingUsers,
}: {
  setUsersDiscount: React.Dispatch<React.SetStateAction<{ id: string; name: string }[]>>;
  usersDiscount: { id: string; name: string }[];
  usersRes: User[];
  isLoadingUsers: boolean;
}) => {
  const [selectedUser, setSelectedUser] = useState<{ id: string; nombre: string } | null>(null);

  const handleAddUser = () => {
    if (selectedUser) {
      setUsersDiscount((prev) => [...prev, { id: selectedUser.id, name: selectedUser.nombre }]);
    }
    setSelectedUser(null);
  };

  return (
    <Stack spacing={2}>
      <Stack>
        <Typography>Seleccione un usuario</Typography>
        <Autocomplete
          options={usersRes}
          getOptionLabel={(option) => `${option.nombre}`}
          loading={isLoadingUsers}
          value={selectedUser}
          noOptionsText="No se encontraron usuarios"
          getOptionDisabled={(option) => {
            return usersDiscount.some((user) => user.id === option.id);
          }}
          onChange={(_, newValue) => {
            setSelectedUser(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleccione un usuario"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoadingUsers ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" disabled={!selectedUser} onClick={handleAddUser}>
          Agregar
        </Button>
      </Box>
    </Stack>
  );
};
