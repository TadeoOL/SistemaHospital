import { Backdrop, Box, Button, CircularProgress, MenuItem, Stack, TextField } from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addCategory } from '../../../../../schema/schemas';
import { ICategory } from '../../../../../types/types';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getCategoryById, modifyCategory } from '../../../../../api/api.routes';
import { useCategoryPagination } from '../../../../../store/purchaseStore/categoryPagination';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { useGetAlmacenes } from '../../../../../hooks/useGetAlmacenes';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, lg: 600 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 600,
};

const styleBar = {
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
  data: string;
  open: Function;
}

const useFetchCategory = (categoryId: string) => {
  const [isLoadingCategory, setIsLoadingCategory] = useState(true);
  const [category, setCategory] = useState<ICategory | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingCategory(true);
      try {
        const data = await getCategoryById(categoryId);
        setCategory(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingCategory(false);
      }
    };
    fetchData();
  }, [categoryId]);
  return { isLoadingCategory, category };
};

export const ModifyCategoryModal = (props: IModifyCategoryModal) => {
  const { open, data } = props;
  const { isLoadingCategory, category } = useFetchCategory(data);
  const [warehouseError, setWarehouseError] = useState(false);
  const [warehouseSelected, setWarehouseSelected] = useState('');
  const { almacenes, isLoadingAlmacenes } = useGetAlmacenes();
  const [textValue, setTextValue] = useState('');
  const { handleChangeCategory, setHandleChangeCategory } = useCategoryPagination((state) => ({
    handleChangeCategory: state.handleChangeCategory,
    setHandleChangeCategory: state.setHandleChangeCategory,
  }));

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ICategory>({
    defaultValues: {
      id: category?.id,
      nombre: category?.nombre,
      descripcion: category?.descripcion,
      id_Almacen: category?.id_Almacen,
    },
    resolver: zodResolver(addCategory),
  });

  const onSubmit: SubmitHandler<ICategory> = async (data) => {
    if (!warehouseSelected) {
      setWarehouseError(true);
      return;
    }
    data.id_Almacen = warehouseSelected;
    try {
      const idForm = getValues('id');
      await modifyCategory({ ...data, id: idForm });
      toast.success('Categoría modificada con éxito!');
      setHandleChangeCategory(!handleChangeCategory);
      props.open(false);
    } catch (error) {
      toast.error('Error al modificar la categoría');
    }
  };

  useEffect(() => {
    if (category) {
      if (!textValue) setTextValue(category.descripcion);
      Object.entries(category).forEach(([key, value]) => {
        setValue(key as keyof ICategory, String(value));
      });
      setWarehouseSelected(category.id_Almacen || '');
    }
  }, [category, setValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.currentTarget.value);
  };

  if (isLoadingCategory || isLoadingAlmacenes)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );

  return (
    <Box sx={style}>
      <HeaderModal setOpen={open} title="Modificar categoría" />
      <Stack sx={{ overflowY: 'auto', bgcolor: 'background.paper', ...styleBar }}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} sx={{ p: 4, maxHeight: 600 }}>
            <Stack spacing={2}>
              <TextField fullWidth {...register('nombre')} size="small" placeholder="Nombre" error={!!errors.nombre} />

              <TextField
                fullWidth
                {...register('descripcion')}
                size="small"
                placeholder="Descripción"
                error={!!errors.descripcion}
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
                onChange={handleChange}
                inputProps={{ maxLength: 200 }}
              />
              <TextField
                select
                label="Almacén"
                size="small"
                error={warehouseError}
                helperText={warehouseError && 'Selecciona un almacén'}
                value={warehouseSelected}
                onChange={(e) => {
                  setWarehouseError(false);
                  setWarehouseSelected(e.target.value);
                }}
              >
                {almacenes.map((warehouse) => (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
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
      </Stack>
    </Box>
  );
};
