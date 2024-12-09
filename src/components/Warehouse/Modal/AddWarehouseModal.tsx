import { Autocomplete, Box, Button, createFilterOptions, Grid, Stack, TextField, Typography } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ISubWarehouse } from '../../../types/types';
import { addWarehouse } from '../../../schema/schemas';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { useGetUsersBySearch } from '../../../hooks/useGetUsersBySearch';
import { useSubWarehousePaginationStore } from '../../../store/warehouseStore/subWarehousePagination';
import { useShallow } from 'zustand/react/shallow';
import { addNewPurchaseWarehouse } from '../../../api/api.routes';
import { useWarehousePagination } from '../../../store/purchaseStore/warehousePagination';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, md: 600 },
  bgcolor: 'background.paper',
  borderRadius: 8,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 600,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey',
  },
};

const OPTIONS_LIMIT = 20;
const filterOptions = createFilterOptions<string>({
  limit: OPTIONS_LIMIT,
});

interface IAddPurchaseWarehouseModal {
  open: Function;
}

export const AddPurchaseWarehouseModal = (props: IAddPurchaseWarehouseModal) => {
  const { open } = props;
  const [textValue, setTextValue] = useState('');
  const { isLoadingUsers, usersRes } = useGetUsersBySearch();
  const [usuarioEncargado, setUsuarioEncargado] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorUserNotSelected, setErrorUserNotSelected] = useState(false);

  const { setSearchUser } = useSubWarehousePaginationStore(
    useShallow((state) => ({
      setSearchUser: state.setSearchUser,
    }))
  );

  const { handleChangeWarehouse, setHandleChangeWarehouse } = useWarehousePagination((state) => ({
    setHandleChangeWarehouse: state.setHandleChangeWarehouse,
    handleChangeWarehouse: state.handleChangeWarehouse,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISubWarehouse>({
    resolver: zodResolver(addWarehouse),
  });

  const handleError = (err: any) => {
    console.log({ err });
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.currentTarget.value);
  };

  const onSubmit: SubmitHandler<ISubWarehouse> = async (data) => {
    setIsLoading(true);
    try {
      if (usuarioEncargado === null) {
        setErrorUserNotSelected(true);
        return;
      }
      (data as any).id_UsuarioEncargado = usuarioEncargado ?? '';
      await addNewPurchaseWarehouse(data as any);
      setHandleChangeWarehouse(!handleChangeWarehouse);
      toast.success('Almacén creado con éxito!');
      open(false);
    } catch (error) {
      toast.error('Error al crear el almacén!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={open} title="Agregar almacén" />
      <form noValidate onSubmit={handleSubmit(onSubmit, handleError)}>
        <Stack spacing={3} sx={{ p: 4 }}>
          <Grid component="span" container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={!!errors.nombre}
                size="small"
                placeholder="Nombre"
                {...register('nombre')}
                helperText={errors.nombre?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                {...register('descripcion')}
                error={!!errors.descripcion}
                size="small"
                placeholder="Descripción"
                multiline
                helperText={
                  <Box
                    sx={{
                      display: 'flex',
                      flexGrow: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>{errors ? (errors.descripcion ? errors.descripcion.message : null) : null}</Box>
                    <Box>{`${textValue?.length}/${200}`}</Box>
                  </Box>
                }
                maxRows={5}
                onChange={handleChangeText}
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Encargado de Almacén</Typography>

              <Autocomplete
                disablePortal
                fullWidth
                filterOptions={filterOptions}
                onChange={(e, val) => {
                  e.stopPropagation();
                  setUsuarioEncargado(val);
                  if (val !== null) {
                    setErrorUserNotSelected(false);
                  }
                }}
                loading={isLoadingUsers && usersRes.length === 0}
                getOptionLabel={(option) => {
                  const res = usersRes.find((u) => u.id === option)?.nombre;
                  if (res) return res;
                  return '';
                }}
                options={usersRes.flatMap((r) => r.id)}
                value={usuarioEncargado ? usuarioEncargado : null}
                noOptionsText="No se encontraron usuarios"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Usuarios"
                    sx={{ width: '90%' }}
                    required={false}
                    error={errorUserNotSelected}
                    helperText={'Es necesario seleccionar un encargado de almacen'}
                    onChange={(e) => {
                      setSearchUser(e.target.value);
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Stack
            sx={{
              flexDirection: 'row',
              columnGap: 2,
              justifyContent: 'space-between',
            }}
          >
            <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => open(false)}>
              Cancelar
            </Button>
            <Button variant="contained" disabled={isLoading} type="submit" startIcon={<SaveOutlinedIcon />}>
              Guardar
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};
