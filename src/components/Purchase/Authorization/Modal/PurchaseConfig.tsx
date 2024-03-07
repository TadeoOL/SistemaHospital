import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetPurchaseConfig } from "../../../../hooks/useGetPurchaseConfig";
import { useEffect, useState } from "react";
import { IFactor, IPurchaseConfig } from "../../../../types/types";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNewFactorSchema } from "../../../../schema/schemas";
import { modifyPurchaseConfig } from "../../../../api/api.routes";
import { isValidInteger } from "../../../../utils/functions/dataUtils";

const styleInput = {
  paddingTop: "0.4rem",
  paddingBottom: "0.4rem",
};

export const PurchaseConfig = () => {
  const { isLoadingPurchaseConfig, config, isError, refetch } =
    useGetPurchaseConfig();
  const [configPurchase, setConfigPurchase] = useState<IPurchaseConfig>();
  const [value, setValue] = useState("");
  const [addNewFactor, setAddNewFactor] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [directlyTender, setDirectlyTender] = useState("");

  useEffect(() => {
    if (isLoadingPurchaseConfig) return;
    setConfigPurchase(config);
    setValue(config.cantidadOrdenDirecta.toString());
    setDirectlyTender(config.cantidadLicitacionDirecta.toString());
  }, [isLoadingPurchaseConfig]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFactor>({
    defaultValues: {
      cantidadMinima: "",
      cantidadMaxima: "",
      factorMultiplicador: "",
    },
    resolver: zodResolver(addNewFactorSchema),
  });

  const onSubmitNewFactor: SubmitHandler<IFactor> = async (data) => {
    const isOverlapping = configPurchase?.factor.some(
      (factor) =>
        (data.cantidadMinima >= factor.cantidadMinima &&
          data.cantidadMinima <= factor.cantidadMaxima) ||
        (data.cantidadMaxima >= factor.cantidadMinima &&
          data.cantidadMaxima <= factor.cantidadMaxima)
    );
    const isFactorDuplicated = configPurchase?.factor.some(
      (factor) => factor.factorMultiplicador === data.factorMultiplicador
    );

    if (!isOverlapping && !isFactorDuplicated) {
      setConfigPurchase((prevConfig) => {
        if (prevConfig) {
          return {
            ...prevConfig,
            factor: [...prevConfig.factor, data],
          };
        } else {
          return prevConfig;
        }
      });
      setAddNewFactor(false);
      setHasChanges(true);
      reset();
    } else {
      if (isOverlapping) {
        toast.error("El nuevo factor se superpone con un factor existente.");
      }
      if (isFactorDuplicated) {
        toast.error(
          "El factor multiplicador ya existe en los factores existentes."
        );
      }
    }
  };

  const handleModifyConfig = async () => {
    setIsLoading(true);
    if (!configPurchase) return;
    const object: IPurchaseConfig = {
      cantidadOrdenDirecta: parseFloat(value),
      factor: configPurchase.factor,
      cantidadLicitacionDirecta: parseFloat(directlyTender),
    };

    try {
      await modifyPurchaseConfig(object);
      toast.success("Configuración modificada con éxito!");
      refetch();
      setHasChanges(false);
    } catch (error) {
      console.log(error);
      toast.error("Error al modificar la configuración!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoadingPurchaseConfig) return;
    const hasConfigChanges = () => {
      if (!config || !configPurchase) return false;
      if (parseFloat(value) !== config.cantidadOrdenDirecta) {
        return true;
      }
      if (parseFloat(directlyTender) !== config.cantidadLicitacionDirecta) {
        return true;
      }
      if (config.factor.length !== configPurchase.factor.length) {
        return true;
      }

      for (let i = 0; i < config.factor.length; i++) {
        const factor1 = config.factor[i];
        const factor2 = configPurchase.factor[i];
        if (
          Number(factor1.cantidadMinima) !== Number(factor2.cantidadMinima) ||
          Number(factor1.cantidadMaxima) !== Number(factor2.cantidadMaxima) ||
          Number(factor1.factorMultiplicador) !==
            Number(factor2.factorMultiplicador)
        ) {
          return true;
        }
      }

      return false;
    };

    setHasChanges(hasConfigChanges());
  }, [isLoadingPurchaseConfig, config, value, directlyTender, configPurchase]);

  const handleDelete = (factor: string | number) => {
    setHasChanges(true);
    if (!configPurchase) return;
    setConfigPurchase((prevConfig) => {
      if (prevConfig) {
        return {
          ...prevConfig,
          factor: configPurchase?.factor.filter(
            (f) => f.factorMultiplicador !== factor
          ),
        };
      } else {
        return prevConfig;
      }
    });
  };

  if (!isLoadingPurchaseConfig && isError) {
    toast.error("Ha habido un error!");
    return null;
  }
  if (isLoadingPurchaseConfig || !{ configPurchase })
    return (
      <Box sx={{ display: "flex", flex: 1, justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  return (
    <Box
      sx={{
        boxShadow: 10,
        borderRadius: 2,
        bgcolor: "white",
      }}
    >
      <Stack
        sx={{
          display: "flex",
          p: 4,
          bgcolor: "background.paper",
          borderRadius: "20px",
          borderColor: "black",
        }}
      >
        <Typography fontWeight={700} fontSize={24} mb={3}>
          Configuración de compras
        </Typography>
        <form noValidate onSubmit={handleSubmit(onSubmitNewFactor)}>
          <Stack
            sx={{
              display: "flex",
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
              columnGap: addNewFactor ? 2 : 0,
              mb: 2,
            }}
          >
            <Collapse in={addNewFactor} orientation="horizontal">
              <Stack
                spacing={{ xs: 1, md: 0 }}
                sx={{
                  flexDirection: { md: "row", xs: "column" },
                  columnGap: 3,
                }}
              >
                <Tooltip title="Cantidad minima">
                  <TextField
                    inputProps={{
                      style: {
                        ...styleInput,
                      },
                    }}
                    type="number"
                    size="small"
                    placeholder="Cantidad minima"
                    {...register("cantidadMinima")}
                    error={!!errors.cantidadMinima && addNewFactor}
                    helperText={
                      errors.cantidadMinima && addNewFactor
                        ? errors?.cantidadMinima?.message
                        : null
                    }
                  />
                </Tooltip>
                <Tooltip title="Cantidad maxima">
                  <TextField
                    inputProps={{
                      style: {
                        ...styleInput,
                      },
                    }}
                    type="number"
                    size="small"
                    placeholder="Cantidad maxima"
                    {...register("cantidadMaxima")}
                    error={!!errors.cantidadMaxima && addNewFactor}
                    helperText={
                      errors.cantidadMaxima && addNewFactor
                        ? errors?.cantidadMaxima?.message
                        : null
                    }
                  />
                </Tooltip>
                <Tooltip title="Factor">
                  <TextField
                    inputProps={{
                      style: {
                        ...styleInput,
                      },
                    }}
                    type="number"
                    size="small"
                    placeholder="Factor"
                    {...register("factorMultiplicador")}
                    error={!!errors.factorMultiplicador && addNewFactor}
                    helperText={
                      errors.factorMultiplicador && addNewFactor
                        ? errors?.factorMultiplicador?.message
                        : null
                    }
                  />
                </Tooltip>
              </Stack>
            </Collapse>
            <Stack spacing={1} sx={{ display: "flex", flex: 1 }}>
              <Box>
                <Button
                  fullWidth={addNewFactor ? true : false}
                  variant="contained"
                  type={addNewFactor ? "submit" : "button"}
                  onClick={(e) => {
                    if (addNewFactor) {
                      e.stopPropagation();
                    } else {
                      setAddNewFactor(true);
                      e.preventDefault();
                    }
                  }}
                >
                  {addNewFactor ? "Guardar" : "Nuevo factor"}
                </Button>
              </Box>
              <Collapse in={addNewFactor}>
                <Button
                  fullWidth={addNewFactor ? true : false}
                  variant="outlined"
                  onClick={() => setAddNewFactor(false)}
                >
                  Cancelar
                </Button>
              </Collapse>
            </Stack>
          </Stack>
        </form>

        <Typography sx={{ fontSize: 18, fontWeight: 500 }}>Factores</Typography>
        <Box sx={{ overflowY: "auto" }}>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: 2, borderRadius: 2, maxHeight: 250 }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rango</TableCell>
                  <TableCell>Factor</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {configPurchase?.factor.map((i) => (
                  <TableRow key={i.factorMultiplicador}>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      ${i.cantidadMinima} a ${i.cantidadMaxima}
                    </TableCell>
                    <TableCell>{i.factorMultiplicador}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(i.factorMultiplicador);
                          setHasChanges(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Grid spacing={2} container sx={{ mt: 4 }}>
          <Grid item xs={12} md={3}>
            <Typography>Cantidad maxima para orden directa:</Typography>
          </Grid>
          <Grid item xs={12} md={9}>
            <TextField
              size="medium"
              placeholder="Cantidad para orden directa"
              value={value}
              inputProps={{
                style: {
                  ...styleInput,
                },
              }}
              onChange={(e) => {
                if (!isValidInteger(e.target.value)) return;
                setValue(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography>Cantidad minima para licitación directa:</Typography>
          </Grid>
          <Grid item xs={12} md={9}>
            <TextField
              size="medium"
              placeholder="Cantidad para licitación"
              value={directlyTender}
              inputProps={{
                style: {
                  ...styleInput,
                },
              }}
              onChange={(e) => {
                if (!isValidInteger(e.target.value)) return;
                setDirectlyTender(e.target.value);
              }}
            />
          </Grid>
        </Grid>
        {hasChanges && (
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "red" }}>
              *Tienes cambios efectuados no guardados*
            </Typography>
            <Typography sx={{ fontSize: 10, fontWeight: 400, color: "red" }}>
              Nota: Los cambios no guardados se perderán en caso de salir de
              esta ventana.
            </Typography>
          </Box>
        )}
        <Stack
          sx={{
            mt: 4,
            display: "flex",
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/* <Button disabled={isLoading} variant="outlined">
            Cancelar
          </Button> */}
          <Button
            disabled={isLoading}
            variant="contained"
            onClick={() => handleModifyConfig()}
          >
            Guardar
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
