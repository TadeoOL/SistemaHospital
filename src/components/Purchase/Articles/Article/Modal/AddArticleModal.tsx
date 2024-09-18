import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addArticle } from '../../../../../schema/schemas';
import { IArticle, IPurchaseConfig } from '../../../../../types/types';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useGetSubCategories } from '../../../../../hooks/useGetSubCategories';
import { useArticlePagination } from '../../../../../store/purchaseStore/articlePagination';
import { addNewArticle, getPurchaseConfig } from '../../../../../api/api.routes';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { useGetSizeUnit } from '../../../../../hooks/contpaqi/useGetSizeUnit';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, md: 600 },

  borderRadius: 8,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 600,
};

const style2 = {
  bgcolor: 'background.paper',
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

interface IAddArticleModal {
  open: Function;
}

export const AddArticleModal = (props: IAddArticleModal) => {
  const { open } = props;
  const { subCategories, isLoading } = useGetSubCategories();
  const { sizeUnit, isLoadingConcepts } = useGetSizeUnit();
  const [unidadMedida, setUnidadMedida] = useState('');
  const config = useGetPurchaseConfig();
  const [valueState, setValueState] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const textQuantityRef = useRef<HTMLTextAreaElement>();
  const precioQuantityRef = useRef<HTMLTextAreaElement>();

  const { handleChangeArticle, setHandleChangeArticle } = useArticlePagination((state) => ({
    setHandleChangeArticle: state.setHandleChangeArticle,
    handleChangeArticle: state.handleChangeArticle,
  }));
  const [isBox, setIsBox] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IArticle>({
    defaultValues: {
      nombre: '',
      descripcion: '',
      id_subcategoria: '',
      stockAlerta: '',
      stockMinimo: '',
      unidadMedida: '',
      precioCompra: '',
      precioVenta: '',
      precioVentaPI: '',
      codigoBarras: '',
      codigoSAT: '',
      codigoUnidadMedida: '',
    },
    resolver: zodResolver(addArticle),
  });

  const handleError = (err: any) => {
    console.log({ err });
  };
  const onSubmit: SubmitHandler<IArticle> = async (data) => {
    try {
      if (isBox && !textQuantityRef.current?.value) {
        toast.error('escribe un número de unidades por caja');
        return;
      }
      const numberQuantity = Number(textQuantityRef.current?.value);
      if (isNaN(numberQuantity)) {
        toast.error('No es un valor numerico entero');
        return;
      }
      data.esCaja = isBox;
      data.unidadesPorCaja = textQuantityRef.current?.value || undefined;
      // data.precioVenta = precioVenta;
      // data.precioVentaPI = precioVentaPI;
      await addNewArticle(data);
      setHandleChangeArticle(!handleChangeArticle);
      toast.success('Articulo creado con éxito!');
      open(false);
    } catch (error) {
      toast.error('Error al crear el articulo!');
    }
  };

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSubCategory(value);
  };

  const handleChangeUnidadMedida = (event: any) => {
    const {
      target: { value },
    } = event;
    setUnidadMedida(value);
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueState(event.currentTarget.value);
  };

  if (isLoading && isLoadingConcepts)
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

    const inputValuePI = event.target.value;
    const isNumberPI = /^\d*$/.test(inputValuePI);
    if (!isNumberPI) {
      // Si no es un número, eliminar el último carácter ingresado
      event.target.value = inputValuePI.slice(0, -1);
    }
  };

  const handleInputDecimalChange = (event: any) => {
    let precio = event.target.value;
    const isValidInput = /^\d*\.?\d*$/.test(precio);
    if (!isValidInput) {
      event.target.value = precio.slice(0, -1);
    }
    const unidadesPorCaja = (textQuantityRef.current?.value as string) ?? '1';
    config?.factor.forEach((factor) => {
      if (precio >= factor.cantidadMinima && precio <= factor.cantidadMaxima && isBox == false) {
        const precioCompra = parseFloat(precio);
        const factorMultiplicador = factor.factorMultiplicador as number;
        const precioVenta = precioCompra * factorMultiplicador;
        if (!isNaN(precioVenta)) {
          const precioVentaString = precioVenta.toFixed(2).toString();
          console.log(precioVentaString);
          setValue('precioVenta', precioVentaString);
        } else {
          setValue('precioVenta', '0');
        }
      } else if (
        isBox &&
        parseFloat(precio) / parseFloat(unidadesPorCaja) >= (factor.cantidadMinima as number) &&
        parseFloat(precio) / parseFloat(unidadesPorCaja) <= (factor.cantidadMaxima as number)
      ) {
        const unidadesPorCaja = (textQuantityRef.current?.value as string) ?? '1';
        const precioCompra = parseFloat(precio) / parseFloat(unidadesPorCaja);
        const factorMultiplicador = factor.factorMultiplicador as number;
        const precioVenta = precioCompra * factorMultiplicador;
        if (!isNaN(precioVenta)) {
          const precioVentaString = precioVenta.toFixed(2).toString();
          setValue('precioVenta', precioVentaString);
        } else {
          setValue('precioVenta', '0');
        }
      }
    });
    config?.factorInterno?.forEach((factor) => {
      if (precio >= factor.cantidadMinima && precio <= factor.cantidadMaxima && isBox == false) {
        const precioCompra = parseFloat(precio);
        const factorMultiplicador = factor.factorMultiplicador as number;
        const precioVentaPI = precioCompra * factorMultiplicador;
        if (!isNaN(precioVentaPI)) {
          const precioVentaString = precioVentaPI.toFixed(2).toString();
          setValue('precioVentaPI', precioVentaString);
        } else {
          setValue('precioVentaPI', '0');
        }
      } else if (
        isBox &&
        parseFloat(precio) / parseFloat(unidadesPorCaja) >= (factor.cantidadMinima as number) &&
        parseFloat(precio) / parseFloat(unidadesPorCaja) <= (factor.cantidadMaxima as number)
      ) {
        const unidadesPorCaja = (textQuantityRef.current?.value as string) ?? '1';
        const precioCompra = parseFloat(precio) / parseFloat(unidadesPorCaja);
        const factorMultiplicador = factor.factorMultiplicador as number;
        const precioVentaPI = precioCompra * factorMultiplicador;
        if (!isNaN(precioVentaPI)) {
          const precioVentaString = precioVentaPI.toFixed(2).toString();
          setValue('precioVentaPI', precioVentaString);
        } else {
          setValue('precioVentaPI', '0');
        }
      }
    });
  };

  const handleInputBox = (event: any) => {
    let unidadesPorCaja = event.target.value;
    const precio = (precioQuantityRef.current?.value as string) ?? '1';
    const isValidInput = /^\d*\.?\d*$/.test(precio);
    if (!isValidInput) {
      event.target.value = precio.slice(0, -1);
    }
    config?.factor.forEach((factor) => {
      if (precio >= factor.cantidadMinima && precio <= factor.cantidadMaxima && isBox == false) {
        const precioCompra = parseFloat(precio);
        const factorMultiplicador = factor.factorMultiplicador as number;
        const precioVenta = precioCompra * factorMultiplicador;
        if (!isNaN(precioVenta)) {
          const precioVentaString = precioVenta.toFixed(2).toString();
          console.log(precioVentaString);
          setValue('precioVenta', precioVentaString);
        } else {
          setValue('precioVenta', '0');
        }
      } else if (
        isBox &&
        parseFloat(precio) / parseFloat(unidadesPorCaja) >= (factor.cantidadMinima as number) &&
        parseFloat(precio) / parseFloat(unidadesPorCaja) <= (factor.cantidadMaxima as number)
      ) {
        const unidadesPorCaja = (textQuantityRef.current?.value as string) ?? '1';
        const precioCompra = parseFloat(precio) / parseFloat(unidadesPorCaja);
        const factorMultiplicador = factor.factorMultiplicador as number;
        const precioVenta = precioCompra * factorMultiplicador;
        if (!isNaN(precioVenta)) {
          const precioVentaString = precioVenta.toFixed(2).toString();
          setValue('precioVenta', precioVentaString);
        } else {
          setValue('precioVenta', '0');
        }
      }
    });
    config?.factorInterno?.forEach((factor) => {
      if (precio >= factor.cantidadMinima && precio <= factor.cantidadMaxima && isBox == false) {
        const precioCompra = parseFloat(precio);
        const factorMultiplicador = factor.factorMultiplicador as number;
        const precioVentaPI = precioCompra * factorMultiplicador;
        if (!isNaN(precioVentaPI)) {
          const precioVentaString = precioVentaPI.toFixed(2).toString();
          setValue('precioVentaPI', precioVentaString);
        } else {
          setValue('precioVentaPI', '0');
        }
      } else if (
        isBox &&
        parseFloat(precio) / parseFloat(unidadesPorCaja) >= (factor.cantidadMinima as number) &&
        parseFloat(precio) / parseFloat(unidadesPorCaja) <= (factor.cantidadMaxima as number)
      ) {
        const unidadesPorCaja = (textQuantityRef.current?.value as string) ?? '1';
        const precioCompra = parseFloat(precio) / parseFloat(unidadesPorCaja);
        const factorMultiplicador = factor.factorMultiplicador as number;
        const precioVentaPI = precioCompra * factorMultiplicador;
        if (!isNaN(precioVentaPI)) {
          const precioVentaString = precioVentaPI.toFixed(2).toString();
          setValue('precioVentaPI', precioVentaString);
        } else {
          setValue('precioVentaPI', '0');
        }
      }
    });
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={open} title="Agregar articulo" />
      <Box sx={style2}>
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
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>Es un Paquete</Typography>
                    <Checkbox
                      checked={isBox}
                      onChange={() => {
                        setIsBox(!isBox);
                      }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    size="small"
                    label="Unidades por Paquete"
                    disabled={!isBox}
                    inputRef={textQuantityRef}
                    sx={{ display: isBox ? 'block' : 'none' }}
                    inputProps={{
                      type: 'number',
                      pattern: '[0-9]*',
                      inputMode: 'numeric',
                      min: 0,
                      onInput: (e: any) => handleInputBox(e),
                    }}
                  />
                </Box>
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
                      <Box>{`${valueState.length}/${200}`}</Box>
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
                  inputRef={precioQuantityRef}
                  size="small"
                  inputProps={{
                    maxLength: 10,
                    onInput: (e: any) => handleInputDecimalChange(e),
                  }}
                  placeholder="Escriba un Precio de Compra"
                  {...register('precioCompra')}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography>Precio de Venta</Typography>
                <TextField
                  fullWidth
                  error={!!errors.precioVenta}
                  helperText={errors?.precioVenta?.message}
                  size="small"
                  value={watch('precioVenta')}
                  inputProps={{
                    maxLength: 10,
                  }}
                  placeholder="Escriba un Precio de Venta"
                  // {...register('precioVenta')}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography>Venta Interna</Typography>
                <TextField
                  fullWidth
                  error={!!errors.precioVentaPI}
                  helperText={errors?.precioVentaPI?.message}
                  size="small"
                  value={watch('precioVentaPI')}
                  inputProps={{
                    maxLength: 10,
                  }}
                  placeholder="Escriba un Precio de Venta PI"
                  // {...register('precioVentaPI')}
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
                    maxLength: 10,
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
                    maxLength: 10,
                    onInput: handleInputNumberChange,
                  }}
                  placeholder="Dígite un Stock Alerta"
                  {...register('stockAlerta')}
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
              <Grid item xs={12} md={6}>
                <Typography>Código de Barras (Opcional)</Typography>
                <TextField
                  fullWidth
                  error={!!errors.codigoBarras}
                  helperText={errors?.codigoBarras?.message}
                  size="small"
                  placeholder="Escriba un código de barras"
                  {...register('codigoBarras')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>Código de SAT</Typography>
                <TextField
                  fullWidth
                  error={!!errors.codigoSAT}
                  helperText={errors?.codigoSAT?.message}
                  size="small"
                  placeholder="Escriba un código de SAT"
                  {...register('codigoSAT')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>Unidad de Medida Contpaqi</Typography>
                <TextField
                  fullWidth
                  size="small"
                  select
                  label="Seleccione una unidad de medida"
                  error={!!errors.codigoUnidadMedida}
                  helperText={errors?.codigoUnidadMedida?.message}
                  {...register('codigoUnidadMedida')}
                  value={unidadMedida}
                  onChange={handleChangeUnidadMedida}
                >
                  {sizeUnit.map((data) => (
                    <MenuItem value={data.id_UnidadMedida} key={data.id_UnidadMedida}>
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
    </Box>
  );
};
