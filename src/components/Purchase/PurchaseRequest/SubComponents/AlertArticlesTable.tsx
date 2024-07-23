import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useArticlesAlertPagination } from '../../../../store/purchaseStore/articlesAlertPagination';
import { shallow } from 'zustand/shallow';
import React, { useCallback, useEffect, useState } from 'react';
import { IArticlesAlert } from '../../../../types/types';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useAuthStore } from '../../../../store/auth';
import { useShallow } from 'zustand/react/shallow';
import { useDirectlyPurchaseRequestOrderStore } from '../../../../store/purchaseStore/directlyPurchaseRequestOrder';
import { toast } from 'react-toastify';

const useGetAllData = () => {
  const {
    isLoading,
    data,
    fetchArticlesAlert,
    checkedArticles,
    setCheckedArticles,
    setStep,
    warehouseSelected,
    cleanAllData,
  } = useArticlesAlertPagination(
    (state) => ({
      fetchArticlesAlert: state.fetchArticlesAlert,
      data: state.data,
      isLoading: state.isLoading,
      checkedArticles: state.checkedArticles,
      setCheckedArticles: state.setCheckedArticles,
      setStep: state.setStep,
      handleOpen: state.handleOpen,
      warehouseSelected: state.warehouseSelected,
      cleanAllData: state.cleanAllData,
    }),
    shallow
  );

  useEffect(() => {
    fetchArticlesAlert();
  }, []);

  return {
    isLoading,
    data: data as IArticlesAlert[],
    checkedArticles,
    setCheckedArticles,
    setStep,
    warehouseSelected,
    cleanAllData,
  };
};

export const AlertArticlesTable = () => {
  const { data, isLoading, checkedArticles, setCheckedArticles, setStep, cleanAllData } = useGetAllData();
  const isAdminPurchase = useAuthStore(useShallow((state) => state.isAdminPurchase));
  const { setOpenPurchaseRequestOrder, openPurchaseRequestOrder, setArticles, setWarehouseSelected } =
    useDirectlyPurchaseRequestOrderStore(
      (state) => ({
        setOpenPurchaseRequestOrder: state.setOpenPurchaseRequestOrder,
        openPurchaseRequestOrder: state.openPurchaseRequestOrder,
        setArticles: state.setArticles,
        setWarehouseSelected: state.setWarehouseSelected,
      }),
      shallow
    );
  const [allChecked, setAllChecked] = useState<{ [key: string]: boolean }>({});
  const [isLoadingNextStep, setIsLoadingNextStep] = useState(false);

  const handleIsArticleChecked = useCallback(
    (articleId: string, almacenId: string) => {
      if (checkedArticles.some((article) => article.idArticulo === articleId && article.idAlmacen === almacenId)) {
        return true;
      } else {
        return false;
      }
    },
    [checkedArticles]
  );

  const cleanUpAllChecks = () => {
    for (const alert of data) {
      setAllChecked((prev) => ({ ...prev, [alert.id_Almacen]: false }));
    }
  };

  useEffect(() => {
    cleanUpAllChecks();
    return () => {
      setCheckedArticles([]);
      setStep(0);
    };
  }, [data]);

  useEffect(() => {
    if (!openPurchaseRequestOrder) {
      cleanUpAllChecks();
      return cleanAllData();
    }
  }, [openPurchaseRequestOrder]);

  const handleSelectAllArticles = async (idAlmacen: string, isChecked: boolean) => {
    const articlesToSelect = data.find((alert) => alert.id_Almacen === idAlmacen)?.articulos || [];

    const newCheckedArticles = articlesToSelect.map((iterator) => ({
      idAlmacen: idAlmacen,
      idAlerta: iterator.id_AlertaCompra,
      idArticulo: iterator.id_Articulo,
    }));

    const { checkedArticles: prevCheckedArticles } = useArticlesAlertPagination.getState();

    useArticlesAlertPagination.setState({
      checkedArticles: isChecked
        ? [...prevCheckedArticles, ...newCheckedArticles]
        : prevCheckedArticles.filter(
            (item) => !newCheckedArticles.some((newItem) => newItem.idAlerta === item.idAlerta)
          ),
    });
  };

  const handleUserChecked = (idAlmacen: string, idArticulo: string, idAlerta: string, checked: boolean) => {
    const objectChecked = {
      idAlmacen: idAlmacen,
      idAlerta: idAlerta,
      idArticulo: idArticulo,
    };

    if (checked) {
      setCheckedArticles([...checkedArticles, objectChecked]);
    } else {
      setCheckedArticles(
        checkedArticles.filter((item) => item.idArticulo !== idArticulo && item.idAlmacen === idAlmacen)
      );
    }
  };

  const handlePurchaseOrder = async (idAlmacen: string) => {
    if (checkedArticles.length === 0 || checkedArticles[0].idAlmacen !== idAlmacen)
      return toast.warning('No tienes ningún articulo en alerta seleccionado');
    setIsLoadingNextStep(true);
    const articles = checkedArticles.filter((i) => i.idAlmacen === idAlmacen);
    const articlesToPurchaseFilteredByWarehouse = data
      .flatMap((alert) => {
        if (alert.id_Almacen === idAlmacen) {
          return alert.articulos.map((a) => {
            return {
              id: a.id_Articulo,
              name: a.nombreArticulo,
              amount: a.cantidadComprar,
              price: a.precioInventario,
            };
          });
        }
        return [];
      })
      .filter((a) => articles.some((ac) => a.id === ac.idArticulo));
    useArticlesAlertPagination.setState({
      warehouseSelected: idAlmacen,
    });
    setWarehouseSelected(idAlmacen);
    setArticles(articlesToPurchaseFilteredByWarehouse);
    setOpenPurchaseRequestOrder(true);
    setIsLoadingNextStep(false);
  };

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  return (
    <Stack spacing={4} sx={{ p: 2 }}>
      {data.map((alert, index) => (
        <React.Fragment key={alert.id_Almacen}>
          <Stack
            sx={{
              flexDirection: 'row',
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'space-between',
              alignItems: 'end',
            }}
          >
            <Typography variant="h4">Almacen: {alert.nombreAlmacen}</Typography>

            {!isAdminPurchase() && (
              <Button
                variant="contained"
                disabled={isLoadingNextStep}
                startIcon={<ShoppingBagOutlinedIcon />}
                onClick={() => {
                  handlePurchaseOrder(alert.id_Almacen);
                }}
              >
                Solicitar orden de compra
              </Button>
            )}
          </Stack>
          <Card>
            <Table>
              <TableHead>
                <TableRow>
                  {!isAdminPurchase() && (
                    <TableCell>
                      <Checkbox
                        checked={allChecked[alert.id_Almacen] || false}
                        onChange={(event) => {
                          handleSelectAllArticles(alert.id_Almacen, event.target.checked);
                          setAllChecked((prevState) => ({
                            ...prevState,
                            [alert.id_Almacen]: event.target.checked,
                          }));
                        }}
                      />
                    </TableCell>
                  )}
                  <TableCell>Articulo en alerta</TableCell>
                  <TableCell>Cantidad a comprar</TableCell>
                  <TableCell>Cantidad de stock</TableCell>
                  <TableCell>Unidad de medida</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alert.articulos.map((item, i) => (
                  <TableRow key={i}>
                    {!isAdminPurchase() && (
                      <TableCell>
                        <Checkbox
                          onChange={(event) =>
                            handleUserChecked(
                              alert.id_Almacen,
                              item.id_Articulo,
                              item.id_AlertaCompra,
                              event.target.checked
                            )
                          }
                          checked={handleIsArticleChecked(item.id_Articulo, alert.id_Almacen)}
                        />
                      </TableCell>
                    )}
                    <TableCell>{item.nombreArticulo}</TableCell>
                    <TableCell>{item.cantidadComprar}</TableCell>
                    <TableCell>{item.cantidadStock}</TableCell>
                    <TableCell>{item.unidadMedida}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          {index === data.length - 1 ? null : <Divider sx={{ my: 6 }} />}
        </React.Fragment>
      ))}
      {isLoading && data.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            p: 4,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {data.length === 0 && !isLoading && (
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
            columnGap: 1,
          }}
        >
          <ErrorOutlineIcon sx={{ color: 'neutral.400', width: '40px', height: '40px' }} />
          <Typography sx={{ color: 'neutral.400' }} fontSize={24} fontWeight={500}>
            No existen registros
          </Typography>
        </Box>
      )}
    </Stack>
  );
};
