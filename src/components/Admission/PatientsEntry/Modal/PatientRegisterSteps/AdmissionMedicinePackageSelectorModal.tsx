import {
  Autocomplete,
  Box,
  Button,
  Card,
  createFilterOptions,
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
import { ChangeEvent, useEffect, useState } from 'react';
import { ClearAll, Delete, Edit, Save } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { shallow } from 'zustand/shallow';
import { useExistingArticlePagination } from '../../../../../store/warehouseStore/existingArticlePagination';
import { usePackageNamesPaginationStore } from '../../../../../store/warehouseStore/packagesNamesPagination';
import { usePatientEntryRegisterStepsStore } from '../../../../../store/admission/usePatientEntryRegisterSteps';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { IExistingArticle, IWarehouseData } from '../../../../../types/types';
import { isValidInteger } from '../../../../../utils/functions/dataUtils';
import { TableHeaderComponent } from '../../../../Commons/TableHeaderComponent';
import { NoDataInTableInfo } from '../../../../Commons/NoDataInTableInfo';
import { getPharmacyConfig } from '../../../../../services/pharmacy/configService';
import { getWarehouseById } from '../../../../../api/api.routes';
import { getAllQurirgicalPackageBySearch } from '@/services/operatingRoom/dailyOperatingPackageService';

const TABLE_HEADER = ['Nombre', 'Cantidad', 'Acciones'];
interface AdmissionMedicinePackageSelectorModalProps {
  setOpen: Function;
}
const OPTIONS_LIMIT = 20;
const filterWarehouseOptions = createFilterOptions<IWarehouseData>({
  limit: OPTIONS_LIMIT,
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 900, lg: 1100 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 550, xl: 600 },
};

const styleBar = {
  '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey',
  },
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

const useGetPackagesData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[] | null>(null);
  const [search, setSearch] = useState('');

  const fetch = async () => {
    try {
      setIsLoading(true);
      const res = await getAllQurirgicalPackageBySearch(search);
      console.log('res:', res);
      setData(res);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [search]);

  return {
    isLoadingPackages: isLoading,
    dataPack: data,
    setSearchPack: setSearch,
  };
};

export const AdmissionMedicinePackageSelectorModal = (props: AdmissionMedicinePackageSelectorModalProps) => {
  const { principalWarehouseId } = useGetPrincipalWarehouseId();
  const { dataPack, isLoadingPackages, setSearchPack } = useGetPackagesData();

  const {
    data: articlesRes,
    isLoading: isLoadingArticles,
    setSearch: setSearchArticle,
  } = useGetArticles(principalWarehouseId);
  const [articles, setArticles] = useState(articlesRes);
  const step = usePatientEntryRegisterStepsStore((state) => state.step);
  const setStep = usePatientEntryRegisterStepsStore((state) => state.setStep);
  const setWarehouseSelectedSS = usePatientEntryRegisterStepsStore((state) => state.setWarehouseSelected);
  const articlesSelected = usePatientEntryRegisterStepsStore((state) => state.articlesSelected);
  const setArticlesSelected = usePatientEntryRegisterStepsStore((state) => state.setArticlesSelected);
  const [articleSelected, setArticleSelected] = useState<{
    id: string;
    nombre: string;
    cantidad: number;
    precioVenta: number;
  } | null>();
  const [articleAmount, setArticleAmount] = useState('0');
  const packageSelected = usePatientEntryRegisterStepsStore((state) => state.packageSelected);
  const setPackageSelected = usePatientEntryRegisterStepsStore((state) => state.setPackageSelected);
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const num = e.target.value;
    if (!isValidInteger(num)) return toast.warning('Escribe un número valido!');
    setArticleAmount(num);
  };
  const [warehouses, setWarehouses] = useState<IWarehouseData[]>([]);
  const [warehouseSelected, setWarehouseSelected] = useState<IWarehouseData | null>(null);
  const [isLoadingWarehouse, setIsLoadingWarehouse] = useState(true);

  useEffect(() => {
    if (principalWarehouseId) {
      const fetchWarehouse = async () => {
        const warehouseInfo = await getWarehouseById(principalWarehouseId);
        const allWarehouses = [warehouseInfo, ...warehouseInfo.subAlmacenes];
        setWarehouseSelected(allWarehouses[0]);
        setWarehouseSelectedSS(allWarehouses[0].id_Almacen);
        setIsLoadingWarehouse(false);
        setWarehouses(allWarehouses);
      };
      fetchWarehouse();
    }
  }, [principalWarehouseId]);

  const handleAddArticle = () => {
    if (!articleSelected) return toast.warning('Selecciona un artículo');
    if (parseInt(articleAmount) === 0) return toast.warning('Agrega una cantidad!');
    const { id } = articleSelected;
    // if (parseInt(articleAmount) > cantidad) return toast.warning('No hay suficiente stock!');
    // if (cantidad === 0) return toast.warning('El artículo seleccionado no tiene existencias');
    if (articlesSelected.find((article) => article.id === id)) {
      return toast.warning('El artículo seleccionado ya se encuentra en la lista');
    }
    const originalArticle = articlesRes.find((a) => a.id_Articulo === id);
    setArticlesSelected([
      ...articlesSelected,
      {
        ...articleSelected,
        cantidad: parseInt(articleAmount),
        cantidadDisponible: originalArticle?.stockActual,
        precioVenta: articleSelected.precioVenta,
      },
    ]);
    setArticleSelected(undefined);
    setArticleAmount('0');
  };

  const handleClearArticleList = () => {
    setArticlesSelected([]);
    setPackageSelected(null);
  };

  useEffect(() => {
    if (isLoadingArticles) return;
    setArticles(articlesRes);
  }, [isLoadingArticles, articlesRes]);

  const handleSubmit = () => {
    if (!warehouseSelected) {
      return toast.warning('Selecciona un almacen!');
    }
    if (articlesSelected.length === 0 && !packageSelected)
      return toast.warning('Selecciona un paquete quirurgico o agrega artículos al paquete');
    toast.success('Artículos agregados con éxito!');
    setStep(step + 1);
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Paquete de medicinas" />

      <Box sx={{ backgroundColor: 'background.paper', p: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
            <Typography>Almacen:</Typography>
            <Autocomplete
              disablePortal
              fullWidth
              filterOptions={filterWarehouseOptions}
              loading={isLoadingPackages}
              getOptionLabel={(option) => option.nombre ?? ''}
              options={warehouses ?? []}
              sx={{ width: { xs: 350, sm: 400 } }}
              noOptionsText="No se encontraron almacenes"
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Almacen a solicitar"
                  sx={{ width: '100%' }}
                  onChange={(e) => {
                    setSearchPack(e.target.value);
                  }}
                />
              )}
              onChange={async (_, val) => {
                if (!val) return;
                setWarehouseSelected(val);
                setWarehouseSelectedSS(val.id_Almacen);
              }}
              onInputChange={(_, __, reason) => {
                if (reason === 'clear') {
                  setWarehouseSelected(null);
                  setWarehouseSelectedSS('');
                }
              }}
              value={warehouseSelected}
              isOptionEqualToValue={(op, val) => op.id_Almacen === val.id_Almacen}
            />
          </Box>
          <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
            <Typography>Selección de almacen:</Typography>
            <Autocomplete
              disabled={!!packageSelected}
              disablePortal
              fullWidth
              // filterOptions={filterPackageOptions}
              loading={isLoadingWarehouse}
              getOptionLabel={(option) => option.nombre ?? ''}
              options={dataPack ?? []}
              sx={{ width: { xs: 350, sm: 400 } }}
              noOptionsText="No se encontraron paquetes"
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Paquetes de artículos"
                  sx={{ width: '100%' }}
                  onChange={(e) => {
                    setSearchPack(e.target.value);
                  }}
                />
              )}
              onChange={async (_, val) => {
                if (!val) return;
                setPackageSelected(val);
              }}
              onInputChange={(_, __, reason) => {
                if (reason === 'clear') {
                  setPackageSelected(null);
                }
              }}
              value={packageSelected}
              isOptionEqualToValue={(op, val) => op.id_PaqueteQuirurgico === val.id_PaqueteQuirurgico}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
            <Typography>Selección de artículos:</Typography>
            <Autocomplete
              disablePortal
              fullWidth
              // filterOptions={filterWarehouseOptions}
              onChange={(_, val) => {
                if (val) {
                  setArticleSelected({
                    id: val.id_Articulo as string,
                    cantidad: val.stockActual as number,
                    nombre: val.nombre as string,
                    precioVenta: val.precioVentaPI as number,
                  });
                }
              }}
              loading={isLoadingArticles}
              getOptionLabel={(option) => option.nombre}
              options={articles.filter((a) => !articlesSelected.some((as) => as.id === a.id_Articulo)) ?? []}
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: 5 }}>
          <Tooltip title="Limpiar lista artículos">
            <>
              <IconButton onClick={handleClearArticleList} disabled={articlesSelected.length < 1}>
                <ClearAll color={articlesSelected.length > 0 ? 'error' : undefined} />
              </IconButton>
            </>
          </Tooltip>
        </Box>
        <Box sx={{ overflowY: 'auto', ...styleBar }}>
          <Box sx={{ maxHeight: { xs: 200, md: 300, xl: 400 } }}>
            <MedicineSelectedTable data={articlesSelected} articlesRes={articlesRes} />
          </Box>
        </Box>
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
        <Button variant="contained" onClick={handleSubmit}>
          Siguiente
        </Button>
      </Box>
    </Box>
  );
};

const MedicineSelectedTable = (props: {
  data: { id: string; nombre: string; cantidad: number; cantidadDisponible?: number }[];
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
  data: { id: string; nombre: string; cantidad: number; cantidadDisponible?: number }[];
  articlesRes: IExistingArticle[];
}) => {
  return (
    <TableBody>
      {props.data.map((d) => (
        <MedicineSelectedTableRow data={d} key={d.id} />
      ))}
    </TableBody>
  );
};

const MedicineSelectedTableRow = (props: {
  data: { id: string; nombre: string; cantidad: number; cantidadDisponible?: number };
}) => {
  const { data } = props;
  const articlesSelected = usePatientEntryRegisterStepsStore((state) => state.articlesSelected);
  const setArticlesSelected = usePatientEntryRegisterStepsStore((state) => state.setArticlesSelected);
  const [edit, setEdit] = useState(false);
  const [editedAmount, setEditedAmount] = useState(data.cantidad.toString());

  const handleRemoveArticle = () => {
    setArticlesSelected(articlesSelected.filter((a) => a.id !== data.id));
  };

  const handleEditArticle = () => {
    setEdit(!edit);
  };

  const handleSaveEditArticle = () => {
    setArticlesSelected(
      articlesSelected.map((a) => (a.id === data.id ? { ...a, cantidad: parseInt(editedAmount) } : a))
    );
    setEdit(!edit);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const num = e.target.value.trim();
    if (!isValidInteger(num)) return toast.warning('Escribe un número valido!');
    setEditedAmount(num);
  };

  return (
    <TableRow>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
          {/*(data.cantidadDisponible as number) < 1 && (
            <Tooltip title="No hay stock">
              <Box>{<WarningAmber color="error" />}</Box>
            </Tooltip>
          )}
          {(data.cantidadDisponible as number) > 0 && (data.cantidadDisponible as number) < data.cantidad && (
            <Tooltip title="La cantidad excede el stock">
              <Box>
                <WarningAmber color="warning" />
              </Box>
            </Tooltip>
          )*/}
          <Typography variant="caption">{data.nombre}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        {edit ? <TextField label="Cantidad" value={editedAmount} onChange={handleAmountChange} /> : data.cantidad}
      </TableCell>
      <TableCell>
        <Box>
          <Tooltip title="Editar cantidad" onClick={() => (edit ? handleSaveEditArticle() : handleEditArticle())}>
            <IconButton>{edit ? <Save /> : <Edit />}</IconButton>
          </Tooltip>
          <Tooltip title="Eliminar" onClick={handleRemoveArticle}>
            <IconButton>
              <Delete color="error" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};
