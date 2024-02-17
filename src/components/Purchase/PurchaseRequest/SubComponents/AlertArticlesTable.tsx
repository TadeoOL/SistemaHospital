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
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useArticlesAlertPagination } from "../../../../store/purchaseStore/articlesAlertPagination";
import { shallow } from "zustand/shallow";
import React, { useCallback, useEffect } from "react";
import { IArticlesAlert } from "../../../../types/types";

const useGetAllData = () => {
  const {
    isLoading,
    data,
    fetchArticlesAlert,
    checkedArticles,
    setCheckedArticles,
    alertArticlesChecked,
    setAlertArticlesChecked,
    setStep,
    articlesPurchased,
    setArticlesPurchased,
    handleOpen,
    setHandleOpen,
  } = useArticlesAlertPagination(
    (state) => ({
      fetchArticlesAlert: state.fetchArticlesAlert,
      data: state.data,
      isLoading: state.isLoading,
      checkedArticles: state.checkedArticles,
      setCheckedArticles: state.setCheckedArticles,
      setAlertArticlesChecked: state.setAlertArticlesChecked,
      alertArticlesChecked: state.alertArticlesChecked,
      setStep: state.setStep,
      articlesPurchased: state.articlesPurchased,
      setArticlesPurchased: state.setArticlesPurchased,
      handleOpen: state.handleOpen,
      setHandleOpen: state.setHandleOpen,
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
    alertArticlesChecked,
    setAlertArticlesChecked,
    setStep,
    articlesPurchased,
    setArticlesPurchased,
    handleOpen,
    setHandleOpen,
  };
};

export const AlertArticlesTable = () => {
  const {
    data,
    isLoading,
    checkedArticles,
    setCheckedArticles,
    setAlertArticlesChecked,
    alertArticlesChecked,
    setStep,
    articlesPurchased,
    setArticlesPurchased,
    handleOpen,
    setHandleOpen,
  } = useGetAllData();

  const handleUserChecked = (
    idArticulo: string,
    idAlerta: string,
    cantidadComprar: number,
    precioInventario: number,
    checked: boolean
  ) => {
    const objectArticle = {
      id_articulo: idArticulo,
      cantidadComprar: cantidadComprar,
      precioInventario: precioInventario,
    };
    if (checked) {
      setCheckedArticles([
        ...checkedArticles,
        { idAlerta: idAlerta, idArticulo: idArticulo },
      ]);
      setAlertArticlesChecked([...alertArticlesChecked, idAlerta]);
      setArticlesPurchased([...articlesPurchased, objectArticle]);
    } else {
      setCheckedArticles(
        checkedArticles.filter((item) => item.idAlerta !== idAlerta)
      );
      setAlertArticlesChecked(
        alertArticlesChecked.filter((item) => item !== idAlerta)
      );
      setArticlesPurchased(
        articlesPurchased.filter((item) => item.id_articulo !== idArticulo)
      );
    }
  };
  console.log({ checkedArticles });

  const handleIsArticleChecked = useCallback(
    (articleId: string, alertId: string) => {
      if (
        checkedArticles.some(
          (article) =>
            article.idArticulo === articleId && article.idAlerta === alertId
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
    [checkedArticles]
  );

  useEffect(() => {
    return () => {
      setCheckedArticles([]);
      setAlertArticlesChecked([]);
      setArticlesPurchased([]);
      setStep(0);
    };
  }, []);

  const handleSelectAllArticles = (idAlmacen: string, isChecked: boolean) => {
    const articlesToSelect =
      data.find((alert) => alert.id_Almacen === idAlmacen)?.articulos || [];
    articlesToSelect.forEach((item) => {
      handleUserChecked(
        item.id_Articulo,
        item.id_AlertaCompra,
        item.cantidadComprar,
        item.precioInventario,
        isChecked
      );
    });
  };

  console.log({ data });

  if (isLoading) return <CircularProgress />;
  return (
    <Stack spacing={4} sx={{ p: 2 }}>
      {data.map((alert, index) => (
        <React.Fragment key={alert.id_Almacen}>
          <Stack
            sx={{
              flexDirection: "row",
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-between",
              alignItems: "end",
            }}
          >
            <Typography variant="subtitle2">
              Almacen: {alert.nombreAlmacen}
            </Typography>
            <Button variant="contained" onClick={() => setHandleOpen(true)}>
              Solicitar orden de compra
            </Button>
          </Stack>
          <Card>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      onChange={(event) =>
                        handleSelectAllArticles(
                          alert.id_Almacen,
                          event.target.checked
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>Articulo</TableCell>
                  <TableCell>Cantidad a comprar</TableCell>
                  <TableCell>Cantidad de stock</TableCell>
                  <TableCell>Unidad de medida</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alert.articulos.map((item) => (
                  <TableRow key={item.id_AlertaCompra}>
                    <TableCell>
                      <Checkbox
                        onChange={(event) =>
                          handleUserChecked(
                            item.id_Articulo,
                            item.id_AlertaCompra,
                            item.cantidadComprar,
                            item.precioInventario,
                            event.target.checked
                          )
                        }
                        checked={handleIsArticleChecked(
                          item.id_Articulo,
                          item.id_AlertaCompra
                        )}
                      />
                    </TableCell>
                    <TableCell>{item.nombreArticulo}</TableCell>
                    <TableCell>{item.cantidadComprar}</TableCell>
                    <TableCell>{item.cantidadStock}</TableCell>
                    <TableCell>{item.unidadMedida}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {isLoading && data.length === 0 && (
              <Box
                sx={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "center",
                  p: 4,
                }}
              >
                <CircularProgress />
              </Box>
            )}
            {data.length === 0 && !isLoading && (
              <Card
                sx={{
                  display: "flex",
                  flexGrow: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  p: 2,
                  columnGap: 1,
                }}
              >
                <ErrorOutlineIcon
                  sx={{ color: "neutral.400", width: "40px", height: "40px" }}
                />
                <Typography
                  sx={{ color: "neutral.400" }}
                  fontSize={24}
                  fontWeight={500}
                >
                  No existen registros
                </Typography>
              </Card>
            )}
          </Card>
          {index === data.length - 1 ? null : <Divider sx={{ my: 6 }} />}
        </React.Fragment>
      ))}
    </Stack>
  );
};
