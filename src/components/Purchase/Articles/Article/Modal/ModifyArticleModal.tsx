import { Backdrop, Box, Button, CircularProgress, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addArticle } from '../../../../../schema/schemas';
import { IArticle, IPurchaseConfig, ISubCategory } from '../../../../../types/types';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useGetSubCategories } from '../../../../../hooks/useGetSubCategories';
import { useArticlePagination } from '../../../../../store/purchaseStore/articlePagination';
import { getArticleById, getPurchaseConfig, modifyArticle } from '../../../../../api/api.routes';
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
  articleId: string;
}

const useFetchArticle = (articleId: string) => {
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);
  const [article, setArticle] = useState<IArticle | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingArticle(true);
      try {
        const data = await getArticleById(articleId);
        setArticle(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingArticle(false);
      }
    };
    fetchData();
  }, [articleId]);
  return { isLoadingArticle, article };
};
const useGetPurchaseConfig = () => {
  const [config, setConfig] = useState<IPurchaseConfig>();
  useEffect(() => {
    const fetch = async () => {
      try {
        const config = await getPurchaseConfig();
        setConfig(config);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);
  return config;
};

export const ModifyArticleModal = (props: IModifyCategoryModal) => {
  const { open, articleId } = props;
  const { isLoadingArticle, article } = useFetchArticle(articleId);
  const {
    id,
    codigoBarras,
    descripcion,
    id_subcategoria,
    nombre,
    stockAlerta,
    stockMinimo,
    unidadMedida,
    precioCompra,
    precioVenta,
  } = article ?? {};

  const { subCategories, isLoading } = useGetSubCategories();
  const [textValue, setTextValue] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [inputValue, setInputValue] = useState<string>();
  const config = useGetPurchaseConfig();

  const { handleChangeArticle, setHandleChangeArticle } = useArticlePagination((state) => ({
    setHandleChangeArticle: state.setHandleChangeArticle,
    handleChangeArticle: state.handleChangeArticle,
  }));

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<IArticle>({
    defaultValues: {
      id: id,
      nombre: nombre,
      descripcion: descripcion,
      codigoBarras: codigoBarras,
      id_subcategoria: id_subcategoria,
      stockAlerta: stockAlerta,
      stockMinimo: stockMinimo,
      unidadMedida: unidadMedida,
      precioCompra: precioCompra,
      precioVenta: precioVenta,
    },
    resolver: zodResolver(addArticle),
  });

  useEffect(() => {
    if (article) {
      const subCate = article.subCategoria as ISubCategory;
      if (article.descripcion == null) article.descripcion = '';
      if (textValue.trim() === '') setTextValue(article.descripcion);
      if (!subCategory) setSubCategory(subCate.id);
      setValue('id_subcategoria', subCate.id);
      Object.entries(article).forEach(([key, value]) => {
        if (key === 'stockMinimo' || key === 'stockAlerta' || key === 'precioCompra') {
          setValue(key as keyof IArticle, String(value));
        } else {
          setValue(key as keyof IArticle, value);
        }
      });
    }
  }, [article, setValue]);

  const handleError = (err: any) => {
    console.log({ err });
  };
  const onSubmit: SubmitHandler<IArticle> = async (data) => {
    try {
      const idForm = getValues('id');
      await modifyArticle({ ...data, id: idForm });
      setHandleChangeArticle(!handleChangeArticle);
      toast.success('Articulo modificado con éxito!');
      open(false);
    } catch (error) {
      toast.error('Error al modificar el articulo!');
    }
  };

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSubCategory(value);
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.currentTarget.value);
  };

  if (isLoading || isLoadingArticle)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );

  const handleInputNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Validar si el valor ingresado es un número
    const inputValue = event.target.value;
    const isNumber = /^\d*$/.test(inputValue);
    if (!isNumber) {
      // Si no es un número, eliminar el último carácter ingresado
      event.target.value = inputValue.slice(0, -1);
    }
  };

  const handleInputDecimalChange = (event: any) => {
    // Validar si el valor ingresado es un número con punto decimal
    let precio = event.target.value;
    const isValidInput = /^\d*\.?\d*$/.test(precio);
    if (!isValidInput) {
      event.target.value = precio.slice(0, -1);
    }
    config?.factor.forEach((factor) => {
      if (precio >= factor.cantidadMinima && precio <= factor.cantidadMaxima) {
        const precioCompra = parseFloat(precio);
        const factorMultiplicador = factor.factorMultiplicador as number;
        const precioVenta = precioCompra * factorMultiplicador;
        if (!isNaN(precioVenta)) {
          const precioVentaString = precioVenta.toFixed(2).toString();
          setInputValue(precioVentaString);
        } else {
          setInputValue('0');
        }
      }
    });
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={open} title="Modificar articulo" />
      <form noValidate onSubmit={handleSubmit(onSubmit, handleError)}>
        <Stack sx={{ p: 4 }}>
          <Grid component="span" container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography>Nombre</Typography>
              <TextField
                fullWidth
                error={!!errors.nombre}
                helperText={errors?.nombre?.message}
                size="small"
                placeholder="Escriba un Nombre"
                {...register('nombre')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>Presentación</Typography>
              <TextField
                fullWidth
                error={!!errors.unidadMedida}
                helperText={errors?.unidadMedida?.message}
                size="small"
                placeholder="Escriba una presentación"
                {...register('unidadMedida')}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography>Descripción</Typography>
              <TextField
                fullWidth
                error={!!errors.descripcion}
                size="small"
                placeholder="Escriba una Descripción"
                {...register('descripcion')}
                multiline
                onChange={handleChangeText}
                helperText={
                  <Box
                    sx={{
                      display: 'flex',
                      flexGrow: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>{errors ? (errors.descripcion ? errors.descripcion.message : null) : null}</Box>
                    <Box>{`${textValue.length}/${200}`}</Box>
                  </Box>
                }
                maxRows={3}
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>Precio de Compra</Typography>
              <TextField
                fullWidth
                error={!!errors.precioCompra}
                helperText={errors?.precioCompra?.message}
                size="small"
                inputProps={{
                  maxLength: 10,
                  onInput: (e: any) => handleInputDecimalChange(e),
                }}
                // onChange={(e: any) => handleInputDecimalChange(e)}
                placeholder="Escriba un Precio de Compra"
                {...register('precioCompra')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>Precio de Venta</Typography>
              <TextField
                fullWidth
                error={!!errors.precioVenta}
                helperText={errors?.precioVenta?.message}
                size="small"
                value={inputValue}
                inputProps={{
                  maxLength: 10,
                }}
                // onChange={(e: any) => handleInputDecimalChange(e)}
                placeholder="Escriba un Precio de Venta"
                {...register('precioVenta')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>Stock Mínimo</Typography>
              <TextField
                fullWidth
                error={!!errors.stockMinimo}
                helperText={errors?.stockMinimo?.message}
                size="small"
                inputProps={{
                  maxLength: 5,
                  onInput: handleInputNumberChange,
                }}
                placeholder="Dígite un Stock Mínimo"
                {...register('stockMinimo')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>Stock Alerta</Typography>
              <TextField
                fullWidth
                error={!!errors.stockAlerta}
                helperText={errors?.stockAlerta?.message}
                size="small"
                inputProps={{
                  maxLength: 5,
                  onInput: handleInputNumberChange,
                }}
                placeholder="Dígite un Stock Alerta"
                {...register('stockAlerta')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>Código de Barras</Typography>
              <TextField
                fullWidth
                error={!!errors.codigoBarras}
                helperText={errors?.codigoBarras?.message}
                size="small"
                placeholder="Escriba un Código de barras"
                {...register('codigoBarras')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>Sub Categoría</Typography>
              <TextField
                fullWidth
                size="small"
                select
                label="Seleccione una Sub Categoria"
                error={!!errors.id_subcategoria}
                helperText={errors?.id_subcategoria?.message}
                {...register('id_subcategoria')}
                value={subCategory}
                onChange={handleChange}
              >
                {subCategories.map((data) => (
                  <MenuItem value={data.id} key={data.id}>
                    {data.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Stack
            sx={{
              flexDirection: 'row',
              columnGap: 2,
              justifyContent: 'space-between',
              pt: 4,
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
