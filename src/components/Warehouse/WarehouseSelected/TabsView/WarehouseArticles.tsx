import {
  Box,
  Button,
  Card,
  CircularProgress,
  Collapse,
  IconButton,
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
  alpha,
  styled,
  tableCellClasses,
} from '@mui/material';
import { useWarehouseTabsNavStore } from '../../../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';
import React, { useEffect, useRef, useState } from 'react';
import { IExistingArticle, IExistingArticleList } from '../../../../types/types';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Edit, ExpandLess, ExpandMore, FilterListOff, Info, Save, Warning, Delete, Cancel } from '@mui/icons-material';
import { SearchBar } from '../../../Inputs/SearchBar';
import { useExistingArticlePagination } from '../../../../store/warehouseStore/existingArticlePagination';
import { shallow } from 'zustand/shallow';
import { ArticlesView } from './Modal/ArticlesOutput';
import { toast } from 'react-toastify';
import { isValidInteger } from '../../../../utils/functions/dataUtils';
import {
  addArticlesToWarehouse,
  modifyMinStockExistingArticle,
  articlesLoteUpdate,
  articlesLoteDelete,
} from '../../../../api/api.routes';
import { warning } from '../../../../theme/colors';
import { returnExpireDate } from '../../../../utils/expireDate';
import { SortComponent } from '../../../Commons/SortComponent';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: alpha(`${theme.palette.grey[50]}`, 1),
    fontWeight: 'bold',
    fontSize: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    border: 'hidden',
  },
  [`&.${tableCellClasses.root}`]: {
    width: '20%',
  },
}));

export const useGetExistingArticles = () => {
  const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));
  const {
    data,
    setSearch,
    search,
    fetchExistingArticles,
    setWarehouseId,
    setStartDate,
    setEndDate,
    clearFilters,
    setPageIndex,
    setPageSize,
    startDate,
    endDate,
    clearAllData,
    isLoading,
    setSort,
    sort,
  } = useExistingArticlePagination(
    (state) => ({
      data: state.data,
      setSearch: state.setSearch,
      search: state.search,
      fetchExistingArticles: state.fetchExistingArticles,
      setWarehouseId: state.setWarehouseId,
      setStartDate: state.setStartDate,
      setEndDate: state.setEndDate,
      clearFilters: state.clearFilters,
      setPageIndex: state.setPageIndex,
      setPageSize: state.setPageSize,
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
  }, [warehouseData.id]);

  useEffect(() => {
    setWarehouseId(warehouseData.id);
    fetchExistingArticles();
  }, [search, startDate, endDate, clearFilters, sort]);

  return {
    data,
    setSearch,
    setStartDate,
    setEndDate,
    clearFilters,
    setPageIndex,
    setPageSize,
    startDate,
    endDate,
    isLoading,
    setSort,
  };
};
export const WarehouseArticles = () => {
  // const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));
  const {
    data,
    setSearch,
    setEndDate,
    setStartDate,
    clearFilters,
    setPageIndex,
    setPageSize,
    startDate,
    endDate,
    isLoading,
    setSort,
  } = useGetExistingArticles();
  const [openModal, setOpenModal] = useState(false);

  if (isLoading && data.length === 0)
    return (
      <Box sx={{ display: 'flex', flex: 1, p: 4 }}>
        <CircularProgress size={30} />
      </Box>
    );
  return (
    <>
      <Stack sx={{ overflowX: 'auto' }}>
        <Stack spacing={2} sx={{ minWidth: 950 }}>
          <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
            <SearchBar
              title="Buscar orden de compra..."
              searchState={setSearch}
              sx={{ display: 'flex', flex: 1 }}
              size="small"
            />
            <Box sx={{ display: 'flex', flex: 1, columnGap: 2, justifyContent: 'flex-end' }}>
              <TextField
                label="Fecha inicio"
                size="small"
                type="date"
                value={startDate}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
              />
              <TextField
                label=" Fecha final"
                size="small"
                type="date"
                value={endDate}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
              />
              <IconButton onClick={() => clearFilters()}>
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
                    <TableCell>
                      <SortComponent
                        tableCellLabel="Precio de compra"
                        headerName="precioCompra"
                        setSortFunction={setSort}
                      />
                    </TableCell>
                    <TableCell>
                      <SortComponent tableCellLabel="Código de Barras" headerName="codigoBarras" setSortFunction={setSort} />
                    </TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data && data.map((article) => <TableRowComponent article={article} key={article.id} />)}
                </TableBody>
              </Table>
              {!data ||
                (data.length === 0 && (
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
                ))}
              <TablePagination
                component="div"
                count={0}
                onPageChange={(e, value) => {
                  e?.stopPropagation();
                  setPageIndex(value);
                }}
                onRowsPerPageChange={(e: any) => {
                  setPageSize(e.target.value);
                }}
                page={0}
                rowsPerPage={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Filas por página"
              />
            </TableContainer>
          </Card>
        </Stack>
      </Stack>
      <Modal open={openModal} onClose={() => setOpenModal(!openModal)}>
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
  const [open, setOpen] = useState(false);
  const [openNewLote, setOpenNewLote] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSubRow, setIsEditingSubRow] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>();
  const articlesData = useExistingArticlePagination(useShallow((state) => state.data));

  const handleSaveValue = async () => {
    if (!textRef.current || textRef.current.value === '') return;
    if (!isValidInteger(textRef.current.value)) return toast.error('Para guardar el valor escribe un numero valido!');
    const value = textRef.current.value;
    const modified = {
      stockMinimo: value,
      id_almacen: useWarehouseTabsNavStore.getState().warehouseData.id,
      id_articulo: article.id,
    };
    try {
      await modifyMinStockExistingArticle(modified);
      modifyArticle(value);
      toast.success('Articulo actualizado con exito!');
    } catch (error) {
      console.log(error);
    }
  };

  const modifyArticle = (stockMin: string) => {
    const newArticle = {
      ...article,
      stockMinimo: parseInt(stockMin),
    };
    const newArticlesList = articlesData.map((a) => {
      if (a.id === newArticle.id) {
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => setOpen(!open)}>
              {article.listaArticuloExistente && article.listaArticuloExistente.length > 0 && !open ? (
                <ExpandMore />
              ) : (
                <ExpandLess />
              )}
            </IconButton>
            {article.nombre}
          </Box>
        </TableCell>
        <TableCell>
          {isEditing ? (
            <TextField
              inputProps={{ className: 'tableCell' }}
              className="tableCell"
              placeholder="stock mínimo"
              inputRef={textRef}
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
        <TableCell>{article.stockActual}</TableCell>
        <TableCell>$ {article.precioCompra}</TableCell>
        <TableCell>{article.codigoBarras}</TableCell>
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
              disabled={openNewLote || (isEditingSubRow && !isEditing)}
            >
              {isEditing ? <Save /> : <Edit />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Añadir lote">
            <IconButton
              onClick={() => {
                setOpen(true);
                setOpenNewLote(true);
                setIsEditingSubRow(true);
              }}
              disabled={openNewLote || isEditing || isEditingSubRow}
            >
              <AddCircleIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={8} sx={{ padding: 0 }}>
          <Collapse in={open} unmountOnExit>
            <SubItemsTable
              article={article.listaArticuloExistente}
              setOpenNewLote={setOpenNewLote}
              isEditingSubRow={isEditingSubRow}
              setIsEditingSubRow={setIsEditingSubRow}
              openNewLote={openNewLote}
              idArticle={article.id}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

interface SubItemsTableProps {
  article: IExistingArticleList[];
  idArticle: string;
  setOpenNewLote: Function;
  openNewLote: boolean;
  isEditingSubRow: boolean;
  setIsEditingSubRow: Function;
}
const SubItemsTable: React.FC<SubItemsTableProps> = ({
  idArticle,
  article,
  openNewLote,
  setOpenNewLote,
  isEditingSubRow,
  setIsEditingSubRow,
}) => {
  const textLoteDateRef = useRef<HTMLTextAreaElement>();
  const textStockRef = useRef<HTMLTextAreaElement>();
  const textCodeRef = useRef<HTMLTextAreaElement>();
  const dateNow = Date.now();
  const today = new Date(dateNow);
  const year = today.getFullYear();
  let month = (today.getMonth() + 1).toString().padStart(2, '0');
  let day = today.getDate().toString().padStart(2, '0');
  const todayFormatted = `${year}/${month}/${day}`;
  const expireDate = article.at(0)?.fechaCaducidad === '01/01/4000';
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
    const areAllFieldsFilled =
      //textEntryDateRef.current?.value &&
      (textLoteDateRef.current?.value || expireDate) && textStockRef.current?.value && textCodeRef.current?.value;
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
    const barCodeValue = textCodeRef.current?.value || '';
    const expireDateValue = expireDate ? textLoteDateRef?.current?.value : '4000-01-01';
    const newLoteObject = {
      id_almacen: useWarehouseTabsNavStore.getState().warehouseData.id,
      id_ordenCompra: null,
      articulos: [
        {
          id_articulo: idArticle,
          fechaCaducidad: expireDateValue || '4000-01-01',
          cantidad: Number(stockValue),
          codigoBarras: barCodeValue,
        },
      ],
    };
    try {
      await addArticlesToWarehouse(newLoteObject);
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
              key={a.Id_ArticuloExistente}
              idArticle={idArticle}
              isEditingSubRow={isEditingSubRow}
              setIsEditingSubRow={setIsEditingSubRow}
            />
          ))}
        </TableBody>
      </Table>
      {openNewLote && (
        <Stack sx={{ display: 'flex', width: '100%' }} key={`artEd${article.at(0)?.Id_ArticuloExistente}`}>
          <TableRow key={`artEdr${article.at(0)?.Id_ArticuloExistente}`}>
            <TableCell align="center">Nuevo Lote:</TableCell>
            <TableCell width={'20%'} align="center">
              <Typography variant="subtitle2">Fecha de caducidad</Typography>
              <Stack flexDirection={'row'}>
                <TextField
                  onChange={handleTextFieldChange}
                  disabled={expireDate}
                  type="date"
                  placeholder="Fecha de caducidad"
                  inputRef={textLoteDateRef}
                  inputProps={{ min: todayFormatted }}
                />
              </Stack>
            </TableCell>
            <TableCell width={'20%'} align="center">
              <Typography variant="subtitle2">Cantidad</Typography>
              <TextField
                onChange={handleTextFieldChange}
                placeholder="Cantidad Entrada"
                inputRef={textStockRef}
                error={amountError}
                helperText={!!amountError && 'Escribe una cantidad correcta'}
              />
            </TableCell>
            <TableCell width={'20%'} align="center">
              <Typography variant="subtitle2">Código de barras</Typography>
              <TextField onChange={handleTextFieldChange} placeholder="Código de Barras" inputRef={textCodeRef} />
            </TableCell>
            <TableCell width={'12%'} align="center">
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
        </Stack>
      )}
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
  const textLoteDateRef = useRef<HTMLTextAreaElement>();
  const textStockRef = useRef<HTMLTextAreaElement>();
  const textCodeRef = useRef<HTMLTextAreaElement>();
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
            Id_Articulo_Lote: loteId,
            Id_Almacen: useWarehouseTabsNavStore.getState().warehouseData.id,
            Id_Articulo: idArticle,
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
        } else {
          withReactContent(Swal).fire({
            title: 'Operación cancelada',
            icon: 'info',
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
          const fechaNueva = `${yearL}/${monthL.padStart(2, '0')}/${dayL.padStart(2, '0')}`;
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
      Id_Articulo_Lote: articleR.Id_ArticuloExistente,
      Id_Articulo: idArticle,
      CodigoBarras: textCodeRef.current?.value || undefined,
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
    <TableRow key={articleR.Id_ArticuloExistente}>
      <StyledTableCell align="center">{articleR.fechaCompraLote}</StyledTableCell>
      {isEditing ? (
        <>
          <StyledTableCell width={'80%'} align="center">
            <Stack flexDirection={'row'}>
              <TextField
                disabled={expireDate}
                type="date"
                placeholder="Fecha de caducidad"
                inputRef={textLoteDateRef}
                inputProps={{ min: todayFormatted }}
              />
            </Stack>
          </StyledTableCell>
          <StyledTableCell width={'80%'} align="center">
            <TextField placeholder="Cantidad Entrada" inputRef={textStockRef} />
          </StyledTableCell>
        </>
      ) : (
        <>
          <StyledTableCell align="center">{returnExpireDate(articleR.fechaCaducidad)}</StyledTableCell>
          <StyledTableCell align="center">{articleR.cantidad}</StyledTableCell>
        </>
      )}
      <StyledTableCell align="center">
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
              deleteLote(articleR.Id_ArticuloExistente);
            }}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </StyledTableCell>
    </TableRow>
  );
};
