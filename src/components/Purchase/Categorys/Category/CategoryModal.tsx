import { Button } from '@mui/material';
import { ModalBasic } from '../../../../common/components/ModalBasic';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ICategory } from '../../../../types/types';
import { useFetchCategory } from './hooks/useFetchCategory';
import { zodResolver } from '@hookform/resolvers/zod';
import { addCategory } from '../../../../schema/schemas';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { addNewCategory, modifyCategory } from '../../../../api/api.routes';
import { InputBasic } from '../../../../common/components/InputBasic';
import { Grid } from '@mui/material';
import { SelectBasic } from '../../../../common/components/SelectBasic';
import { useGetAlmacenes } from '../../../../hooks/useGetAlmacenes';

interface IAddCategoryModal {
  itemId?: string;
  open: boolean;
  onSuccess: Function;
  onClose: Function;
}

export const CategoryModal = (props: IAddCategoryModal) => {
  const { open, onClose, onSuccess, itemId } = props;

  const { category, isLoadingCategory } = useFetchCategory(itemId);
  const { almacenes, isLoadingAlmacenes } = useGetAlmacenes();

  const defaultValues: any = {
    id: '',
  };

  const {
    register,
    watch,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<ICategory>({
    defaultValues,
    values:
      isLoadingCategory || !category
        ? defaultValues
        : {
            ...category,
            id_Almacen: (category as any)?.id_Almacen,
          },
    resolver: zodResolver(addCategory),
  });

  useEffect(() => {
    clearErrors();
  }, [open]);

  const handleError = (err: any) => {
    console.log({ err });
  };

  const onSubmit: SubmitHandler<ICategory> = async (data) => {
    try {
      console.log('data:', data);
      if (!itemId) {
        const res = await addNewCategory(data);
        console.log('res:', res);
      } else {
        const res = await modifyCategory(data);
        console.log('res:', res);
      }
      onSuccess();
      onClose();
      toast.success('Articulo creado con éxito!');
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
      isLoading={(!!itemId && isLoadingCategory) || isLoadingAlmacenes}
      open={open}
      header={itemId ? 'Modificar categoría' : 'Agregar categoría'}
      onClose={onClose}
      actions={actions}
    >
      <form noValidate>
        <Grid component="span" container spacing={2}>
          <Grid item xs={12} md={6}>
            <InputBasic
              label="Nombre"
              placeholder="Nombre"
              error={!!errors.nombre}
              helperText={errors?.nombre?.message}
              {...register('nombre')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputBasic
              label="Descripción"
              placeholder="Descripción"
              error={!!errors.descripcion}
              helperText={errors?.descripcion?.message}
              {...register('descripcion')}
              multiline
              maxRows={3}
              maxLength={200}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectBasic
              value={watch('id_Almacen')}
              label="Almacén"
              options={almacenes}
              uniqueProperty="id_Almacen"
              displayProperty="nombre"
              error={!!errors.id_Almacen}
              helperText={errors?.id_Almacen?.message}
              {...register('id_Almacen')}
            />
          </Grid>
          {/* <TextField
              select
              label="Almacén"
              size="small"
              error={warehouseError}
              helperText={warehouseError && 'Selecciona un almacén'}
              value={warehouseSelected}
            >
              {almacenes.map((warehouse) => (
                <MenuItem key={warehouse.id_Almacen} value={warehouse.id_Almacen}>
                  {warehouse.nombre}
                </MenuItem>
              ))}
            </TextField> */}
        </Grid>
      </form>
    </ModalBasic>
  );
};
