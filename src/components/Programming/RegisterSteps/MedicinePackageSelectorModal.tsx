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
import { ChangeEvent, useEffect, useState } from 'react';
import { getPharmacyConfig } from '../../../services/pharmacy/configService';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { Delete, Edit, Save, WarningAmber } from '@mui/icons-material';
import { useExistingArticlePagination } from '../../../store/warehouseStore/existingArticlePagination';
import { isValidInteger } from '../../../utils/functions/dataUtils';
import { toast } from 'react-toastify';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { IArticlesPackage, IExistingArticle } from '../../../types/types';
import { getPackagesByWarehouseId } from '../../../api/api.routes';
const TABLE_HEADER = ['Nombre', 'Cantidad', 'Acciones'];
interface MedicinePackageSelectorProps {
  setOpen: Function;
}

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

const useGetPackageData = (warehouseId: string, isLoadingWarehouse: boolean) => {
  const [packages, setPackages] = useState<IArticlesPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (isLoadingWarehouse) return;
    const fetchPackageData = async () => {
      try {
        const res = await getPackagesByWarehouseId(warehouseId);
        setPackages(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackageData();
  }, [warehouseId, isLoadingWarehouse]);
  return { packages, isLoading };
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

export const MedicinePackageSelectorModal = (props: MedicinePackageSelectorProps) => {
  const { principalWarehouseId, isLoading } = useGetPrincipalWarehouseId();
  const { packages: packageData, isLoading: isLoadingPackages } = useGetPackageData(principalWarehouseId, isLoading);
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
  const [packageSelected, setPackageSelected] = useState<IArticlesPackage | null>(null);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const num = e.target.value;
    if (!isValidInteger(num)) return toast.warning('Escribe un número valido!');
    setArticleAmount(num);
  };

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
      { ...articleSelected, cantidad: parseInt(articleAmount), cantidadDisponible: originalArticle?.stockActual },
    ]);
    setArticleSelected(undefined);
    setArticleAmount('0');
  };

  useEffect(() => {
    if (isLoadingArticles) return;
    setArticles(articlesRes);
  }, [isLoadingArticles, articlesRes]);

  const handleSubmit = () => {
    if (articlesSelected.length === 0) return toast.warning('Agrega artículos al paquete');
    // if (
    //   articlesSelected.some(
    //     (a) => (a.cantidadDisponible as number) < 1 || (a.cantidadDisponible as number) < a.cantidad
    //   )
    // ) {
    //   return toast.warning('No hay suficiente stock de alguno de los artículos seleccionados');
    // }
    toast.success('Artículos agregados con éxito!');
    setStep(step + 1);
  };

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
          renderInput={(params) => <TextField {...params} placeholder="Paquetes de artículos" />}
          onChange={(_, val) => {
            if (!val) return;
            setPackageSelected(val);
            setArticlesSelected(
              val.contenido.map((a: any) => {
                return {
                  id: a.id_Articulo,
                  nombre: a.nombre,
                  cantidad: a.cantidadSeleccionar,
                  cantidadDisponible: a.cantidad,
                };
              })
            );
          }}
          onInputChange={(_, __, reason) => {
            if (reason === 'clear') {
              setPackageSelected(null);
            }
          }}
          value={packageSelected}
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
        <Button variant="contained" onClick={handleSubmit}>
          Siguiente
        </Button>
      </Box>
    </>
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
  const articlesSelected = useProgrammingRegisterStore((state) => state.articlesSelected);
  const setArticlesSelected = useProgrammingRegisterStore((state) => state.setArticlesSelected);
  const [edit, setEdit] = useState(false);
  const [editedAmount, setEditedAmount] = useState(data.cantidad.toString());

  const handleRemoveArticle = () => {
    setArticlesSelected(articlesSelected.filter((a) => a.id !== data.id));
  };

  const handleEditArticle = () => {
    setEdit(!edit);
  };

  const handleSaveEditArticle = () => {
    if (parseInt(editedAmount) > (data.cantidadDisponible as number))
      return toast.warning('La cantidad excede el stock actual!');
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
          {(data.cantidadDisponible as number) < 1 && (
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
          )}
          <Typography variant="caption">{data.nombre}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        {edit ? (
          <TextField
            label="Cantidad"
            helperText={`Cantidad disponible ${data.cantidadDisponible as number}`}
            value={editedAmount}
            onChange={handleAmountChange}
          />
        ) : (
          data.cantidad
        )}
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
