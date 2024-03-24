// import {
//   Backdrop,
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   MenuItem,
//   Stack,
//   TextField,
// } from "@mui/material";
// import { HeaderModal } from "../../../../Account/Modals/SubComponents/HeaderModal";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { addExistingArticle } from "../../../../../schema/schemas";
// import { IExistingArticle } from "../../../../../types/types";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import {
//   getExistingArticleById,
// } from "../../../../../api/api.routes";
// import { useGetArticles } from "../../../../../hooks/useGetArticles";
// import { useGetAlmacenes } from "../../../../../hooks/useGetAlmacenes";
// import { useExistingArticlePagination } from "../../../../../store/warehouseStore/existingArticlePagination";
// import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
// import CancelIcon from "@mui/icons-material/Cancel";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: { xs: 380, md: 600 },
//   bgcolor: "background.paper",
//   borderRadius: 8,
//   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//   display: "flex",
//   flexDirection: "column",
//   maxHeight: 600,
//   overflowY: "auto",
//   "&::-webkit-scrollbar": {
//     width: "0.4em",
//   },
//   "&::-webkit-scrollbar-track": {
//     boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
//     webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
//   },
//   "&::-webkit-scrollbar-thumb": {
//     backgroundColor: "rgba(0,0,0,.1)",
//     outline: "1px solid slategrey",
//   },
// };

interface IModifyCategoryModal {
  open: Function;
  existingArticleId: string;
}

// const useFetchExistingArticle = (existingArticleId: string) => {
//   const [isLoadingExistingArticle, setIsLoadingExistingArticle] =
//     useState(true);
//   const [existingArticle, setArticle] = useState<IExistingArticle | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoadingExistingArticle(true);
//       try {
//         const data = await getExistingArticleById(existingArticleId);
//         setArticle(data);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setIsLoadingExistingArticle(false);
//       }
//     };
//     fetchData();
//   }, [existingArticleId]);
//   return { isLoadingExistingArticle, existingArticle };
// };

export const ModifyExistingArticleModal: React.FC<
  IModifyCategoryModal
> = ({}) => {
  // const { open, existingArticleId } = props;
  // const { isLoadingExistingArticle, existingArticle } =
  //   useFetchExistingArticle(existingArticleId);
  // const {
  //   id,
  //   almacen,
  //   factor,
  //   fechaCaducidad,
  //   fechaCompra,
  //   precioCompra,
  //   precioVenta,
  //   cantidad,
  // } = existingArticle ?? {};
  // const [almacenState, setAlmacenState] = useState("");
  // const [article, setArticle] = useState("");
  // const { articles, isLoadingArticles } = useGetArticles();
  // const { isLoadingAlmacenes, almacenes } = useGetAlmacenes();

  // const { handleChangeExistingArticle, setHandleChangeExistingArticle } =
  //   useExistingArticlePagination((state) => ({
  //     setHandleChangeExistingArticle: state.setHandleChangeExistingArticle,
  //     handleChangeExistingArticle: state.handleChangeExistingArticle,
  //   }));

  // const {
  //   register,
  //   handleSubmit,
  //   getValues,
  //   setValue,
  //   formState: { errors },
  // } = useForm<IExistingArticle>({
  //   defaultValues: {
  //     id: id,
  //     fechaCaducidad: fechaCaducidad,
  //     fechaCompra: fechaCompra,
  //     factor: factor,
  //     precioVenta: precioVenta,
  //     precioCompra: precioCompra,
  //     almacen: almacen,
  //     cantidad: cantidad,
  //   },
  //   resolver: zodResolver(addExistingArticle),
  // });

  // useEffect(() => {
  //   if (existingArticle) {
  //     if (!almacenState) setAlmacenState(existingArticle.almacen.id);
  //     if (!article) setArticle(existingArticle.articulo.id);
  //     setValue("id_almacen", existingArticle.almacen.id);
  //     setValue("id_articulo", existingArticle.articulo.id);
  //     Object.entries(existingArticle).forEach(([key, value]) => {
  //       setValue(key as keyof IExistingArticle, String(value));
  //     });
  //   }
  // }, [existingArticle, setValue]);

  // const handleError = (err: any) => {
  //   console.log({ err });
  // };
  // const onSubmit: SubmitHandler<IExistingArticle> = async (data) => {
  //   try {
  //     const idForm = getValues("id");
  //     await modifyExistingArticle({ ...data, id: idForm });
  //     setHandleChangeExistingArticle(!handleChangeExistingArticle);
  //     toast.success("Articulo existente modificado con éxito!");
  //     open(false);
  //   } catch (error) {
  //     toast.error("Error al modificar el articulo existente!");
  //   }
  // };

  // const handleChange = (event: any) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setAlmacenState(value);
  // };

  // if (isLoadingExistingArticle || isLoadingArticles || isLoadingAlmacenes)
  //   return (
  //     <Backdrop open>
  //       <CircularProgress />
  //     </Backdrop>
  //   );

  return (
    <></>
    // <Box sx={style}>
    //   <HeaderModal setOpen={open} title="Modificar articulo" />
    //   <form noValidate onSubmit={handleSubmit(onSubmit, handleError)}>
    //     <Stack spacing={3} sx={{ p: 4 }}>
    //       <Grid component="span" container spacing={2}>
    //         <Grid item xs={12} md={6}>
    //           <TextField
    //             fullWidth
    //             size="small"
    //             select
    //             label="Articulo"
    //             error={!!errors.id_articulo}
    //             helperText={errors?.id_articulo?.message}
    //             {...register("id_articulo")}
    //             value={article}
    //             onChange={handleChange}
    //           >
    //             {articles.map((data) => (
    //               <MenuItem value={data.id} key={data.id}>
    //                 {data.nombre}
    //               </MenuItem>
    //             ))}
    //           </TextField>
    //         </Grid>
    //         <Grid item xs={12} md={6}>
    //           <TextField
    //             fullWidth
    //             error={!!errors.cantidad}
    //             size="small"
    //             placeholder="Cantidad"
    //             {...register("cantidad")}
    //             helperText={errors.cantidad?.message}
    //           />
    //         </Grid>
    //         <Grid item xs={12} md={6}>
    //           <TextField
    //             fullWidth
    //             error={!!errors.precioCompra}
    //             helperText={errors?.precioCompra?.message}
    //             size="small"
    //             placeholder="Precio de compra"
    //             {...register("precioCompra")}
    //           />
    //         </Grid>
    //         <Grid item xs={12} md={6}>
    //           <TextField
    //             fullWidth
    //             error={!!errors.precioVenta}
    //             helperText={errors?.precioVenta?.message}
    //             size="small"
    //             placeholder="Precio de venta"
    //             {...register("precioVenta")}
    //           />
    //         </Grid>
    //         <Grid item xs={12} md={6}>
    //           <TextField
    //             fullWidth
    //             error={!!errors.fechaCompra}
    //             helperText={errors?.fechaCompra?.message}
    //             size="small"
    //             type="date"
    //             InputLabelProps={{ shrink: true }}
    //             label="Fecha de compra"
    //             {...register("fechaCompra")}
    //           />
    //         </Grid>
    //         <Grid item xs={12} md={6}>
    //           <TextField
    //             fullWidth
    //             error={!!errors.fechaCaducidad}
    //             helperText={errors?.fechaCaducidad?.message}
    //             size="small"
    //             type="date"
    //             InputLabelProps={{ shrink: true }}
    //             label="Fecha de caducidad"
    //             {...register("fechaCaducidad")}
    //           />
    //         </Grid>
    //         <Grid item xs={12} md={6}>
    //           <TextField
    //             fullWidth
    //             size="small"
    //             select
    //             label="Categoría"
    //             error={!!errors.id_almacen}
    //             helperText={errors?.id_almacen?.message}
    //             {...register("id_almacen")}
    //             value={almacenState}
    //             onChange={handleChange}
    //           >
    //             {almacenes.map((data) => (
    //               <MenuItem value={data.id} key={data.id}>
    //                 {data.nombre}
    //               </MenuItem>
    //             ))}
    //           </TextField>
    //         </Grid>
    //         <Grid item xs={12} md={6}>
    //           <TextField
    //             fullWidth
    //             error={!!errors.factor}
    //             helperText={errors?.factor?.message}
    //             size="small"
    //             placeholder="Factor"
    //             {...register("factor")}
    //           />
    //         </Grid>
    //       </Grid>
    //       <Stack
    //         sx={{
    //           flexDirection: "row",
    //           columnGap: 2,
    //           justifyContent: "space-between",
    //         }}
    //       >
    //         <Button
    //           variant="outlined"
    //           color="error"
    //           startIcon={<CancelIcon />}
    //           onClick={() => open(false)}
    //         >
    //           Cancelar
    //         </Button>
    //         <Button
    //           variant="contained"
    //           type="submit"
    //           startIcon={<SaveOutlinedIcon />}
    //         >
    //           Guardar
    //         </Button>
    //       </Stack>
    //     </Stack>
    //   </form>
    // </Box>
  );
};
