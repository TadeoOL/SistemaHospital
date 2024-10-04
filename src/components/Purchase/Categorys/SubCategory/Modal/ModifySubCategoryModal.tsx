import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addSubCategorySchema } from '../../../../../schema/schemas';
import { ISubCategory } from '../../../../../types/types';
import { useEffect, useState } from 'react';
import { useGetCategories } from '../../../../../hooks/useGetCategories';
import { toast } from 'react-toastify';
import { getSubCategoryById, modifySubCategory } from '../../../../../api/api.routes';
import { useSubCategoryPagination } from '../../../../../store/purchaseStore/subCategoryPagination';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelIcon from '@mui/icons-material/Cancel';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, lg: 600 },
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

interface IModifySubCategoryModal {
  data: string;
  open: Function;
}

const useFetchSubCategory = (categoryId: string) => {
  const [isLoadingSubCategory, setIsLoadingSubCategory] = useState(true);
  const [subCategory, setSubCategory] = useState<ISubCategory | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingSubCategory(true);
      try {
        const data = await getSubCategoryById(categoryId);
        if (data.descripcion === null) data.descripcion = '';
        setSubCategory(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingSubCategory(false);
      }
    };
    fetchData();
  }, [categoryId]);
  return { isLoadingSubCategory, subCategory };
};

export const ModifySubCategoryModal = (props: IModifySubCategoryModal) => {
  const { data, open } = props;
  const { isLoadingSubCategory, subCategory } = useFetchSubCategory(data);
  const [textValue, setTextValue] = useState('');
  const { categories, isLoading } = useGetCategories();
  const { handleChangeSubCategory, setHandleChangeSubCategory } = useSubCategoryPagination((state) => ({
    handleChangeSubCategory: state.handleChangeSubCategory,
    setHandleChangeSubCategory: state.setHandleChangeSubCategory,
  }));

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<ISubCategory>({
    defaultValues: {
      id_SubCategoria: subCategory?.id_SubCategoria,
      nombre: subCategory?.nombre,
      descripcion: subCategory?.descripcion,
      iva: subCategory?.iva,
    },
    resolver: zodResolver(addSubCategorySchema),
  });

  const id_categoria = useWatch({
    control,
    name: 'id_categoria',
  });

  const onSubmit: SubmitHandler<ISubCategory> = async (data) => {
    try {
      const idForm = getValues('id_SubCategoria');
      await modifySubCategory({ ...data, id_SubCategoria: idForm });
      toast.success('La sub categoría ha sido modificada con éxito!');
      props.open(false);
      setHandleChangeSubCategory(!handleChangeSubCategory);
    } catch (error) {
      console.log(error);
      toast.error('Error al modificar la sub categoría!');
    }
  };

  useEffect(() => {
    if (subCategory) {
      if (!textValue) setTextValue(subCategory.descripcion);
      Object.entries(subCategory).forEach(([key, value]) => {
        if (key === 'categoria' && subCategory.categoria) {
          setValue('id_categoria', subCategory.categoria.id_Categoria as string);
        } else {
          setValue(key as keyof ISubCategory, value);
        }
      });
    }
  }, [subCategory]);

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.currentTarget.value);
  };

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setValue('id_categoria', value);
  };

  if (isLoading || isLoadingSubCategory)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );

  return (
    <Box sx={style}>
      <HeaderModal setOpen={open} title="Modificar Sub Categoría" />
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ p: 4 }}>
          <Stack spacing={2}>
            <TextField fullWidth size="small" placeholder="Nombre" {...register('nombre')} />
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
            <TextField
              fullWidth
              size="small"
              select
              label="Categoría"
              error={!!errors.id_categoria}
              helperText={errors?.id_categoria?.message}
              onChange={handleChange}
              value={id_categoria || ''}
            >
              {categories.map((category) => (
                <MenuItem value={category.id_Categoria} key={category.id_Categoria}>
                  {category.nombre}
                </MenuItem>
              ))}
            </TextField>
            <Controller
              name="iva"
              control={control}
              render={({ field }) => (
                <FormControlLabel control={<Checkbox {...field} checked={!!field.value} />} label="I.V.A." />
              )}
            />
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
    </Box>
  );
};
