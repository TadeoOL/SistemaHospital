import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useCallback, useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { shallow } from "zustand/shallow";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useCategoryPagination } from "../../../../store/purchaseStore/categoryPagination";
import { ModifySubCategoryModal } from "./Modal/ModifyCategoryModal";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { disableCategory } from "../../../../api/api.routes";

const useGetAllData = () => {
  const {
    isLoading,
    count,
    data,
    enabled,
    fetchCategories,
    pageIndex,
    pageSize,
    search,
    setPageIndex,
    setPageSize,
    handleChangeCategory,
  } = useCategoryPagination(
    (state) => ({
      pageIndex: state.pageIndex,
      pageSize: state.pageSize,
      count: state.count,
      fetchCategories: state.fetchCategories,
      search: state.search,
      enabled: state.enabled,
      data: state.data,
      setPageSize: state.setPageSize,
      setPageIndex: state.setPageIndex,
      isLoading: state.isLoading,
      handleChangeCategory: state.handleChangeCategory,
    }),
    shallow
  );

  useEffect(() => {
    fetchCategories(pageIndex, pageSize, search, enabled);
  }, [pageIndex, pageSize, search, enabled, handleChangeCategory]);

  return {
    isLoading,
    data,
    enabled,
    count,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
  };
};

const useDisableCategory = () => {
  const { setHandleChangeCategory, enabled, handleChangeCategory } =
    useCategoryPagination(
      (state) => ({
        setHandleChangeCategory: state.setHandleChangeCategory,
        enabled: state.enabled,
        handleChangeCategory: state.handleChangeCategory,
      }),
      shallow
    );

  const disableProviderModal = (categoryId: string) => {
    withReactContent(Swal)
      .fire({
        title: "Estas seguro?",
        text: `Estas a punto de ${
          enabled ? "deshabilitar" : "habilitar"
        } una categoría`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Si, ${enabled ? "deshabilitala!" : "habilitala!"}`,
        confirmButtonColor: "red",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await disableCategory(categoryId);
            setHandleChangeCategory(!handleChangeCategory);
            withReactContent(Swal).fire({
              title: `${enabled ? "Deshabilitado!" : "Habilitado!"}`,
              text: `La categoría se ha ${
                enabled ? "deshabilitado" : "habilitado"
              }`,
              icon: "success",
            });
          } catch (error) {
            console.log(error);
            withReactContent(Swal).fire({
              title: "Error!",
              text: `No se pudo ${
                enabled ? "deshabilitar" : "habilitar"
              } la categoría`,
              icon: "error",
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          withReactContent(Swal).fire({
            title: "Cancelado",
            icon: "error",
          });
        }
      });
  };

  return disableProviderModal;
};

export const CategoryTable = () => {
  const {
    data,
    enabled,
    isLoading,
    count,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
  } = useGetAllData();
  const disableCategory = useDisableCategory();
  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(false);

  const handlePageChange = useCallback((event: any, value: any) => {
    setPageIndex(value);
  }, []);

  // const handleUserChecked = (e: any) => {
  //   const { value, checked } = e.target;

  //   if (checked) {
  //     setIsChecked([...isChecked, value]);
  //   } else {
  //     setIsChecked(isChecked.filter((item) => item !== value));
  //   }
  // };

  // const handleIsUserChecked = (userId: string) => {
  //   if (isChecked.some((user) => user === userId)) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  return (
    <>
      <Card sx={{ m: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0
              ? null
              : isLoading
              ? null
              : data.map((category) => {
                  const { id, nombre, descripcion } = category;

                  return (
                    <TableRow
                      key={id}
                      onClick={() => {}}
                      sx={{
                        "&:hover": { cursor: "pointer", bgcolor: "whitesmoke" },
                      }}
                    >
                      <TableCell>{nombre}</TableCell>
                      <TableCell>{descripcion}</TableCell>
                      <TableCell>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            sx={{ color: "neutral.700" }}
                            onClick={(e) => {
                              setCategory(category);
                              setOpen(true);
                              e.stopPropagation();
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={enabled ? "Deshabilitar" : "Habilitar"}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              disableCategory(id);
                              e.stopPropagation();
                            }}
                          >
                            {enabled ? (
                              <RemoveCircleIcon sx={{ color: "red" }} />
                            ) : (
                              <CheckIcon sx={{ color: "green" }} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
        {isLoading && (
          <Box
            sx={{ display: "flex", flex: 1, justifyContent: "center", p: 4 }}
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
        {
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
        }
      </Card>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div>
          <ModifySubCategoryModal data={category} open={setOpen} />
        </div>
      </Modal>
    </>
  );
};
