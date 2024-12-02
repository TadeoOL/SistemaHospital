import { Box, Button, Checkbox, Stack, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { isValidInteger } from '../../../../../utils/functions/dataUtils';
import { IPurchaseOrderArticle } from '@/types/purchase/purchaseTypes';

const style = {
  width: { xs: 380 },
  position: 'absolute',
  top: '50%',
  left: '50%',
  display: 'flex',
  flexDirection: 'column',
  transform: 'translate(-50%, -50%)',
  boxShadow: 24,
  overflowY: 'auto',
};

interface InputFieldRef {
  value: string;
}
type ArticlesToBox = {
  id: string;
  amount: string;
};
type ReturnArticle = {
  Id_OrdenCompraArticulo: string;
  Motivo: string;
  CantidadDevuelta: string;
};
type ArticleData = {
  id: string;
  nombre: string;
  codigoBarras?: string;
  fechaCaducidad?: string;
};
interface AddArticleExpireDateProps {
  setOpen: Function;
  articleData: ArticleData;
  articlesInOrder: IPurchaseOrderArticle[];
  setArticlesInOrder: Function;
  articlesToBox: ArticlesToBox[];
  setArticlesToBox: Function;
  originalArticles: IPurchaseOrderArticle[];
  returnArticlesArray: ReturnArticle[];
  setReturnArticlesArray: Function;
}
export const AddArticleExpireDate = (props: AddArticleExpireDateProps) => {
  const { articleData } = props;
  const expireDateRef = useRef<InputFieldRef>();
  const barCodeRef = useRef<InputFieldRef>();
  const boxAmountRef = useRef<InputFieldRef>();
  const [expireDateError, setExpireDateError] = useState(false);
  const [barCodeError, setBarCodeError] = useState(false);
  const [boxAmountError, setBoxAmountError] = useState(false);
  const [expireDate, setExpireDate] = useState(false);
  const [isBox, setIsBox] = useState(false);
  const isInArticlesToBox = props.articlesToBox.find((a) => a.id === articleData.id);

  useEffect(() => {
    if (barCodeRef.current && articleData.codigoBarras) {
      barCodeRef.current.value = articleData.codigoBarras;
    }
    if (expireDateRef.current && articleData.fechaCaducidad) {
      expireDateRef.current.value = hasExpireDate(articleData.fechaCaducidad);
    }
  }, [articleData]);

  useEffect(() => {
    if (isInArticlesToBox) {
      if (!boxAmountRef.current) return;
      boxAmountRef.current.value = isInArticlesToBox.amount;
      return setIsBox(true);
    }
    return setIsBox(false);
  }, []);

  function hasExpireDate(date: string) {
    if (date === '4000-01-01') {
      setExpireDate(true);
      return '';
    }
    return date;
  }

  // function handleChangeIsBox() {
  //   const newArticlesToBox = props.articlesToBox.filter((a) => a.id !== articleData.id);
  //   const originalArticle = props.originalArticles.find((a) => a.id_Articulo === articleData.id);
  //   const findIndex = props.articlesInOrder.findIndex((a) => a.id_Articulo === originalArticle?.id_Articulo);
  //   const filterArticles = props.returnArticlesArray.filter(
  //     (a) => a.Id_OrdenCompraArticulo !== originalArticle?.id_OrdenCompraArticulo
  //   );
  //   props.setReturnArticlesArray(filterArticles);
  //   const findIndexArticleInOrder = props.articlesInOrder.findIndex(
  //     (a) => a.id_Articulo === originalArticle?.id_Articulo
  //   );
  //   if (findIndexArticleInOrder !== -1) {
  //     const updatedArticlesInOrder = [...props.articlesInOrder];
  //     updatedArticlesInOrder[findIndexArticleInOrder] = originalArticle as IPurchaseOrderArticle;
  //     props.setArticlesInOrder(updatedArticlesInOrder);
  //   }
  //   if (isBox) {
  //     if (findIndex !== -1) {
  //       const updatedArrayArticles = [...props.articlesInOrder];
  //       updatedArrayArticles[findIndex].cantidad = originalArticle?.cantidad as number;
  //       props.setArticlesInOrder(updatedArrayArticles);
  //     }
  //     props.setArticlesToBox(newArticlesToBox);
  //     return setIsBox(false);
  //   } else {
  //     setIsBox(true);
  //   }
  // }

  const handleSubmit = () => {
    if (
      (isBox && (!boxAmountRef.current || boxAmountRef.current.value === '')) ||
      (boxAmountRef.current && !isValidInteger(boxAmountRef.current.value))
    ) {
      setBoxAmountError(true);
      toast.error('Ingresa una cantidad de cajas valida!');
      return;
    }
    if (!barCodeRef.current || barCodeRef.current.value === '') {
      setBarCodeError(true);
      toast.error('Debes llenar todos los datos!');
      return;
    }

    if (!expireDate && (!expireDateRef.current || expireDateRef.current.value === '')) {
      setExpireDateError(true);
      toast.error('Debes llenar todos los datos!');
      return;
    }

    if (isBox) {
      props.setArticlesToBox((prev: ArticlesToBox[]) => {
        const foundArticle = prev.findIndex((a) => a.id === articleData.id);
        if (foundArticle !== -1) {
          const updatedArticlesToBox = [...props.articlesToBox];
          updatedArticlesToBox[foundArticle].amount = boxAmountRef?.current?.value as string;
          return updatedArticlesToBox;
        } else {
          return [...prev, { id: articleData.id, amount: boxAmountRef?.current?.value }];
        }
      });
    }
    const barCodeValue = barCodeRef.current.value;
    const expireDateValue = !expireDate ? expireDateRef?.current?.value : '4000-01-01';
    const updatedArticlesInOrder = props.articlesInOrder.map((article) => {
      if (article.id_Articulo === articleData.id) {
        return {
          ...article,
          codigoBarras: barCodeValue,
          fechaCaducidad: expireDateValue,
          cantidad: isBox ? parseInt(boxAmountRef?.current?.value as string) * article.cantidad : article.cantidad,
        };
      }
      return article;
    });

    props.setArticlesInOrder(updatedArticlesInOrder);
    toast.success('Entrada agregada con éxito!');
    props.setOpen(false);
  };

  return (
    <Box sx={style}>
      <HeaderModal title="Entrada de articulo" setOpen={props.setOpen} />
      <Stack
        spacing={6}
        sx={{ bgcolor: 'background.paper', p: 2, borderBottomLeftRadius: 12, WebkitBorderBottomRightRadius: 12 }}
      >
        <Stack spacing={2}>
          <Typography variant="subtitle2">Nombre del articulo: {articleData.nombre}</Typography>
          <Stack>
            <Typography variant="subtitle2">Código de barras</Typography>
            <TextField
              inputRef={barCodeRef}
              placeholder="Escribe un código de barras..."
              error={barCodeError}
              helperText={!!barCodeError && 'Escribe un código de barras'}
            />
          </Stack>
          <Stack>
            <Typography variant="subtitle2">Fecha de caducidad</Typography>
            <TextField
              inputRef={expireDateRef}
              type="date"
              disabled={expireDate}
              placeholder="Escribe una fecha de caducidad..."
              error={expireDateError}
              helperText={!!expireDateError && 'Selecciona una fecha de caducidad'}
            />
          </Stack>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', columnGap: 1 }}>
            <Typography sx={{ display: 'flex', flex: 2 }}>No tiene fecha de caducidad</Typography>
            <Box sx={{ display: 'flex', flex: 1 }}>
              <Checkbox
                checked={expireDate}
                onChange={() => {
                  setExpireDate(!expireDate);
                  setExpireDateError(false);
                }}
              />
            </Box>
          </Box>
          {/* <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', columnGap: 1 }}>
            <Typography sx={{ display: 'flex', flex: 2 }}>Conversion de Presentación a Unidades</Typography>
            <Box sx={{ display: 'flex', flex: 1 }}>
              <Checkbox
                checked={isBox}
                onChange={() => {
                  handleChangeIsBox();
                }}
              />
            </Box>
          </Box> */}
          {isBox && (
            <Stack>
              <TextField
                inputRef={boxAmountRef}
                placeholder="Escribe la conversión de unidades..."
                error={boxAmountError}
                disabled={!isBox}
                helperText={!!boxAmountError && 'Escribe la cantidad de unidades por presentación'}
              />
            </Stack>
          )}
        </Stack>
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
          <Button variant="outlined" color="error" onClick={() => props.setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={() => handleSubmit()}>
            Aceptar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
