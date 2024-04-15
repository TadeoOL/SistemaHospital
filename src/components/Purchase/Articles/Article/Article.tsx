import { Box, Button, Divider, Modal, Stack } from '@mui/material';
import { SearchBar } from '../../../Inputs/SearchBar';
import { useState } from 'react';
import { ArticleTable } from './ArticleTable';
import { AddArticleModal } from './Modal/AddArticleModal';
import { useArticlePagination } from '../../../../store/purchaseStore/articlePagination';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
// import { useGetAlmacenes } from '../../../../hooks/useGetAlmacenes';

const Article = () => {
  const [open, setOpen] = useState(false);
  // const [warehouseSelected, setWarehouseSelected] = useState('');
  //const { almacenes, isLoadingAlmacenes } = useGetAlmacenes();
  // const { almacenes } = useGetAlmacenes();
  const { enabled, setEnabled, setSearch } = useArticlePagination((state) => ({
    enabled: state.enabled,
    setEnabled: state.setEnabled,
    setSearch: state.setSearch,
  }));

  return (
    <>
      <Box
        sx={{
          boxShadow: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          overflowX: 'auto',
          bgcolor: 'white',
        }}
      >
        <Box
          sx={{
            minWidth: { xs: 950, xl: 0 },
          }}
        >
          <Stack
            sx={{
              flexDirection: 'row',
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1,
              pt: 3,
            }}
          >
            <SearchBar title="Busca el articulo..." searchState={setSearch} sx={{ width: '30%' }} />
            {/* <TextField
              sx={{ width: 200 }}
              select
              label="Seleciona un almacén"
              size="small"
              value={warehouseSelected}
              onChange={(e) => {
                setWarehouseSelected(e.target.value);
              }}
            >
              {almacenes.map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.nombre}
                </MenuItem>
              ))}
            </TextField> */}
            <Divider sx={{ my: 1 }} />
            <Stack sx={{ flexDirection: 'row', columnGap: 2 }}>
              <Button
                onClick={() => {
                  setEnabled(!enabled);
                }}
                startIcon={<ArticleOutlinedIcon />}
              >
                {enabled ? 'Mostrar artículos deshabilitados' : 'Mostrar artículos habilitados'}
              </Button>
              <Button
                sx={{ height: '75%', mt: '8px', marginRight: '20px' }}
                variant="contained"
                startIcon={<AddCircleOutlinedIcon />}
                onClick={() => setOpen(!open)}
              >
                Agregar
              </Button>
            </Stack>
          </Stack>

          <ArticleTable />
        </Box>
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <AddArticleModal open={setOpen} />
        </>
      </Modal>
    </>
  );
};

export default Article;
