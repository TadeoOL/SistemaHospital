import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { IPurchaseOrderArticle } from '../../../../../types/types';

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

type ArticleData = {
  id: string;
  nombre: string;
  codigoBarras?: string;
  fechaCaducidad: string | null;
  cantidad?: string;
};
type ReturnArticle = {
  Id_OrdenCompraArticulo: string;
  Motivo: string;
  CantidadDevuelta: string;
};
interface ReturnArticleProps {
  setOpen: Function;
  article: ArticleData;
  articles: IPurchaseOrderArticle[];
  setArticles: Function;
  returnArticlesArray: ReturnArticle[];
  setReturnArticlesArray: Function;
}
export const ReturnArticle = (props: ReturnArticleProps) => {
  const { setReturnArticlesArray, returnArticlesArray, article, articles, setArticles } = props;
  const amountRef = useRef<HTMLTextAreaElement>();
  const reasonRef = useRef<HTMLTextAreaElement>();

  useEffect(() => {
    const findArticle = returnArticlesArray.find((a) => a.Id_OrdenCompraArticulo === article.id);
    if (findArticle) {
      if (!amountRef.current || !reasonRef.current) return;
      amountRef.current.value = findArticle.CantidadDevuelta;
      reasonRef.current.value = findArticle.Motivo;
    }
  }, []);

  function handleSubmit() {
    if (
      !amountRef.current ||
      !reasonRef.current ||
      amountRef.current.value === '' ||
      amountRef.current.value === '0' ||
      reasonRef.current.value === ''
    )
      return toast.error('Rellena todos los valores para continuar!');
    if (isNaN(parseInt(amountRef.current.value)) || amountRef.current.value.includes('.'))
      return toast.error('Ingresa una cantidad valida!');
    if (parseInt(amountRef.current.value) > parseInt(article.cantidad as string))
      return toast.error('No puedes devolver mas artículos de los que están disponibles!');
    const foundIndex = returnArticlesArray.findIndex((a) => a.Id_OrdenCompraArticulo === article.id);
    const foundIndexArticles = articles.findIndex((a) => a.id_OrdenCompraArticulo === article.id);

    if (foundIndexArticles !== -1) {
      const updatedReturnArticlesArray = [...articles];
      const restAmount = parseInt(article.cantidad as string) - parseInt(amountRef.current.value);
      updatedReturnArticlesArray[foundIndexArticles].cantidad = restAmount < 0 ? 0 : restAmount;
      setArticles(updatedReturnArticlesArray);
    }

    if (foundIndex !== -1) {
      const updatedReturnArticlesArray = [...returnArticlesArray];
      updatedReturnArticlesArray[foundIndex].Motivo = reasonRef.current.value;
      updatedReturnArticlesArray[foundIndex].CantidadDevuelta = amountRef.current.value;
      updatedReturnArticlesArray[foundIndex].Id_OrdenCompraArticulo = article.id;
      setReturnArticlesArray(updatedReturnArticlesArray);
      toast.success('Producto en devolución modificado con éxito!');
      return props.setOpen(false);
    } else {
      const newReturnArticle = {
        Id_OrdenCompraArticulo: article.id,
        Motivo: reasonRef.current.value,
        CantidadDevuelta: amountRef.current.value,
      };
      setReturnArticlesArray([...returnArticlesArray, newReturnArticle]);
      toast.success('Producto agregado a devolución con éxito!');
      return props.setOpen(false);
    }
  }

  return (
    <Box sx={style}>
      <HeaderModal
        title="Devolución de artículos"
        setOpen={() => {
          props.setOpen();
        }}
      />
      <Stack spacing={3} sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2">
            <strong> Producto a devolver: </strong> {props.article.nombre}
          </Typography>
          <Typography variant="subtitle2">
            <strong> Cantidad disponible para devolver: </strong>
            {props.article.cantidad}
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="subtitle2">Cantidad a devolver</Typography>
          <TextField inputRef={amountRef} placeholder="Cantidad..." />
        </Stack>
        <Stack>
          <Typography variant="subtitle2">Motivo de devolución</Typography>
          <TextField inputRef={reasonRef} multiline placeholder="Motivo..." />
        </Stack>
      </Stack>
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', p: 1, bgcolor: 'background.paper' }}>
        <Button variant="outlined" color="error" onClick={() => props.setOpen(false)}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={() => handleSubmit()}>
          Aceptar
        </Button>
      </Box>
    </Box>
  );
};
