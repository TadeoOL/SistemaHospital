import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { useProgrammingRegisterStore } from '../../../store/programming/programmingRegister';
import { usePackagePaginationStore } from '../../../store/warehouseStore/packagesPagination';
import { ChangeEvent, useEffect, useState } from 'react';
import { getPharmacyConfig } from '../../../services/pharmacy/configService';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { Delete, Edit, Save } from '@mui/icons-material';
import { useExistingArticlePagination } from '../../../store/warehouseStore/existingArticlePagination';
import { isValidInteger } from '../../../utils/functions/dataUtils';
import { toast } from 'react-toastify';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { IExistingArticle } from '../../../types/types';
const TABLE_HEADER = ['Nombre', 'Cantidad', 'Acciones'];
interface MedicinePackageSelectorProps {
  setOpen: Function;
}

const useGetPackageData = () => {
  const fetchData = usePackagePaginationStore((state) => state.fetchWarehousePackages);
  const data = usePackagePaginationStore((state) => state.data);
  const search = usePackagePaginationStore((state) => state.search);
  const pageSize = usePackagePaginationStore((state) => state.pageSize);
  const pageIndex = usePackagePaginationStore((state) => state.pageIndex);
  const setPageIndex = usePackagePaginationStore((state) => state.setPageIndex);
  const setPageSize = usePackagePaginationStore((state) => state.setPageSize);
  const count = usePackagePaginationStore((state) => state.count);
  const isLoading = usePackagePaginationStore((state) => state.isLoading);
  const setSearch = usePackagePaginationStore((state) => state.setSearch);
  const clearData = usePackagePaginationStore((state) => state.clearData);

  useEffect(() => {
    fetchData();
  }, [search, pageIndex, pageSize]);
  return {
    data,
    search,
    pageSize,
    pageIndex,
    setPageIndex,
    setPageSize,
    count,
    isLoading,
    setSearch,
    clearData,
  };
};

const useGetArticles = (warehouseId: string) => {
  const fetchData = useExistingArticlePagination((state) => state.fetchExistingArticles);
  const data = useExistingArticlePagination((state) => state.data);
  const search = useExistingArticlePagination((state) => state.search);
  const pageSize = useExistingArticlePagination((state) => state.pageSize);
  const pageIndex = useExistingArticlePagination((state) => state.pageIndex);
  const setPageIndex = useExistingArticlePagination((state) => state.setPageIndex);
  const setPageSize = useExistingArticlePagination((state) => state.setPageSize);
  const setWarehouseId = useExistingArticlePagination((state) => state.setWarehouseId);
  const setPrincipalWarehouseId = useExistingArticlePagination((state) => state.setPrincipalWarehouseId);
  const isLoading = useExistingArticlePagination((state) => state.isLoading);
  const setSearch = useExistingArticlePagination((state) => state.setSearch);

  useEffect(() => {
    setPrincipalWarehouseId(warehouseId);
    setWarehouseId(warehouseId);
    fetchData();
  }, [search, pageIndex, pageSize, warehouseId]);

  return {
    data,
    search,
    pageSize,
    pageIndex,
    setPageIndex,
    setPageSize,
    isLoading,
    setSearch,
  };
};

const useGetPrincipalWarehouseId = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [principalWarehouseId, setPrincipalWarehouseId] = useState('');

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const res = await getPharmacyConfig();
        setPrincipalWarehouseId(res.id_Almacen);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return { isLoading, principalWarehouseId };
};

export const MedicinePackageSelectorModal = (props: MedicinePackageSelectorProps) => {
  const { data: packageData, isLoading: isLoadingPackages, setSearch, clearData } = useGetPackageData();
  const { principalWarehouseId, isLoading } = useGetPrincipalWarehouseId();
  const {
    data: articlesRes,
    isLoading: isLoadingArticles,
    setSearch: setSearchArticle,
  } = useGetArticles(principalWarehouseId);
  const [articles, setArticles] = useState(articlesRes);
  const step = useProgrammingRegisterStore((state) => state.step);
  const setStep = useProgrammingRegisterStore((state) => state.setStep);
  const articlesSelected = useProgrammingRegisterStore((state) => state.articlesSelected);
  const setArticlesSelected = useProgrammingRegisterStore((state) => state.setArticlesSelected);
  const [articleSelected, setArticleSelected] = useState<{ id: string; nombre: string; cantidad: number } | null>();
  const [articleAmount, setArticleAmount] = useState('0');
  let articlesList = articles
    .filter((a) => a.stockActual > 0)
    .filter((a) => !articlesSelected.some((as) => as.id === a.id_Articulo));

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const num = e.target.value;
    if (!isValidInteger(num)) return toast.warning('Escribe un número valido!');
    setArticleAmount(num);
  };

  const handleAddArticle = () => {
    if (!articleSelected) return toast.warning('Selecciona un artículo');
    if (parseInt(articleAmount) === 0) return toast.warning('Agrega una cantidad!');
    const { id, nombre, cantidad } = articleSelected;
    if (parseInt(articleAmount) > cantidad) return toast.warning('No hay suficiente stock!');
    if (cantidad === 0) return toast.warning('El artículo seleccionado no tiene existencias');
    if (articlesSelected.find((article) => article.id === id)) {
      return toast.warning('El artículo seleccionado ya se encuentra en la lista');
    }
    setArticlesSelected([...articlesSelected, { ...articleSelected, cantidad: parseInt(articleAmount) }]);
    setArticleSelected(undefined);
    setArticleAmount('0');
  };

  useEffect(() => {
    () => clearData();
  }, []);
  return (
    <>
      <HeaderModal setOpen={props.setOpen} title="Paquete de medicinas" />
      <Box sx={{ backgroundColor: 'background.paper', p: 1 }}>
        <Typography>Selección de paquete:</Typography>
        <Autocomplete
          disablePortal
          fullWidth
          // filterOptions={filterPackageOptions}
          loading={isLoadingPackages}
          getOptionLabel={(option) => option.nombre}
          options={packageData ?? []}
          sx={{ width: { xs: 350, sm: 400 } }}
          noOptionsText="No se encontraron paquetes"
          renderInput={(params) => (
            <TextField {...params} placeholder="Paquetes de artículos" onChange={(e) => setSearch(e.target.value)} />
          )}
        />
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
            <Typography>Selección de artículos:</Typography>
            <Autocomplete
              disablePortal
              fullWidth
              // filterOptions={filterArticleOptions}
              onChange={(_, val) => {
                if (val) {
                  setArticleSelected({
                    id: val.id_Articulo as string,
                    cantidad: val.stockActual as number,
                    nombre: val.nombre as string,
                  });
                }
              }}
              loading={isLoadingArticles}
              getOptionLabel={(option) => option.nombre}
              options={articlesList ?? []}
              onInputChange={(_, __, reason) => {
                if (reason === 'clear') {
                  setArticleSelected(undefined);
                }
              }}
              value={articlesRes.find((a) => a.id_Articulo === articleSelected?.id) ?? null}
              isOptionEqualToValue={(option, value) => option.id_Articulo === value.id_Articulo}
              noOptionsText="No se encontraron artículos"
              sx={{ width: { xs: 350, sm: 400 } }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  // error={articleError}
                  // helperText={articleError && 'Selecciona un articulo'}
                  value={articleSelected?.nombre ?? ''}
                  onChange={(e) => {
                    setSearchArticle(e.target.value);
                  }}
                  placeholder="Artículos"
                />
              )}
            />
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: { xs: 'center' },
              flexDirection: { xs: 'row', sm: 'row' },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography>Cantidad:</Typography>
              <TextField
                label="Cantidad"
                helperText={`Cantidad disponible: ${articleSelected?.cantidad ?? 0}`}
                FormHelperTextProps={{
                  sx: {
                    fontSize: 11,
                    margin: 0,
                  },
                }}
                type="number"
                onChange={handleAmountChange}
                value={articleAmount}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Button variant="contained" onClick={handleAddArticle}>
                Agregar
              </Button>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: 1 }} />
        <MedicineSelectedTable data={articlesSelected} articlesRes={articlesRes} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 1,
          backgroundColor: 'background.paper',
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
        }}
      >
        <Button variant="outlined" onClick={() => setStep(step - 1)}>
          Regresar
        </Button>
        <Button variant="contained">Continuar</Button>
      </Box>
    </>
  );
};

const MedicineSelectedTable = (props: {
  data: { id: string; nombre: string; cantidad: number }[];
  articlesRes: IExistingArticle[];
}) => {
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={TABLE_HEADER} />
          <MedicineSelectedTableBody data={props.data} articlesRes={props.articlesRes} />
        </Table>
      </TableContainer>
      {props.data.length === 0 && <NoDataInTableInfo infoTitle="No hay artículos" sizeIcon={30} variantText="h4" />}
    </Card>
  );
};

const MedicineSelectedTableBody = (props: {
  data: { id: string; nombre: string; cantidad: number }[];
  articlesRes: IExistingArticle[];
}) => {
  return (
    <TableBody>
      {props.data.map((d) => (
        <MedicineSelectedTableRow data={d} key={d.id} articlesRes={props.articlesRes} />
      ))}
    </TableBody>
  );
};

const MedicineSelectedTableRow = (props: {
  data: { id: string; nombre: string; cantidad: number };
  articlesRes: IExistingArticle[];
}) => {
  const { data } = props;
  const articlesSelected = useProgrammingRegisterStore((state) => state.articlesSelected);
  const setArticlesSelected = useProgrammingRegisterStore((state) => state.setArticlesSelected);
  const [edit, setEdit] = useState(false);
  const handleRemoveArticle = () => {
    setArticlesSelected(articlesSelected.filter((a) => a.id !== data.id));
  };
  const specificArticle = props.articlesRes.find((a) => a.id_Articulo === data.id);
  return (
    <TableRow>
      <TableCell>{data.nombre}</TableCell>
      <TableCell>
        {edit ? (
          <TextField
            label="Cantidad"
            helperText={`Cantidad disponible ${(specificArticle?.stockActual as number) - data.cantidad}`}
            defaultValue={data.cantidad}
          />
        ) : (
          data.cantidad
        )}
      </TableCell>
      <TableCell>
        <Box>
          <Tooltip title="Editar cantidad" onClick={() => setEdit(!edit)}>
            <IconButton>{edit ? <Save /> : <Edit />}</IconButton>
          </Tooltip>
          <Tooltip title="Eliminar" onClick={handleRemoveArticle}>
            <IconButton>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};
