import { Box, Grid, TextField, Typography } from "@mui/material";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IProvider } from "../../../../../types/types";

interface ICertificateForm {
  errors: FieldErrors<IProvider>;
  register: UseFormRegister<IProvider>;
}

export const CertificateForm = (props: ICertificateForm) => {
  const { errors, register } = props;
  return (
    <Box>
      <Typography fontWeight={700} fontSize={18}>
        Certificaciones
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            error={!!errors.certificacionBP}
            helperText={errors?.certificacionBP?.message}
            {...register("certificacionBP")}
            label="Certificado buenas practicas de manofactura"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            error={!!errors.certificacionCR}
            helperText={errors?.certificacionCR?.message}
            {...register("certificacionCR")}
            label="Certificado de cumplimiento regulatorio"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            error={!!errors.certificacionISO}
            helperText={errors?.certificacionISO?.message}
            {...register("certificacionISO")}
            label="Certificado ISO 9001"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
