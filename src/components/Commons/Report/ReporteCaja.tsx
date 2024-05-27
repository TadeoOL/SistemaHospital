import { useCallback, useState } from 'react';
import { openBase64InNewTab } from '../../../utils/functions/dataUtils';
import { Backdrop, Button } from '@mui/material';
import { ReportLoader } from './ReportLoader';
import { obtenerReporteCaja } from '../../../services/reports/reporteCajaService';

export const ReporteCaja = (props: any) => {
  const { id_CajaPrincipal } = props;
  const [isLoading, setIsLoading] = useState(false);
  const handleGenerateReportChildren = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await obtenerReporteCaja(id_CajaPrincipal);
      openBase64InNewTab(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <Button variant="contained" onClick={handleGenerateReportChildren}>
        Generar Reporte de Caja
      </Button>
      <Backdrop open={isLoading}>
        <ReportLoader />
      </Backdrop>
    </>
  );
};
