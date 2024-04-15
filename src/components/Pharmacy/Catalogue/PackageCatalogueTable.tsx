import { Edit, ExpandLess, ExpandMore, Info, Save, Warning } from "@mui/icons-material";
import { Box, Stack, Card, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, TablePagination, Modal, Collapse, IconButton, TextField, Tooltip } from "@mui/material";
import { ArticlesView } from "../../Warehouse/WarehouseSelected/TabsView/Modal/ArticlesOutput";
import { IArticlesPackage, IExistingArticleList } from "../../../types/types";
import { warning } from "framer-motion";
import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useShallow } from "zustand/react/shallow";
import { modifyMinStockExistingArticle } from "../../../api/api.routes";
import { useExistingArticlePagination } from "../../../store/warehouseStore/existingArticlePagination";
import { useWarehouseTabsNavStore } from "../../../store/warehouseStore/warehouseTabsNav";
import { returnExpireDate } from "../../../utils/expireDate";
import { isValidInteger } from "../../../utils/functions/dataUtils";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export const PackageCatalogueTable = () => {
    const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>({});

    const mockdatitafaaack : IArticlesPackage[] = [
        {
            id:'123',
            nombre:'combo parto',
            contenido: {
                proceso_destinado: 'Quirofano',
                articulos_contenidos:[
                    {
                        id_articulo: 'nosewe',
                        cantidad: 2,
                    },
                    {
                        id_articulo: 'no we',
                        cantidad: 2,
                    },
                    {
                        id_articulo: 'q nowe',
                        cantidad: 1,
                    }
                ]
            }
        },
        {
            id:'1234',
            nombre:'combo cuates',
            contenido: {
                proceso_destinado: 'Quirofano',
                articulos_contenidos:[
                    {
                        id_articulo: 'nosewe2',
                        cantidad: 2,
                    },
                    {
                        id_articulo: 'no we2',
                        cantidad: 2,
                    },
                    {
                        id_articulo: 'bueno pues si',
                        cantidad: 1,
                    }
                ]
            }
        },
    ]
/*
                articulos_contenidos:[
                    {
                        id_articulo: 'nosewe',
                        cantidad: 2,
                }
            ], */
    return (
        <>
          <Stack sx={{ overflowX: 'auto' }}>
            <Stack spacing={2} sx={{ minWidth: 950 }}>
              <Card>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nombre paquete</TableCell>
                        <TableCell>Proceso Destinado</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    {<TableBody>
                      {mockdatitafaaack && mockdatitafaaack.map((pack) => (
                        <React.Fragment>
                            <TableRow>
                          <TableCell sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            {!viewArticles[pack.id] ? (
                              <IconButton
                                onClick={() =>
                                  setViewArticles({
                                    [pack.id]: !viewArticles[pack.id],
                                  })
                                }
                              >
                                <ExpandMoreIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() =>
                                  setViewArticles({
                                    [pack.id]: !viewArticles[pack.id],
                                  })
                                }
                              >
                                <ExpandLessIcon />
                              </IconButton>
                            )}
                            <Typography> {pack.nombre} </Typography>
                          </TableCell>
                          <TableCell> {pack.contenido.proceso_destinado} </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={7} sx={{ p: 0 }}>
                            <Collapse in={viewArticles[pack.id]}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="center">Articulo</TableCell>
                                    <TableCell align="center">Cantidad</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {pack.contenido?.articulos_contenidos &&
                                    pack.contenido?.articulos_contenidos.length > 0 &&
                                    pack.contenido?.articulos_contenidos.map((articleInPackage) => (
                                      <TableRow key={articleInPackage.nombre}>
                                        <TableCell align="center">{articleInPackage.nombre}</TableCell>
                                        <TableCell align="center">{articleInPackage.cantidad}</TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                        </React.Fragment>
                      ))}
                    </TableBody>}
                  </Table>
                  {/*!data ||
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
                    ))*/}
                  {/*<TablePagination
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
                  />*/}
                </TableContainer>
              </Card>
            </Stack>
          </Stack>
          {/*<Modal open={openModal} onClose={() => setOpenModal(!openModal)}>
            <>
              <ArticlesView setOpen={setOpenModal} />
            </>
          </Modal>*/}
        </>
      );
  };
  /*
  interface TableRowComponentProps {
    article: IArticlesPackage;
  }
  const TableRowComponent: React.FC<TableRowComponentProps> = ({ article }) => {
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
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
                {article.contenido.articulos_contenidos && article.contenido.articulos_contenidos.length > 0 && !open ? (
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
          <TableCell>
            <IconButton
              onClick={() => {
                if (isEditing) {
                  handleSaveValue();
                }
                setIsEditing(!isEditing);
              }}
            >
              {isEditing ? <Save /> : <Edit />}
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={8} sx={{ padding: 0 }}>
            <Collapse in={open} unmountOnExit>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };
  */