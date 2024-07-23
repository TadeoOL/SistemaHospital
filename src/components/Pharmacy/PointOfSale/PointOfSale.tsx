import { Box, Card, Divider, Stack, TextField } from '@mui/material';
import { Categories } from './Categories';
import { ArticlesOnBasket } from './ArticlesOnBasket';
import { ArticlesToSale } from './ArticlesToSale';
import { usePosArticlesPaginationStore } from '../../../store/pharmacy/pointOfSale/posArticlesPagination';
import { useEffect, useState } from 'react';
import { Search } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { ResumeSale } from './ResumeSale';
import { neutral } from '../../../theme/colors';
import { IArticle2 } from '../../../types/types';

export const PointOfSale = () => {
  const setSearch = usePosArticlesPaginationStore((state) => state.setSearch);
  const [openModal, setOpenLoteModal] = useState(false);
  const [articleSelected, setArticleSelected] = useState<null | IArticle2>(null);

  useEffect(() => {
    return () => usePosArticlesPaginationStore.setState({ search: '', data: [], pageIndex: 1, subCategoryId: '' });
  }, []);

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Card sx={{ display: 'flex', flex: 1, minWidth: 700 }}>
        <Stack sx={{ display: 'flex', flex: 5, bgcolor: neutral[50] }}>
          <Categories sx={{ display: 'flex', columnGap: 1.5, p: 2 }} />
          <SearchBar
            title="Buscar el articulo..."
            searchState={setSearch}
            sx={{ bgcolor: 'transparent' }}
            setOpenLoteModal={setOpenLoteModal}
            setArticleSelected={setArticleSelected}
          />
          <ArticlesToSale
            sx={{ p: 2 }}
            articleSelectedByBarCode={articleSelected as IArticle2}
            openModal={openModal}
            setOpenLoteModal={setOpenLoteModal}
          />
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
  setOpenLoteModal: Function;
  setArticleSelected: Function;
}
const SearchBar = (props: ISearchBar) => {
  const data = usePosArticlesPaginationStore((state) => state.data);
  const { title, searchState, size, sx } = props;
  const [text, setText] = useState('');
  const handleChange = (event: any) => {
    setText(event.currentTarget.value);
    event.preventDefault();
  };

  const handleKeyDown = (event: any) => {
    const codigoBarra = event.target.value;
    if (event.key === 'Enter' && codigoBarra !== '') {
      setText('');
      event.target.value = '';
      const article = data
        .map((article) => {
          return article;
        })
        .filter((article) => article.codigoBarras === codigoBarra);
      if (article[0]) {
        props.setArticleSelected(article[0]);
        props.setOpenLoteModal(true);
      }

      console.log({ data });
      console.log({ codigoBarra });
      console.log({ article });
      //props.setOpenLoteModal(false);
      if (article.length === 0 || !article) return toast.error('No existe el articulo en la base de datos!');
      //setArticlesOnBasket([...articlesOnBasket, ...article]);
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
