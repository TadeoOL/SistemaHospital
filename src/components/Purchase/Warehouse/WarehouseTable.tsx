import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useWarehousePagination } from "../../../store/purchaseStore/warehousePagination";
import { disablePurchaseWarehouse } from "../../../api/api.routes";
import { TableComponent } from "../../TableComponent";
import { ModifyPurchaseWarehouseModal } from "./Modal/ModifyWarehouseModal";

const useGetAllData = () => {
  const {
    isLoading,
    count,
    data,
    enabled,
    fetchExistingArticles,
    pageIndex,
    pageSize,
    search,
    setPageIndex,
    setPageSize,
    handleChangeWarehouse,
  } = useWarehousePagination(
    (state) => ({
      pageIndex: state.pageIndex,
      pageSize: state.pageSize,
      count: state.count,
      fetchExistingArticles: state.fetchExistingArticles,
      search: state.search,
      enabled: state.enabled,
      data: state.data,
      setPageSize: state.setPageSize,
      setPageIndex: state.setPageIndex,
      isLoading: state.isLoading,
      handleChangeWarehouse: state.handleChangeWarehouse,
    }),
    shallow
  );

  useEffect(() => {
    fetchExistingArticles(pageIndex, pageSize, search, enabled);
  }, [pageIndex, pageSize, search, enabled, handleChangeWarehouse]);

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

const useDisableExistingArticle = () => {
  const { setHandleChangeWarehouse, enabled, handleChangeWarehouse } =
    useWarehousePagination(
      (state) => ({
        setHandleChangeWarehouse: state.setHandleChangeWarehouse,
        enabled: state.enabled,
        handleChangeWarehouse: state.handleChangeWarehouse,
      }),
      shallow
    );

  const disableProviderModal = (articleId: string) => {
    withReactContent(Swal)
      .fire({
        title: "Advertencia",
        text: `Estas a punto de ${
          enabled ? "deshabilitar" : "habilitar"
        } un almacén existente`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `${enabled ? "Deshabilitar" : "Habilitar"}`,
        confirmButtonColor: "red",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await disablePurchaseWarehouse(articleId);
            setHandleChangeWarehouse(!handleChangeWarehouse);
            withReactContent(Swal).fire({
              title: `${enabled ? "Deshabilitado!" : "Habilitado!"}`,
              text: `El almacén existente se ha ${
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
              } El almacén existente`,
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

export const PurchaseWarehouseTable = () => {
  const disableArticle = useDisableExistingArticle();

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
        disableHook={disableArticle}
        fetchDataHook={useGetAllData}
        modifyModalComponent={(props) => (
          <ModifyPurchaseWarehouseModal
            warehouseId={props.data}
            open={props.open}
          />
        )}
      />
    </>
  );
};
