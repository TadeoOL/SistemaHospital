import { Box, Grid, MenuItem, TextField } from "@mui/material";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IProvider } from "../../../../../types/types";
import { useState } from "react";

interface IFiscalForm {
  errors: FieldErrors<IProvider>;
  register: UseFormRegister<IProvider>;
  tipoContribuyente?: number;
}

const personType = [
  { value: 0, label: "Seleccionar" },
  { value: 1, label: "Física" },
  { value: 2, label: "Moral" },
];

export const FiscalForm = (props: IFiscalForm) => {
  const [contri, setContri] = useState(props.tipoContribuyente || 0);
  const { errors, register } = props;

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            error={!!errors.rfc}
            helperText={errors?.rfc?.message}
            {...register("rfc")}
            placeholder="RFC"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            error={!!errors.nif}
            helperText={errors?.nif?.message}
            {...register("nif")}
            placeholder="NIF"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            error={!!errors.giroEmpresa}
            helperText={errors?.giroEmpresa?.message}
            {...register("giroEmpresa")}
            placeholder="Giro de la empresa"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            error={!!errors.direccionFiscal}
            helperText={errors?.direccionFiscal?.message}
            {...register("direccionFiscal")}
            placeholder="Dirección fiscal"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            error={!!errors.tipoContribuyente}
            helperText={errors?.tipoContribuyente?.message}
            {...register("tipoContribuyente")}
            placeholder="Tipo de contribuyente"
            select
            onChange={(e: any) => {
              setContri(e.target.value);
            }}
            value={contri}
          >
            {personType.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
};
