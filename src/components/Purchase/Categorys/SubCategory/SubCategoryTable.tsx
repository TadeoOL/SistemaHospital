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
import { useSubCategoryPagination } from "../../../../store/purchaseStore/subCategoryPagination";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { disableSubCategory } from "../../../../api/api.routes";
import { ModifySubCategoryModal } from "./Modal/ModifySubCategoryModal";
import { ISubCategory } from "../../../../types/types";

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
    handleChangeSubCategory,
  } = useSubCategoryPagination(
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
      handleChangeSubCategory: state.handleChangeSubCategory,
    }),
    shallow
  );

  useEffect(() => {
    fetchCategories(pageIndex, pageSize, search, enabled);
  }, [pageIndex, pageSize, search, enabled, handleChangeSubCategory]);

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

const useDisableSubCategory = () => {
  const { setHandleChangeSubCategory, enabled, handleChangeSubCategory } =
    useSubCategoryPagination(
      (state) => ({
        setHandleChangeSubCategory: state.setHandleChangeSubCategory,
        enabled: state.enabled,
        handleChangeSubCategory: state.handleChangeSubCategory,
      }),
      shallow
    );

  const disableProviderModal = (categoryId: string) => {
    withReactContent(Swal)
      .fire({
        title: "Estas seguro?",
        text: `Estas a punto de ${
          enabled ? "deshabilitar" : "habilitar"
        } una sub categoría`,
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
            await disableSubCategory(categoryId);
            setHandleChangeSubCategory(!handleChangeSubCategory);
            withReactContent(Swal).fire({
              title: `${enabled ? "Deshabilitado!" : "Habilitado!"}`,
              text: `La sub categoría se ha ${
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
              } la sub categoría`,
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

export const SubCategoryTable = () => {
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
  const disableSubCategory = useDisableSubCategory();
  const [subCategory, setSubCategory] = useState<ISubCategory | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  // const handlePageChange = useCallback((event: any, value: any) => {
  //   setPageIndex(value);
  // }, []);

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

  const handlePageChange = useCallback((event: any, value: any) => {
    setPageIndex(value);
  }, []);

  return (
    <>
      <Card sx={{ m: 2 }}>
        <Table stickyHeader sx={{ position: "static" }}>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0
              ? null
              : isLoading
              ? null
              : data.map((subCategory) => {
                  const { id, nombre, categoria, descripcion } = subCategory;

                  return (
                    <TableRow
                      key={id}
                      onClick={() => {}}
                      sx={{
                        "&:hover": { cursor: "pointer", bgcolor: "whitesmoke" },
                      }}
                    >
                      <TableCell>{nombre}</TableCell>
                      <TableCell sx={{ maxWidth: 400 }}>
                        {descripcion}
                      </TableCell>
                      <TableCell>{categoria.nombre}</TableCell>
                      <TableCell>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            sx={{ color: "neutral.700" }}
                            onClick={(e) => {
                              setSubCategory(subCategory);
                              setOpenEditModal(true);
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
                              disableSubCategory(id);
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
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <div>
          <ModifySubCategoryModal data={subCategory} open={setOpenEditModal} />
        </div>
      </Modal>
    </>
  );
};
