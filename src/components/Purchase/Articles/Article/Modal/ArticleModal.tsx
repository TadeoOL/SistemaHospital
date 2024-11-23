import { Button, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addArticle } from '../../../../../schema/schemas';
import { IArticle } from '../../../../../types/types';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useGetSubCategories } from '../../../../../hooks/useGetSubCategories';
import { addNewArticle } from '../../../../../api/api.routes';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
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
  const config = useGetPurchaseConfig();

  const [isBox, setIsBox] = useState(false);

  const { isLoadingArticle, article } = useFetchArticle(itemId);

  const defaultValues = {
    id: '',
    subCategoria: '',
    nombre: '',
    descripcion: '',
    presentacion: '',
    id_subcategoria: '',
    unidadMedida: '',
    precioCompra: '',
    precioVentaExterno: '',
    precioVentaInterno: '',
    codigoBarras: '',
    codigoSAT: '',
    codigoUnidadMedida: 0,
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
    try {
      data.esCaja = isBox;
      const res = await addNewArticle(data);
      console.log('res:', res);
      onSuccess();
      onClose();
      toast.success('Articulo creado con éxito!');
    } catch (error) {
      toast.error('Error al crear el articulo!');
    }
  };

  const validateDecimal = (event: any) => {
    const precioCompra = event.target.value;
    const isValidInput = /^\d*\.?\d*$/.test(precioCompra);
    if (!isValidInput) {
      event.target.value = precioCompra.slice(0, -1);
    }
  };

  const [multVentaExterno, setMultVentaExterno] = useState(1);
  const [multVentaInterno, setMultVentaInterno] = useState(1);

  const getPrices = () => {
    const precioCompra = Number(watch('precioCompra'));
    const unidadesPorCaja = Number(watch('unidadesPorCaja'));
    console.log('unidadesPorCaja:', unidadesPorCaja);

    if (!precioCompra) return;
    if (isBox && !unidadesPorCaja) return;

    const unidades = isBox ? unidadesPorCaja : 1;

    const isFactorInRange = (factor: any) => {
      const isGreaterThanMin = Number(factor.cantidadMinima) <= precioCompra;

      if (!factor.cantidadMaxima) return isGreaterThanMin;

      const isLessThanMax = precioCompra <= Number(factor.cantidadMaxima);
      const isBetween = isGreaterThanMin && isLessThanMax;

      return isBetween;
    };

    const rangoVentaExterno = config?.factorExterno?.find(isFactorInRange);
    const multiplicadorVentaExterno = Number(rangoVentaExterno?.factorMultiplicador) || 1;

    const rangoVentaInterno = config?.factorInterno?.find(isFactorInRange);
    const multiplicadorVentaInterno = Number(rangoVentaInterno?.factorMultiplicador) || 1;

    const precioVentaExterno = (precioCompra * multiplicadorVentaExterno) / unidades;
    const precioVentaInterno = (precioCompra * multiplicadorVentaInterno) / unidades;

    setMultVentaExterno(multiplicadorVentaExterno);
    setMultVentaInterno(multiplicadorVentaInterno);

    setValue('precioVentaExterno', precioVentaExterno.toString());
    setValue('precioVentaInterno', precioVentaInterno.toString());
  };

  useEffect(() => {
    getPrices();
  }, [watch('precioCompra'), watch('unidadesPorCaja'), isBox]);

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
      isLoading={isLoading || (!!itemId && isLoadingArticle)}
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
                {...register('unidadesPorCaja')}
                error={!!errors.unidadesPorCaja}
                helperText={errors?.unidadesPorCaja?.message}
                inputProps={{
                  type: 'number',
                  pattern: '[0-9]*',
                  inputMode: 'numeric',
                  min: 0,
                  onInput: validateDecimal,
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
                onInput: (e: any) => validateDecimal(e),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <InputBasic
              label={`Precio de Venta Externo (x${multVentaExterno})`}
              placeholder="Escriba un Precio de Venta Externo"
              {...register('precioVentaExterno')}
              error={!!errors.precioVentaExterno}
              helperText={errors?.precioVentaExterno?.message}
              inputProps={{
                maxLength: 10,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <InputBasic
              label={`Precio de Venta Interno (x${multVentaInterno})`}
              placeholder="Escriba un Precio de Venta Interno"
              {...register('precioVentaInterno')}
              error={!!errors.precioVentaInterno}
              helperText={errors?.precioVentaInterno?.message}
              value={watch('precioVentaInterno')}
              inputProps={{
                maxLength: 10,
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
              {...register('id_subcategoria')}
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
