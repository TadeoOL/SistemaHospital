import { Box, Card, Divider, Stack, TextField } from '@mui/material';
import { Categories } from './Categories';
import { ArticlesOnBasket } from './ArticlesOnBasket';
import { ArticlesToSale } from './ArticlesToSale';
import { usePosArticlesPaginationStore } from '../../../store/pharmacy/pointOfSale/posArticlesPagination';
import { useEffect, useState } from 'react';
import { Search } from '@mui/icons-material';
import { usePosOrderArticlesStore } from '../../../store/pharmacy/pointOfSale/posOrderArticles';
import { toast } from 'react-toastify';
import { ResumeSale } from './ResumeSale';
import { neutral } from '../../../theme/colors';

export const PointOfSale = () => {
  const setSearch = usePosArticlesPaginationStore((state) => state.setSearch);

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Card sx={{ display: 'flex', flex: 1, minWidth: 700 }}>
        <Stack sx={{ display: 'flex', flex: 5, bgcolor: neutral[50] }}>
          <Categories sx={{ display: 'flex', columnGap: 1.5, p: 2 }} />
          <SearchBar title="Buscar el articulo..." searchState={setSearch} sx={{ bgcolor: 'transparent' }} />
          <ArticlesToSale sx={{ p: 2 }} />
        </Stack>
        <Divider orientation="vertical" sx={{ m: 1 }} flexItem />
        <Stack>
          <ArticlesOnBasket
            sx={{
              display: 'flex',
              flex: 3,
              px: 2,
              pb: 2,
              bgcolor: 'background.paper',
              minWidth: 250,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          />
          <ResumeSale />
        </Stack>
      </Card>
    </Box>
  );
};

interface ISearchBar {
  searchState: Function;
  title: string;
  size?: 'small' | 'medium';
  sx?: any;
}
const SearchBar = (props: ISearchBar) => {
  const data = usePosArticlesPaginationStore((state) => state.data);
  const articlesOnBasket = usePosOrderArticlesStore((state) => state.articlesOnBasket);
  const { title, searchState, size, sx } = props;
  const [text, setText] = useState('');
  const setArticlesOnBasket = usePosOrderArticlesStore((state) => state.setArticlesOnBasket);
  const handleChange = (event: any) => {
    setText(event.currentTarget.value);
    event.preventDefault();
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      const codigoBarra = event.target.value;
      setText('');
      event.target.value = '';
      if (articlesOnBasket.some((article) => article.codigoBarras === codigoBarra)) return;
      const article = data
        .map((article) => {
          return { ...article, cantidad: 1 };
        })
        .filter((article) => article.codigoBarras === codigoBarra);
      console.log({ data });
      console.log({ codigoBarra });
      console.log({ article });
      if (article.length === 0 || !article) return toast.error('No existe el articulo en la base de datos!');
      setArticlesOnBasket([...articlesOnBasket, ...article]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchState(text);
    }, 50);

    return () => clearTimeout(timer);
  }, [text]);

  return (
    <Box sx={{ px: 2, ...sx }}>
      <TextField
        fullWidth
        size={size ? size : 'medium'}
        placeholder={title}
        onChange={(e) => handleChange(e)}
        onKeyDown={handleKeyDown}
        value={text}
        InputProps={{
          startAdornment: <Search />,
          style: { backgroundColor: 'white' },
        }}
        sx={{ maxWidth: 500 }}
      />
    </Box>
  );
};
