import { Box, Button, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addArticle } from '../../../../../schema/schemas';
import { IArticle } from '../../../../../types/types';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useGetSubCategories } from '../../../../../hooks/useGetSubCategories';
import { addNewArticle } from '../../../../../api/api.routes';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { useGetSizeUnit } from '../../../../../hooks/contpaqi/useGetSizeUnit';
import { ModalBasic } from '../../../../../common/components/ModalBasic';
import { useFetchArticle } from '../hooks/useFetchArticle';
import { useGetPurchaseConfig } from '../hooks/usePurchaseConfig';
import { InputBasic } from '../../../../../common/components/InputBasic';
import { SelectBasic } from '../../../../../common/components/SelectBasic';

interface IAddArticleModal {
  itemId?: string;
  open: boolean;
  onSuccess: Function;
  onClose: Function;
}

export const ArticleModal = (props: IAddArticleModal) => {
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

  const defaultValues = {
    id: '',
    subCategoria: '',
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
    clearErrors,
    formState: { errors },
  } = useForm<IArticle>({
    defaultValues,
    values: isLoadingArticle ? defaultValues : article || defaultValues,
    resolver: zodResolver(addArticle),
  });

  useEffect(() => {
    clearErrors();
  }, [open]);

  const handleError = (err: any) => {
    console.log({ err });
  };

  const onSubmit: SubmitHandler<IArticle> = async (data) => {
    console.log('data:', data);
    return;
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
      isLoading={(isLoading && isLoadingConcepts) || (!!itemId && isLoadingArticle)}
      open={open}
      header={itemId ? 'Modificar articulo' : 'Agregar articulo'}
      onClose={onClose}
      actions={actions}
    >
      <form noValidate>
        <Grid component="span" container spacing={2}>
          <Grid item xs={12} md={6}>
            <InputBasic
              label="Nombre"
              placeholder="Escriba un Nombre"
              {...register('nombre')}
              error={!!errors.nombre}
              helperText={errors?.nombre?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputBasic
              label="Presentación"
              placeholder="Escriba una Presentación"
              {...register('presentacion')}
              error={!!errors.presentacion}
              helperText={errors?.presentacion?.message}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControlLabel
              sx={{ ml: 0 }}
              control={
                <Checkbox
                  checked={isBox}
                  onChange={() => {
                    setIsBox(!isBox);
                  }}
                />
              }
              label="Es un Paquete"
              labelPlacement="start"
            />
          </Grid>

          {isBox && (
            <Grid item xs={12} md={6}>
              <InputBasic
                label="Unidades por Caja"
                placeholder="Escriba un Número de Unidades por Caja"
                // {...register('unidadesPorCaja')}
                error={!!errors.unidadesPorCaja}
                helperText={errors?.unidadesPorCaja?.message}
                inputProps={{
                  type: 'number',
                  pattern: '[0-9]*',
                  inputMode: 'numeric',
                  min: 0,
                  onInput: (e: any) => handleInputBox(e),
                }}
              />
            </Grid>
          )}

          <Grid item xs={12} md={12}>
            <InputBasic
              label="Descripción"
              placeholder="Escriba una Descripción"
              {...register('descripcion')}
              error={!!errors.descripcion}
              helperText={errors?.descripcion?.message}
              multiline
              maxRows={3}
              maxLength={200}
              onChange={handleChangeText}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <InputBasic
              label="Precio de Compra"
              placeholder="Escriba un Precio de Compra"
              {...register('precioCompra')}
              error={!!errors.precioCompra}
              helperText={errors?.precioCompra?.message}
              inputProps={{
                maxLength: 10,
                onInput: (e: any) => handleInputDecimalChange(e),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <InputBasic
              label="Precio de Venta Externo"
              placeholder="Escriba un Precio de Venta Externo"
              {...register('precioVentaExterno')}
              error={!!errors.precioVentaExterno}
              helperText={errors?.precioVentaExterno?.message}
              inputProps={{
                maxLength: 10,
                onInput: (e: any) => handleInputDecimalChange(e),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <InputBasic
              label="Precio de Venta Interno"
              placeholder="Escriba un Precio de Venta Interno"
              {...register('precioVentaInterno')}
              error={!!errors.precioVentaInterno}
              helperText={errors?.precioVentaInterno?.message}
              value={watch('precioVentaInterno')}
              inputProps={{
                maxLength: 10,
                onInput: (e: any) => handleInputDecimalChange(e),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectBasic
              label="Sub Categoria"
              options={subCategories}
              uniqueProperty="id_SubCategoria"
              displayProperty="nombre"
              placeholder="Seleccione una Sub Categoria"
              helperText={errors?.id_subcategoria?.message}
              error={!!errors.id_subcategoria}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputBasic
              label="Código de Barras"
              placeholder="Escriba un Código de Barras"
              {...register('codigoBarras')}
              error={!!errors.codigoBarras}
              helperText={errors?.codigoBarras?.message}
            />
          </Grid>
        </Grid>
      </form>
    </ModalBasic>
  );
};
