import { Box, Button, Checkbox, DialogActions, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addArticle } from '../../../../../schema/schemas';
import { IArticle, ISubCategory } from '../../../../../types/types';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useGetSubCategories } from '../../../../../hooks/useGetSubCategories';
import { addNewArticle } from '../../../../../api/api.routes';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { useGetSizeUnit } from '../../../../../hooks/contpaqi/useGetSizeUnit';
import { ModalComponent } from '../../../../../common/components/ModalComponent';
import { ModalLoader } from '../../../../../common/components/ModalLoader';
import { useFetchArticle } from '../hooks/useFetchArticle';
import { useGetPurchaseConfig } from '../hooks/usePurchaseConfig';

interface IAddArticleModal {
  itemId?: string;
  open: boolean;
  onSuccess: Function;
  onClose: Function;
}

export const AddArticleModal = (props: IAddArticleModal) => {
  const { open, onClose, onSuccess, itemId } = props;

  const { subCategories, isLoading } = useGetSubCategories();
  const { sizeUnit, isLoadingConcepts } = useGetSizeUnit();
  const [unidadMedida, setUnidadMedida] = useState('');
  const config = useGetPurchaseConfig();
  const [valueState, setValueState] = useState('');
  const textQuantityRef = useRef<HTMLTextAreaElement>();
  const precioQuantityRef = useRef<HTMLTextAreaElement>();

  const [isBox, setIsBox] = useState(false);

  const { isLoadingArticle, article } = useFetchArticle(itemId);
  // const [defaultValues, setDefaultValues] = useState<any>(null);

  // useEffect(() => {
  //   console.log('getDefaultValues', !!article);
  //   if (!article) {
  //     setDefaultValues({
  //       nombre: '',
  //       descripcion: '',
  //       id_subcategoria: '',
  //       unidadMedida: '',
  //       precioCompra: '',
  //       precioVentaExterno: '',
  //       precioVentaInterno: '',
  //       codigoBarras: '',
  //       codigoSAT: '',
  //       codigoUnidadMedida: 0,
  //       presentacion: '',
  //     });
  //     return;
  //   }

  //   console.log('article:', article);

  //   setDefaultValues({
  //     id: id,
  //     nombre: nombre,
  //     descripcion: descripcion,
  //     id_subcategoria: subCategoria ? (subCategoria as ISubCategory).id_Subcategoria : '',
  //     unidadMedida: unidadMedida,
  //     precioCompra: precioCompra,
  //     precioVentaExterno: precioVentaExterno,
  //     precioVentaInterno: precioVentaInterno,
  //     unidadesPorCaja: unidadesPorCaja,
  //     esCaja: esCaja,
  //     codigoSAT: codigoSAT ?? '',
  //     codigoUnidadMedida: codigoUnidadMedida ?? 0,
  //   });
  // }, []);

  const defaultValues = {
    nombre: '',
    descripcion: '',
    id_subcategoria: '',
    unidadMedida: '',
    precioCompra: '',
    precioVentaExterno: '',
    precioVentaInterno: '',
    codigoBarras: '',
    codigoSAT: '',
    codigoUnidadMedida: 0,
    presentacion: '',
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<IArticle>({
    defaultValues,
    values: isLoadingArticle ? defaultValues : article,
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
      onSuccess();
      toast.success('Articulo creado con éxito!');
    } catch (error) {
      toast.error('Error al crear el articulo!');
    }
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
  // const handleInputNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   // Validar si el valor ingresado es un número
  //   const inputValue = event.target.value;
  //   const isNumber = /^\d*$/.test(inputValue);
  //   if (!isNumber) {
  //     // Si no es un número, eliminar el último carácter ingresado
  //     event.target.value = inputValue.slice(0, -1);
  //   }

  //   const inputValuePI = event.target.value;
  //   const isNumberPI = /^\d*$/.test(inputValuePI);
  //   if (!isNumberPI) {
  //     // Si no es un número, eliminar el último carácter ingresado
  //     event.target.value = inputValuePI.slice(0, -1);
  //   }
  // };

  const handleInputDecimalChange = (event: any) => {
    let precio = event.target.value;
    const isValidInput = /^\d*\.?\d*$/.test(precio);
    if (!isValidInput) {
      event.target.value = precio.slice(0, -1);
    }
    const unidadesPorCaja = (textQuantityRef.current?.value as string) ?? '1';
    config?.factorExterno.forEach((factorExterno) => {
      if (precio >= factorExterno.cantidadMinima && precio <= factorExterno.cantidadMaxima && isBox == false) {
        const precioCompra = parseFloat(precio);
        const factorMultiplicador = factorExterno.factorMultiplicador as number;
        const precioVenta = precioCompra * factorMultiplicador;
        if (!isNaN(precioVenta)) {
          const precioVentaString = precioVenta.toFixed(2).toString();
          console.log(precioVentaString);
          setValue('precioVentaExterno', precioVentaString);
        } else {
          setValue('precioVentaExterno', '0');
        }
      } else if (
        isBox &&
        parseFloat(precio) / parseFloat(unidadesPorCaja) >= (factorExterno.cantidadMinima as number) &&
        parseFloat(precio) / parseFloat(unidadesPorCaja) <= (factorExterno.cantidadMaxima as number)
      ) {
        const unidadesPorCaja = (textQuantityRef.current?.value as string) ?? '1';
        const precioCompra = parseFloat(precio) / parseFloat(unidadesPorCaja);
        const factorMultiplicador = factorExterno.factorMultiplicador as number;
        const precioVenta = precioCompra * factorMultiplicador;
        if (!isNaN(precioVenta)) {
          const precioVentaString = precioVenta.toFixed(2).toString();
          setValue('precioVentaExterno', precioVentaString);
        } else {
          setValue('precioVentaExterno', '0');
        }
      }
    });
    config?.factorInterno?.forEach((factorExterno) => {
      if (precio >= factorExterno.cantidadMinima && precio <= factorExterno.cantidadMaxima && isBox == false) {
        const precioCompra = parseFloat(precio);
        const factorMultiplicador = factorExterno.factorMultiplicador as number;
        const precioVentaPI = precioCompra * factorMultiplicador;
        if (!isNaN(precioVentaPI)) {
          const precioVentaString = precioVentaPI.toFixed(2).toString();
          setValue('precioVentaInterno', precioVentaString);
        } else {
          setValue('precioVentaInterno', '0');
        }
      } else if (
        isBox &&
        parseFloat(precio) / parseFloat(unidadesPorCaja) >= (factorExterno.cantidadMinima as number) &&
        parseFloat(precio) / parseFloat(unidadesPorCaja) <= (factorExterno.cantidadMaxima as number)
      ) {
        const unidadesPorCaja = (textQuantityRef.current?.value as string) ?? '1';
        const precioCompra = parseFloat(precio) / parseFloat(unidadesPorCaja);
        const factorMultiplicador = factorExterno.factorMultiplicador as number;
        const precioVentaPI = precioCompra * factorMultiplicador;
        if (!isNaN(precioVentaPI)) {
          const precioVentaString = precioVentaPI.toFixed(2).toString();
          setValue('precioVentaInterno', precioVentaString);
        } else {
          setValue('precioVentaInterno', '0');
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
    config?.factorExterno.forEach((factorExterno) => {
      if (precio >= factorExterno.cantidadMinima && precio <= factorExterno.cantidadMaxima && isBox == false) {
        const precioCompra = parseFloat(precio);
        const factorMultiplicador = factorExterno.factorMultiplicador as number;
        const precioVenta = precioCompra * factorMultiplicador;
        if (!isNaN(precioVenta)) {
          const precioVentaString = precioVenta.toFixed(2).toString();
          console.log(precioVentaString);
          setValue('precioVentaExterno', precioVentaString);
        } else {
          setValue('precioVentaExterno', '0');
        }
      } else if (
        isBox &&
        parseFloat(precio) / parseFloat(unidadesPorCaja) >= (factorExterno.cantidadMinima as number) &&
        parseFloat(precio) / parseFloat(unidadesPorCaja) <= (factorExterno.cantidadMaxima as number)
      ) {
        const unidadesPorCaja = (textQuantityRef.current?.value as string) ?? '1';
        const precioCompra = parseFloat(precio) / parseFloat(unidadesPorCaja);
        const factorMultiplicador = factorExterno.factorMultiplicador as number;
        const precioVenta = precioCompra * factorMultiplicador;
        if (!isNaN(precioVenta)) {
          const precioVentaString = precioVenta.toFixed(2).toString();
          setValue('precioVentaExterno', precioVentaString);
        } else {
          setValue('precioVentaExterno', '0');
        }
      }
    });
    config?.factorInterno?.forEach((factorExterno) => {
      if (precio >= factorExterno.cantidadMinima && precio <= factorExterno.cantidadMaxima && isBox == false) {
        const precioCompra = parseFloat(precio);
        const factorMultiplicador = factorExterno.factorMultiplicador as number;
        const precioVentaPI = precioCompra * factorMultiplicador;
        if (!isNaN(precioVentaPI)) {
          const precioVentaString = precioVentaPI.toFixed(2).toString();
          setValue('precioVentaInterno', precioVentaString);
        } else {
          setValue('precioVentaInterno', '0');
        }
      } else if (
        isBox &&
        parseFloat(precio) / parseFloat(unidadesPorCaja) >= (factorExterno.cantidadMinima as number) &&
        parseFloat(precio) / parseFloat(unidadesPorCaja) <= (factorExterno.cantidadMaxima as number)
      ) {
        const unidadesPorCaja = (textQuantityRef.current?.value as string) ?? '1';
        const precioCompra = parseFloat(precio) / parseFloat(unidadesPorCaja);
        const factorMultiplicador = factorExterno.factorMultiplicador as number;
        const precioVentaPI = precioCompra * factorMultiplicador;
        if (!isNaN(precioVentaPI)) {
          const precioVentaString = precioVentaPI.toFixed(2).toString();
          setValue('precioVentaInterno', precioVentaString);
        } else {
          setValue('precioVentaInterno', '0');
        }
      }
    });
  };

  return (
    <ModalComponent
      isLoading={(isLoading && isLoadingConcepts) || (!!itemId && isLoadingArticle)}
      open={open}
      header={itemId ? 'Modificar articulo' : 'Agregar articulo'}
      onClose={onClose}
    >
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
                error={!!errors.presentacion}
                helperText={errors?.presentacion?.message}
                size="small"
                placeholder="Escriba una presentación"
                {...register('presentacion')}
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
                error={!!errors.precioVentaExterno}
                helperText={errors?.precioVentaExterno?.message}
                size="small"
                value={watch('precioVentaExterno')}
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
                error={!!errors.precioVentaInterno}
                helperText={errors?.precioVentaInterno?.message}
                size="small"
                value={watch('precioVentaInterno')}
                inputProps={{
                  maxLength: 10,
                }}
                placeholder="Escriba un Precio de Venta PI"
                // {...register('precioVentaPI')}
              />
            </Grid>
            {/* <Grid item xs={12} md={6}>
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
              </Grid> */}
            <Grid item xs={12} md={6}>
              <Typography>Sub Categoría</Typography>
              <Controller
                render={({ field }) => (
                  <TextField {...field} select label="Seleccione una Sub Categoria" fullWidth>
                    {subCategories.map((data) => (
                      <MenuItem value={data.id_Subcategoria} key={data.id_Subcategoria}>
                        {data.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
                control={control}
                name="id_subcategoria"
              />
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
            <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => onClose()}>
              Cancelar
            </Button>
            <Button variant="contained" type="submit" startIcon={<SaveOutlinedIcon />}>
              Guardar
            </Button>
          </Stack>
        </Stack>
      </form>
    </ModalComponent>
  );
};
