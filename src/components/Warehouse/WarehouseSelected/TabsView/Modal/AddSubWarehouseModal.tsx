import {
  Autocomplete,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import { HeaderModal } from "../../../../Account/Modals/SubComponents/HeaderModal";
import { useSubWarehousePaginationStore } from "../../../../../store/warehouseStore/subWarehousePagination";
import { useShallow } from "zustand/react/shallow";
import { useGetUsersBySearch } from "../../../../../hooks/useGetUsersBySearch";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ISubWarehouse } from "../../../../../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWarehouseTabsNavStore } from "../../../../../store/warehouseStore/warehouseTabsNav";
import { addNewSubWarehouseSchema } from "../../../../../schema/schemas";
import { addNewSubWarehouse } from "../../../../../api/api.routes";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 380 },
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
};

const OPTIONS_LIMIT = 5;
const filterOptions = createFilterOptions<string>({
  limit: OPTIONS_LIMIT,
});

interface AddSubWarehouseModalProps {
  setOpen: Function;
}

export const AddSubWarehouseModal = (props: AddSubWarehouseModalProps) => {
  const { setSearchUser, fetchSubWarehouse } = useSubWarehousePaginationStore(
    useShallow((state) => ({
      setSearchUser: state.setSearchUser,
      fetchSubWarehouse: state.fetchSubWarehouse,
    }))
  );
  const warehouseData = useWarehouseTabsNavStore(
    useShallow((state) => state.warehouseData)
  );
  const { isLoadingUsers, usersRes } = useGetUsersBySearch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ISubWarehouse>({
    resolver: zodResolver(addNewSubWarehouseSchema),
  });

  const onSubmit: SubmitHandler<ISubWarehouse> = async (data) => {
    try {
      const object = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        Id_UsuarioEncargado: data.usuarioEncargado,
        esSubAlmacen: true,
        Id_AlmacenPrincipal: warehouseData.id,
      };
      await addNewSubWarehouse(object);
      fetchSubWarehouse();
      props.setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={style}>
      <HeaderModal title="Agregar nuevo SubAlmacén" setOpen={props.setOpen} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4} sx={{ bgcolor: "background.paper", p: 2, pl: 4 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle1">Nombre del SubAlmacén</Typography>
              <TextField
                fullWidth
                placeholder="SubAlmacén"
                size="small"
                sx={{ width: "90%" }}
                {...register("nombre")}
                error={!!errors.nombre}
                helperText={errors?.nombre?.message}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1">Descripción</Typography>
              <TextField
                fullWidth
                placeholder="Descripción"
                multiline
                sx={{ width: "90%" }}
                {...register("descripcion")}
                error={!!errors.descripcion}
                helperText={errors?.descripcion?.message}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1">
                Encargado de SubAlmacén
              </Typography>
              <Controller
                control={control}
                name="usuarioEncargado"
                render={({ field: { onChange, value } }) => {
                  const controlledValue = value !== undefined ? value : null;
                  return (
                    <Autocomplete
                      disablePortal
                      fullWidth
                      filterOptions={filterOptions}
                      onChange={(e, val) => {
                        e.stopPropagation();
                        onChange(val);
                      }}
                      loading={isLoadingUsers && usersRes.length === 0}
                      getOptionLabel={(option) => {
                        const res = usersRes.find(
                          (u) => u.id === option
                        )?.nombre;
                        if (res) return res;
                        return "";
                      }}
                      options={usersRes.flatMap((r) => r.id)}
                      value={controlledValue}
                      noOptionsText="No se encontraron usuarios"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Usuarios"
                          sx={{ width: "90%" }}
                          required={false}
                          error={!!errors.usuarioEncargado}
                          helperText={errors?.usuarioEncargado?.message}
                          onChange={(e) => {
                            setSearchUser(e.target.value);
                          }}
                        />
                      )}
                    />
                  );
                }}
              />
            </Box>
          </Stack>
          <Box
            sx={{
              display: "flex",
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button variant="outlined" color="error">
              Cancelar
            </Button>
            <Button variant="contained" type="submit">
              Aceptar
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};
