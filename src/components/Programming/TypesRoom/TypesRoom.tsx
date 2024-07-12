import {
  Box,
  Button,
  Card,
  CircularProgress,
  Collapse,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent.tsx';
import { SearchBar } from '../../Inputs/SearchBar.tsx';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo.tsx';
import { ITypeRoom } from '../../../types/admissionTypes.ts';
import { useTypesRoomPaginationStore } from '../../../store/programming/typesRoomPagination.ts';
import { useEffect, useState } from 'react';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent.tsx';
import { AddTypeRoomModal } from './Modal/AddTypeRoomModal.tsx';
import { Delete, Edit, ExpandLess, ExpandMore } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { deleteTypeRoom } from '../../../services/programming/typesRoomService.ts';
import { IRecoveryRoomOperatingRoom } from '../../../types/operatingRoomTypes.ts';
const TABLE_HEADERS = ['Nombre', 'Intervalo de limpieza', 'Descripcion', 'Acciones'];
const TABLE_CONFIG_HEADERS = ['Inicio', 'Fin', 'Precio'];

const useGetData = () => {
  const fetchData = useTypesRoomPaginationStore((state) => state.fetchData);
  const data = useTypesRoomPaginationStore((state) => state.data);
  const search = useTypesRoomPaginationStore((state) => state.search);
  const pageSize = useTypesRoomPaginationStore((state) => state.pageSize);
  const pageIndex = useTypesRoomPaginationStore((state) => state.pageIndex);
  const setPageIndex = useTypesRoomPaginationStore((state) => state.setPageIndex);
  const setPageSize = useTypesRoomPaginationStore((state) => state.setPageSize);
  const count = useTypesRoomPaginationStore((state) => state.count);
  const isLoading = useTypesRoomPaginationStore((state) => state.loading);
  const setSearch = useTypesRoomPaginationStore((state) => state.setSearch);

  useEffect(() => {
    fetchData();
  }, [search, pageIndex, pageSize]);

  return {
    data,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    count,
    isLoading,
    setSearch,
  };
};
export const TypesRoom = () => {
  const { setSearch } = useGetData();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Box sx={{ bgcolor: 'background.paper', p: 4, rowGap: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SearchBar searchState={setSearch} title="Buscar tipo de cuarto" sx={{ flex: 2 }} />
          <Button variant="contained" onClick={() => setOpen(true)}>
            Agregar
          </Button>
        </Box>
        <TypesRoomTable />
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <AddTypeRoomModal setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};

const TypesRoomTable = () => {
  const { data, pageIndex, pageSize, setPageIndex, setPageSize, count, isLoading } = useGetData();
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', p: 4, justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={TABLE_HEADERS} />
          {data.length > 0 && (
            <>
              <TableBody>
                {data.map((d) => (
                  <TypesRoomTableRow data={d} key={d.id} />
                ))}
              </TableBody>
              <TableFooterComponent
                count={count}
                pageIndex={pageIndex}
                pageSize={pageSize}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                isLoading={isLoading}
              />
            </>
          )}
        </Table>
      </TableContainer>
      {data.length === 0 && <NoDataInTableInfo infoTitle="No hay tipos de cuarto" />}
    </Card>
  );
};

interface TypesOfRoomTableRowProps {
  data: ITypeRoom;
}

const TypesRoomTableRow = (props: TypesOfRoomTableRowProps) => {
  const { data } = props;
  const refetch = useTypesRoomPaginationStore((state) => state.fetchData);
  const [open, setOpen] = useState(false);
  const [expand, setExpand] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteTypeRoom(data.id);
      toast.success('Tipo de cuarto eliminado correctamente');
      refetch();
    } catch (error) {
      console.log(error);
      toast.error('Error al eliminar el tipo de cuarto');
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <Box>
            <IconButton onClick={() => setExpand(!expand)}>{!expand ? <ExpandMore /> : <ExpandLess />}</IconButton>
            {data.nombre}
          </Box>
        </TableCell>
        <TableCell>{data.configuracionLimpieza}</TableCell>
        <TableCell>{data.descripcion}</TableCell>
        <TableCell>
          <Box>
            <Tooltip title="Editar">
              <IconButton onClick={() => setOpen(true)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton onClick={handleDelete}>
                <Delete color="error" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} sx={{ p: 0 }}>
          <Collapse in={expand}>
            <ConfigRoomTable data={data.configuracionPrecioHora} />
          </Collapse>
        </TableCell>
      </TableRow>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <AddTypeRoomModal setOpen={setOpen} editData={data} />
        </>
      </Modal>
    </>
  );
};

interface ConfigRoomTableProps {
  data?: IRecoveryRoomOperatingRoom[];
}
const ConfigRoomTable = (props: ConfigRoomTableProps) => {
  const { data } = props;
  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: 800 }}>
        <TableContainer>
          <Table>
            <TableHeaderComponent headers={TABLE_CONFIG_HEADERS} />
            <TableBody>
              {data &&
                data.length > 0 &&
                data.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell>{c.inicio}</TableCell>
                    <TableCell>{c.fin ?? 'En adelante'}</TableCell>
                    <TableCell>{c.precio}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {!data ||
            (data.length === 0 && (
              <NoDataInTableInfo infoTitle="No hay configuraciones" sizeIcon={30} variantText="h5" />
            ))}
        </TableContainer>
      </Card>
    </Box>
  );
};
