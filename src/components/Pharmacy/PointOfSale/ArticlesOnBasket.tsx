import { AddCircleOutlineRounded, Delete, RemoveCircleOutlineRounded } from '@mui/icons-material';
import { Box, Card, IconButton, Stack, Typography, alpha } from '@mui/material';
import { neutral } from '../../../theme/colors';
import { usePosOrderArticlesStore } from '../../../store/pharmacy/pointOfSale/posOrderArticles';
import { usePosArticlesPaginationStore } from '../../../store/pharmacy/pointOfSale/posArticlesPagination';
import { useShallow } from 'zustand/react/shallow';
import { IArticle2 } from '../../../types/types';

const scrollBar = {
  '&::-webkit-scrollbar': {
    width: '0.5em',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    borderRadius: '10px',
  },
};

interface ResumeSaleProps {
  sx?: any;
}
interface CardItemsProps {
  article: IArticle2;
}
interface AddAndRemoveButtonsProps {
  amount: number;
  id: string;
}

export const ArticlesOnBasket = (props: ResumeSaleProps) => {
  const articlesOnBasket = usePosOrderArticlesStore((state) => state.articlesOnBasket);
  return (
    <Stack sx={{ ...props.sx }}>
      <Typography variant="h3" sx={{ my: 2 }}>
        Orden Actual ({articlesOnBasket.length})
      </Typography>
      <Stack sx={{ overflowY: 'auto', ...scrollBar }}>
        <Stack spacing={2} sx={{ maxHeight: '500px', p: 1.5 }}>
          {articlesOnBasket.map((item) => (
            <CardItems key={item.id_Articulo} article={item} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

const CardItems = (props: CardItemsProps) => {
  const { article } = props;
  const articlesOnBasket = usePosOrderArticlesStore((state) => state.articlesOnBasket);
  const setArticlesOnBasket = usePosOrderArticlesStore((state) => state.setArticlesOnBasket);
  const handleRemoveArticleFromBasket = () => {
    const filterArticles = articlesOnBasket.filter((a) => a.id_Articulo !== article.id_Articulo);
    setArticlesOnBasket(filterArticles);
  };

  return (
    <Card sx={{ position: 'relative', p: 1, bgcolor: alpha(neutral[100], 1), overflow: 'visible' }}>
      <IconButton
        sx={{ position: 'absolute', top: -10, right: -10, zIndex: 100 }}
        onClick={() => handleRemoveArticleFromBasket()}
      >
        <Delete color="error" />
      </IconButton>
      <Stack sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{article.nombre}</Typography>
          {
            // <Typography sx={{ fontSize: 10, fontWeight: 500 }}>{article.fechaCaducidad}</Typography>
          }
        </Box>
        <Typography sx={{ fontSize: 11, fontWeight: 500 }}>Codigo: {article.codigoBarras}</Typography>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 0.5,
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>${article.precioVenta}</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            <b>Cantidad: </b> {article.cantidad}
          </Typography>
          {
            //<AddAndRemoveButtons amount={article.cantidad || 0} id={article.id_Articulo} />
          }
        </Box>
      </Stack>
    </Card>
  );
};

const AddAndRemoveButtons = (props: AddAndRemoveButtonsProps) => {
  const data = usePosArticlesPaginationStore((state) => state.data);
  const setArticlesOnBasket = usePosOrderArticlesStore((state) => state.setArticlesOnBasket);
  const articlesOnBasket = usePosOrderArticlesStore(useShallow((state) => state.articlesOnBasket));
  const findIndex = articlesOnBasket.findIndex((article) => article.id_Articulo === props.id);
  const maxAmountArticle = data.find((article) => article.id_Articulo === props.id)?.cantidad || 0;

  const handleAddAmount = () => {
    if (props.amount === maxAmountArticle) return;
    if (findIndex !== -1) {
      const updatedArticlesOnBasket = [...articlesOnBasket];
      updatedArticlesOnBasket[findIndex].cantidad = (updatedArticlesOnBasket[findIndex]?.cantidad || 0) + 1;
      setArticlesOnBasket(updatedArticlesOnBasket);
    }
  };

  const handleRemoveAmount = () => {
    if (props.amount === 1) return;
    if (findIndex !== -1) {
      const updatedArticlesOnBasket = [...articlesOnBasket];
      updatedArticlesOnBasket[findIndex].cantidad = (updatedArticlesOnBasket[findIndex]?.cantidad || 0) - 1;
      setArticlesOnBasket(updatedArticlesOnBasket);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 0.5 }}>
      <IconButton onClick={() => handleRemoveAmount()}>
        <RemoveCircleOutlineRounded />
      </IconButton>
      {props.amount}
      <IconButton sx={{ color: '#046DBD' }} onClick={() => handleAddAmount()}>
        <AddCircleOutlineRounded />
      </IconButton>
    </Box>
  );
};
