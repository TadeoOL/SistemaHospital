import { Button } from '@mui/material';
import { ModalBasic } from '../../../../common/components/ModalBasic';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ISubCategory } from '../../../../types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { addSubCategorySchema } from '../../../../schema/schemas';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { InputBasic } from '../../../../common/components/InputBasic';
import { Grid } from '@mui/material';
import { SelectBasic } from '../../../../common/components/SelectBasic';
import { useFetchSubCategory } from './hooks/useFetchSubCategory';
import { addNewSubCategory, modifySubCategory } from '../../../../api/subcategories';
import { useGetCategories } from '../../../../hooks/useGetCategories';
import { FormControlLabel } from '@mui/material';
import { Checkbox } from '@mui/material';

interface SubCategoryModalProps {
  itemId?: string;
  open: boolean;
  onSuccess: Function;
  onClose: Function;
}

export const SubCategoryModal = (props: SubCategoryModalProps) => {
  const { open, onClose, onSuccess, itemId } = props;

  const { subCategory, isLoadingSubCategory } = useFetchSubCategory(itemId);
  const { categories, isLoading: isLoadingCategories } = useGetCategories();

  const [iva, setIva] = useState(false);

  const defaultValues: any = {
    id: '',
  };

  const {
    register,
    watch,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<ISubCategory>({
    defaultValues,
    values:
      isLoadingSubCategory || !subCategory
        ? defaultValues
        : {
            ...subCategory,
            id_categoria: (subCategory as any)?.categoria?.id_Categoria,
          },
    resolver: zodResolver(addSubCategorySchema),
  });

  useEffect(() => {
    clearErrors();
  }, [open]);

  const handleError = (err: any) => {
    console.log({ err });
  };

  const onSubmit: SubmitHandler<ISubCategory> = async (data) => {
    try {
      data.id = itemId || undefined;
      data.iva = iva;
      console.log('data:', data);
      if (!itemId) {
        const res = await addNewSubCategory(data);
        console.log('res:', res);
      } else {
        const res = await modifySubCategory(data);
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
      isLoading={(!!itemId && isLoadingSubCategory) || isLoadingCategories}
      open={open}
      header={itemId ? 'Modificar subcategoría' : 'Agregar subcategoría'}
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
              value={watch('id_categoria')}
              label="Categoria"
              options={categories}
              uniqueProperty="id_Categoria"
              displayProperty="nombre"
              error={!!errors.id_categoria}
              helperText={errors?.id_categoria?.message}
              {...register('id_categoria')}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <FormControlLabel
              sx={{ ml: 0 }}
              control={
                <Checkbox
                  checked={iva}
                  {...register('iva')}
                  onChange={() => {
                    setIva(!iva);
                  }}
                />
              }
              label="IVA"
              labelPlacement="start"
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
