import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { useCategoryPagination } from "../../../../store/purchaseStore/categoryPagination";
import { ModifyCategoryModal } from "./Modal/ModifyCategoryModal";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { disableCategory } from "../../../../api/api.routes";
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
        title: "Advertencia",
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
  const disableCategory = useDisableCategory();

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
      <TableComponent
        disableHook={disableCategory}
        fetchDataHook={useGetAllData}
        modifyModalComponent={(props) => (
          <ModifyCategoryModal data={props.data} open={props.open} />
        )}
      />
    </>
  );
};
