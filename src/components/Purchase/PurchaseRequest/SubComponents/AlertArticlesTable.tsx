import {
  Box,
  Card,
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useArticlesAlertPagination } from "../../../../store/purchaseStore/articlesAlertPagination";
import { shallow } from "zustand/shallow";
import { useCallback, useEffect, useState } from "react";
import { IArticlesAlert } from "../../../../types/types";

const useGetAllData = () => {
  const {
    isLoading,
    count,
    data,
    enabled,
    fetchArticlesAlert,
    pageIndex,
    pageSize,
    search,
    setPageIndex,
    setPageSize,
    handleChangeArticlesAlert,
    checkedArticles,
    setCheckedArticles,
  } = useArticlesAlertPagination(
    (state) => ({
      pageIndex: state.pageIndex,
      pageSize: state.pageSize,
      count: state.count,
      fetchArticlesAlert: state.fetchArticlesAlert,
      search: state.search,
      enabled: state.enabled,
      data: state.data,
      setPageSize: state.setPageSize,
      setPageIndex: state.setPageIndex,
      isLoading: state.isLoading,
      handleChangeArticlesAlert: state.handleChangeArticlesAlert,
      checkedArticles: state.checkedArticles,
      setCheckedArticles: state.setCheckedArticles,
    }),
    shallow
  );

  useEffect(() => {
    fetchArticlesAlert();
  }, [pageIndex, pageSize, search, enabled, handleChangeArticlesAlert]);

  return {
    isLoading,
    data: data as IArticlesAlert[],
    enabled,
    count,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    checkedArticles,
    setCheckedArticles,
  };
};

export const AlertArticlesTable = () => {
  const {
    count,
    data,
    isLoading,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    checkedArticles,
    setCheckedArticles,
  } = useGetAllData();

  const handlePageChange = useCallback((event: any, value: any) => {
    setPageIndex(value);
  }, []);

  const handleUserChecked = (e: any) => {
    const { value, checked } = e.target;
    if (checked) {
      setCheckedArticles([...checkedArticles, value]);
    } else {
      setCheckedArticles(checkedArticles.filter((item) => item !== value));
    }
  };
  console.log({ checkedArticles });

  const handleIsUserChecked = (userId: string) => {
    if (checkedArticles.some((user) => user === userId)) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    return () => {
      setCheckedArticles([]);
    };
  }, []);

  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell>Articulo</TableCell>
            <TableCell>Cantidad a comprar</TableCell>
            <TableCell>Cantidad de stock</TableCell>
            <TableCell>Departamento proveniente</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox
                  onChange={handleUserChecked}
                  value={item.id_Articulo}
                />
              </TableCell>
              <TableCell>{item.nombreArticulo}</TableCell>
              <TableCell>{item.cantidadComprar}</TableCell>
              <TableCell>{item.cantidadStock}</TableCell>
              <TableCell>{item.departamentoProveniente}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isLoading && data.length === 0 && (
        <Box sx={{ display: "flex", flex: 1, justifyContent: "center", p: 4 }}>
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
      <TablePagination
        component="div"
        count={count}
        onPageChange={handlePageChange}
        onRowsPerPageChange={(e: any) => {
          setPageSize(e.target.value);
        }}
        page={pageIndex}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Card>
  );
};
