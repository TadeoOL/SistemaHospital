import { Box, Button, Checkbox, Stack, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { useEffect, useRef, useState } from 'react';
import { IPurchaseOrderArticle } from '../../../../../types/types';
import { toast } from 'react-toastify';

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
type ArticleData = {
  id: string;
  nombre: string;
  codigoBarras?: string;
  fechaCaducidad: string | null;
};
interface AddArticleExpireDateProps {
  setOpen: Function;
  articleData: ArticleData;
  articlesInOrder: IPurchaseOrderArticle[];
  setArticlesInOrder: Function;
}
export const AddArticleExpireDate = (props: AddArticleExpireDateProps) => {
  const { articleData } = props;
  const expireDateRef = useRef<InputFieldRef>();
  const barCodeRef = useRef<InputFieldRef>();
  const [expireDateError, setExpireDateError] = useState(false);
  const [barCodeError, setBarCodeError] = useState(false);
  const [expireDate, setExpireDate] = useState(false);

  useEffect(() => {
    if (barCodeRef.current && articleData.codigoBarras) {
      barCodeRef.current.value = articleData.codigoBarras;
    }
    if (expireDateRef.current && articleData.fechaCaducidad) {
      expireDateRef.current.value = hasExpireDate(articleData.fechaCaducidad);
    }
  }, [articleData]);

  function hasExpireDate(date: string) {
    if (date === '4000-01-01') {
      setExpireDate(true);
      return '';
    }
    return date;
  }

  const handleSubmit = () => {
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

    const barCodeValue = barCodeRef.current.value;
    const expireDateValue = !expireDate ? expireDateRef?.current?.value : '4000-01-01';
    const updatedArticlesInOrder = props.articlesInOrder.map((article) => {
      if (article.id_Articulo === articleData.id) {
        return { ...article, codigoBarras: barCodeValue, fechaCaducidad: expireDateValue };
      }
      return article;
    });

    props.setArticlesInOrder(updatedArticlesInOrder);
    toast.success('Entrada agregada con éxito!');
    props.setOpen(false);
  };

  return (
    <Box sx={style}>
      <HeaderModal title="Entrada de articulo" setOpen={() => props.setOpen()} />
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
            <Typography>No tiene fecha de caducidad</Typography>
            <Checkbox
              checked={expireDate}
              onChange={() => {
                setExpireDate(!expireDate);
                setExpireDateError(false);
              }}
            />
          </Box>
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
