import { Backdrop, Box, Button, CircularProgress, Grid, Stack, TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useWarehousePagination } from '../../../store/purchaseStore/warehousePagination';
import { IWarehouse } from '../../../types/types';
import { getPurchaseWarehouseById, modifyWarehouseById } from '../../../api/api.routes';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { addWarehouse } from '../../../schema/schemas';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelIcon from '@mui/icons-material/Cancel';

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

interface IModifyCategoryModal {
  open: Function;
  warehouseId: string;
}

const useFetchPurchaseWarehouse = (warehouseId: string) => {
  const [isLoadingWarehouse, setIsLoadingExistingArticle] = useState(true);
  const [warehouse, setWarehouse] = useState<IWarehouse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingExistingArticle(true);
      try {
        const data = await getPurchaseWarehouseById(warehouseId);
        setWarehouse(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingExistingArticle(false);
      }
    };
    fetchData();
  }, [warehouseId]);
  return { isLoadingWarehouse, warehouse };
};

export const ModifyWarehouseModal = (props: IModifyCategoryModal) => {
  const { open, warehouseId } = props;
  const { isLoadingWarehouse, warehouse } = useFetchPurchaseWarehouse(warehouseId);
  const { id, nombre, descripcion } = warehouse ?? {};
  const [textValue, setTextValue] = useState('');

  const { handleChangeWarehouse, setHandleChangeWarehouse } = useWarehousePagination((state) => ({
    setHandleChangeWarehouse: state.setHandleChangeWarehouse,
    handleChangeWarehouse: state.handleChangeWarehouse,
  }));

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IWarehouse>({
    defaultValues: {
      id: id,
      nombre: nombre,
      descripcion: descripcion,
    },
    resolver: zodResolver(addWarehouse),
  });

  useEffect(() => {
    if (warehouse) {
      setTextValue(warehouse.descripcion);
      Object.entries(warehouse).forEach(([key, value]) => {
        setValue(key as keyof IWarehouse, String(value));
      });
    }
  }, [warehouse, setValue]);

  const handleError = (err: any) => {
    console.log({ err });
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.currentTarget.value);
  };

  const onSubmit: SubmitHandler<IWarehouse> = async (data) => {
    try {
      const idForm = getValues('id');
      await modifyWarehouseById({ ...data, Id_AlmacenPrincipal: idForm });
      setHandleChangeWarehouse(!handleChangeWarehouse);
      toast.success('Almacén modificado con éxito!');
      open(false);
    } catch (error) {
      toast.error('Error al modificar el almacén!');
    }
  };

  if (isLoadingWarehouse)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );

  return (
    <Box sx={style}>
      <HeaderModal setOpen={open} title="Modificar almacén" />
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
            <Button variant="contained" type="submit" startIcon={<SaveOutlinedIcon />}>
              Guardar
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};
