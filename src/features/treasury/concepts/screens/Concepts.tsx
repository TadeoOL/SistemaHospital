import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import { useRef, useState } from 'react';
import { TablePaginated } from '@/common/components/TablePaginated';
import { SearchBar } from '@/components/Inputs/SearchBar';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { TableTop } from '@/common/components/TableTop';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { Typography } from '@mui/material';
import { MainCard } from '@/common/components';
import { useDisableConcept } from '../hooks/useDisableConcept';
import { getConcepts } from '../services/concepts';
import { ConceptModal } from '../components/ConceptModal';

const Concepts = () => {
  const [selectedId, setSelectedId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [enabled, setEnabled] = useState(true);

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedId('');
  };

  const tableRef = useRef<any>();
  const onSuccess = () => tableRef?.current?.fetchData();
  const disableConcept = useDisableConcept(onSuccess);

  const handleAdd = () => {
    setSelectedId('');
    setModalOpen(true);
  };

  const handleEdit = (row: any) => {
    setSelectedId('');
    setSelectedId(row.id);
    setModalOpen(true);
  };

  const columns: any[] = [
    {
      header: 'Nombre',
      value: 'nombre',
      sort: true,
      width: 'auto',
    },
    {
      header: 'Descripcion',
      value: 'descripcion',
    },
    {
      header: 'Acciones',
      value: (row: any) => (
        <>
          <Tooltip title="Editar">
            <IconButton size="small" sx={{ color: 'neutral.700' }} onClick={() => handleEdit(row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={row.habilitado ? 'Deshabilitar' : 'Habilitar'}>
            <IconButton size="small" onClick={() => disableConcept(row.habilitado, row.id)}>
              {row.habilitado ? <RemoveCircleIcon sx={{ color: 'red' }} /> : <CheckIcon sx={{ color: 'green' }} />}
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <MainCard content={false}>
        <TableTop>
          <SearchBar title="Busca el articulo..." searchState={setSearch} sx={{ width: '30%' }} />
          <Grid>
            <Button
              sx={{
                height: '40px',
                mx: 1,
              }}
              onClick={() => {
                setEnabled(!enabled);
              }}
              variant="outlined"
              startIcon={<ArticleOutlinedIcon />}
            >
              {enabled ? 'Mostrar deshabilitados' : 'Mostrar habilitados'}
            </Button>
            <Button
              sx={{ height: '40px' }}
              variant="contained"
              startIcon={<AddCircleOutlinedIcon />}
              onClick={handleAdd}
            >
              <Typography variant="button">Agregar</Typography>
            </Button>
          </Grid>
        </TableTop>

        <TablePaginated
          ref={tableRef}
          columns={columns}
          fetchData={getConcepts}
          params={{
            search,
          }}
        />
      </MainCard>
      <ConceptModal open={modalOpen} itemId={selectedId} onClose={handleModalClose} onSuccess={onSuccess} />
    </>
  );
};

export default Concepts;
