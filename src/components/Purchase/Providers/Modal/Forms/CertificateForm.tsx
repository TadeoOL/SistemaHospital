import { Box, Grid, TextField } from "@mui/material";
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
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            error={!!errors.urlCertificadoBP}
            helperText={errors?.urlCertificadoBP?.message}
            {...register("urlCertificadoBP")}
            label="Certificado buenas practicas de manofactura"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            error={!!errors.urlCertificadoCR}
            helperText={errors?.urlCertificadoCR?.message}
            {...register("urlCertificadoCR")}
            label="Certificado de cumplimiento regulatorio"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            error={!!errors.urlCertificadoISO9001}
            helperText={errors?.urlCertificadoISO9001?.message}
            {...register("urlCertificadoISO9001")}
            label="Certificado ISO 9001"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
