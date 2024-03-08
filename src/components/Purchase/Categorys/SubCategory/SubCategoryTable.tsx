import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { useSubCategoryPagination } from "../../../../store/purchaseStore/subCategoryPagination";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { disableSubCategory } from "../../../../api/api.routes";
import { ModifySubCategoryModal } from "./Modal/ModifySubCategoryModal";
import { TableComponent } from "../../../TableComponent";

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
        title: "Advertencia",
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
  const disableSubCategory = useDisableSubCategory();

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

  return (
    <TableComponent
      disableHook={disableSubCategory}
      fetchDataHook={useGetAllData}
      modifyModalComponent={(props) => (
        <ModifySubCategoryModal data={props.data} open={props.open} />
      )}
    />
  );
};
