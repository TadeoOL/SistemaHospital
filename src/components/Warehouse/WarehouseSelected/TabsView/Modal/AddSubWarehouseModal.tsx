import { Autocomplete, Box, Button, Stack, TextField, Typography, createFilterOptions } from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { useSubWarehousePaginationStore } from '../../../../../store/warehouseStore/subWarehousePagination';
import { useShallow } from 'zustand/react/shallow';
import { useGetUsersBySearch } from '../../../../../hooks/useGetUsersBySearch';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ISubWarehouse } from '../../../../../types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWarehouseTabsNavStore } from '../../../../../store/warehouseStore/warehouseTabsNav';
import { addNewSubWarehouseSchema } from '../../../../../schema/schemas';
import { addNewSubWarehouse, modifyWarehouseById } from '../../../../../api/api.routes';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Cancel, Save } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380 },
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
};

const OPTIONS_LIMIT = 5;
const filterOptions = createFilterOptions<string>({
  limit: OPTIONS_LIMIT,
});

interface AddSubWarehouseModalProps {
  setOpen: Function;
  edit?: boolean;
  warehouseData?: ISubWarehouse;
}

export const AddSubWarehouseModal = (props: AddSubWarehouseModalProps) => {
  const { setSearchUser, fetchSubWarehouse } = useSubWarehousePaginationStore(
    useShallow((state) => ({
      setSearchUser: state.setSearchUser,
      fetchSubWarehouse: state.fetchSubWarehouse,
    }))
  );
  const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));
  const { isLoadingUsers, usersRes } = useGetUsersBySearch();
  const userData = usersRes.find((u) => u.nombre === props.warehouseData?.usuarioEncargado);
  const [usuarioEncargado, setUsuarioEncargado] = useState<string | null>(null);

  useEffect(() => {
    if (!userData) return;
    setUsuarioEncargado(userData.id);
  }, [userData]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISubWarehouse>({
    defaultValues: {
      id: props.edit ? props.warehouseData?.id : '',
      descripcion: props.edit ? (props.warehouseData?.descripcion ? props.warehouseData?.descripcion : '') : '',
      nombre: props.edit ? props.warehouseData?.nombre : '',
    },
    resolver: zodResolver(addNewSubWarehouseSchema),
  });
  const onSubmit: SubmitHandler<ISubWarehouse> = async (data) => {
    try {
      const object = {
        nombre: data.nombre,
        descripcion: data.descripcion ? data.descripcion : '',
        Id_UsuarioEncargado: usuarioEncargado as string,
        esSubAlmacen: true,
        Id_AlmacenPrincipal: props.edit ? (props.warehouseData?.id as string) : warehouseData.id,
      };
      if (props.edit) {
        await modifyWarehouseById(object);
        toast.success('Almacén modificado con éxito!');
      } else {
        await addNewSubWarehouse(object);
        toast.success('Almacén creado con éxito!');
      }
      props.setOpen(false);
      fetchSubWarehouse();
    } catch (error) {
      toast.error('Error!');
      console.log(error);
    }
  };

  return (
    <Box sx={style}>
      <HeaderModal title="Agregar nuevo Sub Almacén" setOpen={props.setOpen} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4} sx={{ bgcolor: 'background.paper', p: 2, pl: 4 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle1">Nombre del Sub Almacén</Typography>
              <TextField
                fullWidth
                placeholder="Sub Almacén"
                size="small"
                sx={{ width: '90%' }}
                {...register('nombre')}
                error={!!errors.nombre}
                helperText={errors?.nombre?.message}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1">Descripción</Typography>
              <TextField
                fullWidth
                placeholder="Descripción"
                multiline
                sx={{ width: '90%' }}
                {...register('descripcion')}
                error={!!errors.descripcion}
                helperText={errors?.descripcion?.message}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1">Encargado de Sub Almacén</Typography>

              <Autocomplete
                disablePortal
                fullWidth
                filterOptions={filterOptions}
                onChange={(e, val) => {
                  e.stopPropagation();
                  setUsuarioEncargado(val);
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
                    error={!!errors.usuarioEncargado}
                    helperText={errors?.usuarioEncargado?.message}
                    onChange={(e) => {
                      setSearchUser(e.target.value);
                    }}
                  />
                )}
              />
            </Box>
          </Stack>
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button variant="outlined" color="error" startIcon={<Cancel />}>
              Cancelar
            </Button>
            <Button variant="contained" type="submit" startIcon={<Save />}>
              Aceptar
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};
