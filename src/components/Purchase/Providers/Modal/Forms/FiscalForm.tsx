import { Box, Grid, TextField, Typography } from "@mui/material";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IProvider } from "../../../../../types/types";

interface IFiscalForm {
  errors: FieldErrors<IProvider>;
  register: UseFormRegister<IProvider>;
}

export const FiscalForm = (props: IFiscalForm) => {
  const { errors, register } = props;
  return (
    <Box>
      <Typography fontWeight={700} fontSize={18}>
        Información fiscal
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            error={!!errors.rfc}
            helperText={errors?.rfc?.message}
            {...register("rfc")}
            label="RFC"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            error={!!errors.numIdentificacionFiscal}
            helperText={errors?.numIdentificacionFiscal?.message}
            {...register("numIdentificacionFiscal")}
            label="NIF"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            error={!!errors.giroEmpresa}
            helperText={errors?.giroEmpresa?.message}
            {...register("giroEmpresa")}
            label="Giro de la empresa"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            error={!!errors.direccionFiscal}
            helperText={errors?.direccionFiscal?.message}
            {...register("direccionFiscal")}
            label="Dirección fiscal"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            error={!!errors.tipoContribuyente}
            helperText={errors?.tipoContribuyente?.message}
            {...register("tipoContribuyente")}
            label="Tipo de contribuyente"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
