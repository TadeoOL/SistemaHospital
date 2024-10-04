import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  MenuItem,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useWarehouseTabsNavStore } from '../../../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';
import React, { useEffect, useState } from 'react';
import { ICategory, IExistingArticle, ISubCategory } from '../../../../types/types';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Edit, FilterListOff, Info, Save, Warning } from '@mui/icons-material';
import { SearchBar } from '../../../Inputs/SearchBar';
import { useExistingArticlePagination } from '../../../../store/warehouseStore/existingArticlePagination';
import { shallow } from 'zustand/shallow';
import { ArticlesView } from './Modal/ArticlesOutput';
import { toast } from 'react-toastify';
import { isValidInteger } from '../../../../utils/functions/dataUtils';
import { modifyMinStockExistingArticle } from '../../../../api/api.routes';
import { warning } from '../../../../theme/colors';
import { SortComponent } from '../../../Commons/SortComponent';
import { useGetCategoriesWarehouse } from '../../../../hooks/useGetCategoriesByWarehouse';

export const useGetExistingArticles = () => {
  const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));
  const {
    data,
    setSearch,
    search,
    fetchExistingArticles,
    setWarehouseId,
    setPrincipalWarehouseId,
    setStartDate,
    setEndDate,
    clearFilters,
    setPageIndex,
    setPageSize,
    setSubcategory,
    subcategory,
    pageSize,
    startDate,
    endDate,
    clearAllData,
    isLoading,
    setSort,
    sort,
    pageIndex,
    count,
  } = useExistingArticlePagination(
    (state) => ({
      pageIndex: state.pageIndex,
      count: state.count,
      data: state.data,
      setSearch: state.setSearch,
      search: state.search,
      fetchExistingArticles: state.fetchExistingArticles,
      setWarehouseId: state.setWarehouseId,
      setPrincipalWarehouseId: state.setPrincipalWarehouseId,
      setStartDate: state.setStartDate,
      setEndDate: state.setEndDate,
      setSubcategory: state.setSubcategory,
      subcategory: state.subcategory,
      clearFilters: state.clearFilters,
      setPageIndex: state.setPageIndex,
      setPageSize: state.setPageSize,
      pageSize: state.pageSize,
      startDate: state.startDate,
      endDate: state.endDate,
      clearAllData: state.clearAllData,
      isLoading: state.isLoading,
      sort: state.sort,
      setSort: state.setSort,
    }),
    shallow
  );

  useEffect(() => {
    clearAllData();
    setWarehouseId(warehouseData.id_Almacen);
    setPrincipalWarehouseId(warehouseData.id_AlmacenPrincipal || '');
  }, []);

  useEffect(() => {
    fetchExistingArticles();
  }, [search, startDate, endDate, clearFilters, sort, pageSize, pageIndex, subcategory]);

  return {
    data,
    setSearch,
    setStartDate,
    setEndDate,
    clearFilters,
    setPageIndex,
    setPageSize,
    setSubcategory,
    startDate,
    endDate,
    isLoading,
    setSort,
    pageSize,
    pageIndex,
    count,
  };
};
export const WarehouseArticles = () => {
  // const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));
  const {
    data,
    setSearch,
    //setEndDate,
    //setStartDate,
    clearFilters,
    setPageIndex,
    setPageSize,
    setSubcategory,
    //startDate,
    //endDate,
    isLoading,
    setSort,
    pageSize,
    pageIndex,
    count,
  } = useGetExistingArticles();
  const [openModal, setOpenModal] = useState(false);
  const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));
  console.log("warehouseData",warehouseData);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { categories, isLoading: isLoadingCategories } = useGetCategoriesWarehouse(
    warehouseData.esSubAlmacen ? (warehouseData.id_AlmacenPrincipal as string) : warehouseData.id_Almacen
  );
  const [selectedCategorySubcategories, setSelectedCategorySubcategories] = useState<ISubCategory[] | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
console.log("data",data);
  return (
    <>
      <Stack sx={{ overflowX: 'auto' }}>
        <Stack spacing={2} sx={{ minWidth: 950 }}>
          <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
            <SearchBar
              title="Buscar articulo..."
              searchState={setSearch}
              sx={{ display: 'flex', flex: 1 }}
              size="small"
            />
            <Box sx={{ display: 'flex', flex: 1, columnGap: 2, justifyContent: 'flex-end' }}>
              {isLoadingCategories ? (
                <CircularProgress />
              ) : (
                <>
                  <TextField
                    sx={{ width: 150 }}
                    select
                    label="Categoria"
                    size="small"
                    //helperText={'Selecciona un almacén'}
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value ?? null);
                      if (e.target.value !== null) {
                        setSelectedCategorySubcategories(
                          categories.find((cat) => cat.id_Categoria === e.target.value)?.subCategorias ?? null
                        );
                      } else {
                        setSelectedCategorySubcategories(null);
                      }
                    }}
                  >
                    {categories.map((warehouse: ICategory) => (
                      <MenuItem key={warehouse.id_Almacen} value={warehouse.id_Almacen}>
                        {warehouse.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    sx={{ width: 150 }}
                    select
                    label="Subcategoria"
                    size="small"
                    //helperText={'Selecciona un almacén'}
                    value={selectedSubcategory}
                    onChange={(e) => {
                      setSelectedSubcategory(e.target.value ?? null);
                      setSubcategory(e.target.value ?? '');
                    }}
                  >
                    {selectedCategorySubcategories ? (
                      selectedCategorySubcategories.map((warehouse: ISubCategory) => (
                        <MenuItem key={warehouse.id_SubCategoria} value={warehouse.id_SubCategoria}>
                          {warehouse.nombre}
                        </MenuItem>
                      ))
                    ) : (
                      <></>
                    )}
                  </TextField>
                </>
              )}
              <IconButton
                onClick={() => {
                  clearFilters();
                  setSubcategory('');
                  setSelectedCategory(null);
                  setSelectedCategorySubcategories(null);
                }}
              >
                <FilterListOff />
              </IconButton>
              <Button
                sx={{ minWidth: 180 }}
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={() => setOpenModal(!openModal)}
              >
                Salida de artículos
              </Button>
            </Box>
          </Box>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <SortComponent
                        tableCellLabel="Nombre del Articulo"
                        headerName="articulo"
                        setSortFunction={setSort}
                      />
                    </TableCell>
                    <TableCell>
                      <SortComponent tableCellLabel="Stock Minimo" headerName="stockMinimo" setSortFunction={setSort} />
                    </TableCell>
                    <TableCell>
                      <SortComponent tableCellLabel="Stock Actual" headerName="stockActual" setSortFunction={setSort} />
                    </TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data && data.map((article) => <TableRowComponent article={article} key={article.id_Articulo} />)}
                </TableBody>
              </Table>
              {isLoading && (
                <Box sx={{ display: 'flex', flex: 1, p: 4 }}>
                  <CircularProgress sx={{ mx: 'auto' }} />
                </Box>
              )}
              {data.length === 0 && !isLoading && (
                <Box
                  sx={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 5,
                    columnGap: 1,
                  }}
                >
                  <Info sx={{ width: 40, height: 40, color: 'gray' }} />
                  <Typography variant="h2" color="gray">
                    No hay artículos existentes
                  </Typography>
                </Box>
              )}
              <TablePagination
                component="div"
                count={count}
                onPageChange={(e, value) => {
                  e?.stopPropagation();
                  setPageIndex(value);
                }}
                onRowsPerPageChange={(e: any) => {
                  setPageSize(e.target.value);
                }}
                page={pageIndex}
                rowsPerPage={pageSize}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Filas por página"
              />
            </TableContainer>
          </Card>
        </Stack>
      </Stack>
      <Modal open={openModal}>
        <>
          <ArticlesView setOpen={setOpenModal} />
        </>
      </Modal>
    </>
  );
};

interface TableRowComponentProps {
  article: IExistingArticle;
}
const TableRowComponent: React.FC<TableRowComponentProps> = ({ article }) => {
  //const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSubRow, setIsEditingSubRow] = useState(false);
  const [amountText, setAmountText] = useState(article.stockActual.toString());
  const [minAmountText, setMinAmountText] = useState(article.stockMinimo.toString());

  const articlesData = useExistingArticlePagination(useShallow((state) => state.data));

  const handleSaveValue = async () => {
    const modified = {
      stockMinimo: minAmountText,
      stock: isNaN(Number(amountText)) ? article.stockActual : Number(amountText),
      id_almacen: useWarehouseTabsNavStore.getState().warehouseData.id_Almacen,
      id_articulo: article.id_Articulo,
    };
    try {
      await modifyMinStockExistingArticle(modified);
      modifyArticle(minAmountText, modified.stock);
      toast.success('Articulo actualizado con exito!');
    } catch (error) {
      console.log(error);
    }
  };

  const modifyArticle = (stockMin: string, stockActual: number) => {
    const newArticle = {
      ...article,
      stockActual: stockActual,
      stockMinimo: parseInt(stockMin),
    };
    const newArticlesList = articlesData.map((a) => {
      if (a.id_Articulo === newArticle.id_Articulo) {
        return { ...newArticle };
      }
      return { ...a };
    });
    useExistingArticlePagination.setState({ data: newArticlesList });
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>{article.nombre}</Box>
        </TableCell>
        <TableCell>
          {isEditing ? (
            <TextField
              sx={{ width: '60%', ml: 'auto' }}
              size="small"
              fullWidth
              placeholder="Stock Minimo"
              value={minAmountText}
              onChange={(e) => {
                if (!isValidInteger(e.target.value)) return;
                setMinAmountText(e.target.value);
              }}
            />
          ) : (
            <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', columnGap: 1 }}>
              <Box>{article.stockMinimo}</Box>
              <Box>
                {article.stockActual < article.stockMinimo ? (
                  <Tooltip title="Stock bajo">
                    <Warning sx={{ color: warning.main }} />
                  </Tooltip>
                ) : null}
              </Box>
            </Box>
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <TextField
              sx={{ width: '60%', ml: 'auto' }}
              size="small"
              fullWidth
              placeholder="Cantidad"
              value={amountText}
              onChange={(e) => {
                if (!isValidInteger(e.target.value)) return;
                setAmountText(e.target.value);
              }}
            />
          ) : (
            article.stockActual
          )}
        </TableCell>
        <TableCell>
          <Tooltip title={isEditing ? 'Guardar' : 'Editar stock mínimo'}>
            <IconButton
              onClick={() => {
                if (isEditing) {
                  handleSaveValue();
                }
                setIsEditing(!isEditing);
                setIsEditingSubRow(!isEditingSubRow);
              }}
              disabled={isEditingSubRow && !isEditing}
            >
              {isEditing ? <Save /> : <Edit />}
            </IconButton>
          </Tooltip>

          {/*<Tooltip title="Añadir lote">
            <IconButton
              onClick={() => {
                //setOpen(true);
                //setOpenNewLote(true);
                //setIsEditingSubRow(true);
              }}
              disabled={isEditing || isEditingSubRow}
            >
              <AddCircleIcon />
            </IconButton>
          </Tooltip>*/}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
/*
interface SubItemsTableProps {
  article: IExistingArticleList[];
  idArticle: string;
  setOpenNewLote: Function;
  openNewLote: boolean;
  isEditingSubRow: boolean;
  setIsEditingSubRow: Function;
}
interface InputFieldRef {
  value: string;
}

const SubItemsTable: React.FC<SubItemsTableProps> = ({
  idArticle,
  article,
  openNewLote,
  setOpenNewLote,
  isEditingSubRow,
  setIsEditingSubRow,
}) => {
  const loteDateRef = useRef<InputFieldRef>();
  const textStockRef = useRef<HTMLTextAreaElement>();
  const dateNow = Date.now();
  const today = new Date(dateNow);
  const year = today.getFullYear();
  let month = (today.getMonth() + 1).toString().padStart(2, '0');
  let day = today.getDate().toString().padStart(2, '0');
  const todayFormatted = `${year}/${month}/${day}`;
  const [expirationDate, setExpirationDate] = useState(true);
  const [isLoadingLote, setIsLoadingLote] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const { fetchExistingArticles } = useExistingArticlePagination(
    (state) => ({
      fetchExistingArticles: state.fetchExistingArticles,
    }),
    shallow
  );

  const handleTextFieldChange = () => {
    console.log(loteDateRef.current?.value, textStockRef.current?.value);
    const areAllFieldsFilled = (loteDateRef.current?.value || !expirationDate) && textStockRef.current?.value;
    setIsButtonDisabled(!areAllFieldsFilled);
  };

  const isValidNumber = (value: string): boolean => {
    const numericValue = parseFloat(value);
    return !isNaN(numericValue);
  };
  const handleSubmitNewLote = async () => {
    setIsLoadingLote(true);
    const stockValue = textStockRef.current?.value || '';
    if (!isValidNumber(stockValue)) {
      setAmountError(true);
      toast.error('Cantidad no valida');
      return;
    }
    setAmountError(false);

    const expireDateValue = expirationDate ? loteDateRef.current?.value : '4000-01-01';

    const newLoteObject = {
      id_almacen: useWarehouseTabsNavStore.getState().warehouseData.id,
      id_articulo: idArticle,
      fechaCaducidad: expireDateValue || '4000-01-01',
      cantidad: Number(stockValue),
    };
    try {
      console.log(newLoteObject);
      await registrarNuevoLote(newLoteObject);
      toast.success('Lote agregado con éxito!');
      fetchExistingArticles();
      setOpenNewLote(false);
    } catch (error) {
      toast.error('Algo salio mal!');
    } finally {
      setIsLoadingLote(false);
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Fecha de compra de lote</StyledTableCell>
            <StyledTableCell align="center">Fecha de caducidad</StyledTableCell>
            <StyledTableCell align="center">Stock</StyledTableCell>
            <StyledTableCell align="center">Acciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {article.map((a) => (
            <SubItemsTableRow
              articleR={a}
              key={a.id_ArticuloExistente}
              idArticle={idArticle}
              isEditingSubRow={isEditingSubRow}
              setIsEditingSubRow={setIsEditingSubRow}
            />
          ))}
        </TableBody>
        {openNewLote && (
          <TableRow key={`artEdr${article.at(0)?.id_ArticuloExistente}`}>
            <TableCell align="center">Nuevo Lote:</TableCell>
            <TableCell align="center">
              <Typography variant="subtitle2">Fecha de caducidad</Typography>
              <Checkbox
                checked={expirationDate}
                onChange={(e) => {
                  setExpirationDate(e.target.checked);
                  handleTextFieldChange();
                }}
                name="Validación de Fecha de Caducidad"
              />
              <TextField
                onChange={() => {
                  handleTextFieldChange();
                }}
                disabled={!expirationDate}
                type="date"
                placeholder="Fecha de caducidad"
                inputRef={loteDateRef}
                inputProps={{ min: todayFormatted }}
              />
            </TableCell>
            <TableCell align="center">
              <Typography variant="subtitle2">Cantidad</Typography>
              <TextField
                onChange={() => {
                  handleTextFieldChange();
                }}
                placeholder="Cantidad Entrada"
                inputRef={textStockRef}
                error={amountError}
                helperText={!!amountError && 'Escribe una cantidad correcta'}
              />
            </TableCell>
            <TableCell align="center">
              {isLoadingLote ? (
                <CircularProgress />
              ) : (
                <Tooltip title="Guardar">
                  <IconButton
                    onClick={() => {
                      handleSubmitNewLote();
                      setIsEditingSubRow(false);
                    }}
                    disabled={isButtonDisabled!}
                  >
                    <Save />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Cancelar">
                <IconButton
                  onClick={() => {
                    setOpenNewLote(false);
                    setIsEditingSubRow(false);
                  }}
                >
                  <Cancel />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        )}
      </Table>
    </TableContainer>
  );
};
interface SubItemsTableRowProps {
  articleR: IExistingArticleList;
  idArticle: string;
  isEditingSubRow: boolean;
  setIsEditingSubRow: Function;
}
const SubItemsTableRow: React.FC<SubItemsTableRowProps> = ({
  articleR,
  idArticle,
  isEditingSubRow,
  setIsEditingSubRow,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const textLoteDateRef = useRef<InputFieldRef>();
  const textStockRef = useRef<HTMLTextAreaElement>();
  const dateNow = Date.now();
  const today = new Date(dateNow);
  const year = today.getFullYear();
  let month = (today.getMonth() + 1).toString().padStart(2, '0');
  let day = today.getDate().toString().padStart(2, '0');
  const todayFormatted = `${year}/${month}/${day}`;
  const expireDate = articleR.fechaCaducidad === '01/01/4000';
  const [isLoadingLote, setIsLoadingLote] = useState(false);

  const { fetchExistingArticles } = useExistingArticlePagination(
    (state) => ({
      fetchExistingArticles: state.fetchExistingArticles,
    }),
    shallow
  );

  const deleteLote = (loteId: string) => {
    withReactContent(Swal)
      .fire({
        title: 'Advertencia',
        text: `¿Seguro que deseas eliminar este lote de articulos?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        confirmButtonColor: 'red',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return articlesLoteDelete({
            Id_ArticuloExistente: loteId,
          });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          fetchExistingArticles();
          withReactContent(Swal).fire({
            title: 'Éxito!',
            text: 'Lote eliminado',
            icon: 'success',
          });
        }
      });
  };

  useEffect(() => {
    if (isEditing) {
      if (textLoteDateRef.current) {
        if (articleR.fechaCaducidad !== '01/01/4000') {
          const dateArray = articleR.fechaCaducidad.split('/');
          const dayL = dateArray[0];
          const monthL = dateArray[1];
          const yearL = dateArray[2];
          const fechaNueva = `${yearL}-${monthL.padStart(2, '0')}-${dayL.padStart(2, '0')}`;
          textLoteDateRef.current.value = fechaNueva;
        }
      }
      if (textStockRef.current) {
        textStockRef.current.value = articleR.cantidad.toString();
      }
      //if (textCodeRef.current) {
      //  textCodeRef.current.value = articleR.codigoBarras;
      //}
    }
  }, [isEditing]);

  const handleSaveValue = async () => {
    setIsLoadingLote(true);
    //if (!textStockRef.current || textStockRef.current.value === '') return;
    if (textStockRef.current?.value !== '' && !isValidInteger(textStockRef.current?.value as string))
      return toast.error('Para guardar el valor escribe un numero valido!');
    const value = textStockRef.current?.value || null;

    const loteModified = {
      Stock: Number(value) || undefined,
      Id_Almacen: useWarehouseTabsNavStore.getState().warehouseData.id,
      Id_Articulo_Lote: articleR.id_ArticuloExistente,
      Id_Articulo: idArticle,
      FechaCaducidad: textLoteDateRef.current?.value || undefined,
    };
    try {
      console.log(loteModified);
      await articlesLoteUpdate(loteModified);
      toast.success('Lote actualizado con exito!');
      setIsEditing(false);
      setIsEditingSubRow(false);
      fetchExistingArticles();
    } catch (error) {
      console.log(error);
      return toast.error('Algo salio mal');
    }
    setIsLoadingLote(false);
  };

  return (
    <TableRow key={articleR.id_ArticuloExistente}>
      <TableCell align="center">{returnExpireDate(articleR.fechaCompraLote)}</TableCell>
      {isEditing ? (
        <>
          <TableCell align="center">
            <TextField
              disabled={expireDate}
              type="date"
              placeholder="Fecha de caducidad"
              inputRef={textLoteDateRef}
              inputProps={{ min: todayFormatted }}
            />
          </TableCell>
          <TableCell align="center">
            <TextField
              placeholder="Cantidad Entrada"
              className="tableCell"
              inputRef={textStockRef}
              inputProps={{ className: 'tableCell' }}
            />
          </TableCell>
        </>
      ) : (
        <>
          <TableCell align="center">{returnExpireDate(articleR.fechaCaducidad)}</TableCell>
          <TableCell align="center">{articleR.cantidad}</TableCell>
        </>
      )}
      <TableCell align="center">
        {isLoadingLote ? (
          <CircularProgress />
        ) : (
          <Tooltip title={isEditing ? 'Guardar' : 'Editar'}>
            <IconButton
              onClick={() => {
                if (isEditing) {
                  handleSaveValue();
                }
                setIsEditing(!isEditing);
                setIsEditingSubRow(true);
              }}
              disabled={isEditingSubRow && !isEditing}
            >
              {isEditing ? <Save /> : <Edit />}
            </IconButton>
          </Tooltip>
        )}

        {isEditing && (
          <Tooltip title="Cancelar">
            <IconButton
              onClick={() => {
                setIsEditing(false);
                setIsEditingSubRow(false);
              }}
            >
              <Cancel />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Eliminar">
          <IconButton
            onClick={() => {
              deleteLote(articleR.id_ArticuloExistente);
            }}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};
*/
