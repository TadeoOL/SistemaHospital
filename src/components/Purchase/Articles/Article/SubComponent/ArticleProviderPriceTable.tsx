import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useArticleProviderPagination } from "../../../../../store/purchaseStore/articleProviderPagination";
import { TableComponent } from "../../../../TableComponent";
import { useGetArticlesProviders } from "../../../../../hooks/useGetArticleProviders";
import { useArticlePagination } from "../../../../../store/purchaseStore/articlePagination";

const useDisableArticle = () => {
  const { setHandleChangeArticle, enabled, handleChangeArticle } =
    useArticlePagination(
      (state) => ({
        setHandleChangeArticle: state.setHandleChangeArticle,
        enabled: state.enabled,
        handleChangeArticle: state.handleChangeArticle,
      }),
      shallow
    );

  const disableProviderModal = (articleId: string) => {
    withReactContent(Swal)
      .fire({
        title: "Estas seguro?",
        text: `Estas a punto de ${
          enabled ? "deshabilitar" : "habilitar"
        } un articulo`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Si, ${enabled ? "deshabilitalo!" : "habilitalo!"}`,
        confirmButtonColor: "red",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            // await disableArticle(articleId);
            setHandleChangeArticle(!handleChangeArticle);
            withReactContent(Swal).fire({
              title: `${enabled ? "Deshabilitado!" : "Habilitado!"}`,
              text: `El articulo se ha ${
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
              } El articulo`,
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

export const ArticleProvidersTable = () => {
  const disableArticle = useDisableArticle();

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
        fetchDataHook={useGetArticlesProviders}
        modifyModalComponent={(props) => (
          //   <ModifyArticleModal articleId={props.data} open={props.open} />
          <></>
        )}
        isArticleProvider={true}
      />
    </>
  );
};
