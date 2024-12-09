import { InputBasic, ModalBasic } from '@/common/components';
import { useForm } from 'react-hook-form';
import { IWarehouse } from '../interfaces/warehouses.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, createFilterOptions, Grid, TextField, Typography } from '@mui/material';
import { addWarehouse } from '../schemas/warehouses.schemas';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useFetchWarehouse } from '../hooks/useFetchWarehouse';
import { useEffect, useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'react-toastify';
import { Autocomplete } from '@mui/material';
import { useGetUsersBySearch } from '@/hooks/useGetUsersBySearch';
import { useShallow } from 'zustand/react/shallow';
import { useSubWarehousePaginationStore } from '@/store/warehouseStore/subWarehousePagination';
import { addNewPurchaseWarehouse } from '@/api/api.routes';

interface Props {
  itemId?: string;
  open: boolean;
  onSuccess: Function;
  onClose: Function;
}

const OPTIONS_LIMIT = 20;
const filterOptions = createFilterOptions<string>({
  limit: OPTIONS_LIMIT,
});

const WarehouseModal = (props: Props) => {
  const { open, onClose, onSuccess, itemId } = props;

  const { item, isLoading } = useFetchWarehouse(itemId);
  const [usuarioEncargado, setUsuarioEncargado] = useState<string | null>(null);
  const [errorUserNotSelected, setErrorUserNotSelected] = useState(false);
  const { isLoadingUsers, usersRes } = useGetUsersBySearch();

  const { setSearchUser } = useSubWarehousePaginationStore(
    useShallow((state) => ({
      setSearchUser: state.setSearchUser,
    }))
  );

  const defaultValues: any = {
    id: '',
  };

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<IWarehouse>({
    defaultValues,
    values: isLoading ? defaultValues : item,
    resolver: zodResolver(addWarehouse),
  });

  useEffect(() => {
    clearErrors();
  }, [open]);

  const handleError = (err: any) => {
    console.log({ err });
  };

  const onSubmit = async (data: IWarehouse) => {
    if (usuarioEncargado === null) {
      setErrorUserNotSelected(true);
      return;
    }

    data.id_UsuarioEncargado = usuarioEncargado ?? undefined;

    console.log(data);
    try {
      if (itemId) {
      } else {
        const res = await addNewPurchaseWarehouse(data);
        console.log('res:', res);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.log('error:', error);
      toast.error('Error al crear el articulo!');
    }
  };

  const actions = (
    <>
      <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => onClose()}>
        Cancelar
      </Button>
      <div className="col"></div>
      <Button variant="contained" onClick={handleSubmit(onSubmit, handleError)} startIcon={<SaveOutlinedIcon />}>
        Guardar
      </Button>
    </>
  );

  return (
    <ModalBasic
      isLoading={isLoading}
      header={itemId ? 'Editar almacen' : 'Agregar almacen'}
      open={open}
      onClose={onClose}
      actions={actions}
    >
      <form noValidate>
        <Grid component="span" container spacing={2}>
          <Grid item xs={12} md={12}>
            <InputBasic
              label="Nombre"
              placeholder="Escriba un nombre"
              {...register('nombre')}
              error={errors.nombre}
              helperText={errors.nombre?.message}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <InputBasic
              label="Descripcion"
              placeholder="Escriba una descripcion"
              {...register('descripcion')}
              error={errors.descripcion}
              helperText={errors.descripcion?.message}
            />
          </Grid>
          <Grid item xs={12} md={12}>
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
                  sx={{ width: '100%' }}
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
      </form>
    </ModalBasic>
  );
};

export default WarehouseModal;
