import { Stack } from '@mui/material';
import { PatientInvoice } from '../../components/Invoice/PatientInvoice/PatientInvoice';
import { InvoiceTabs } from '../../components/Invoice/InvoiceTabs';
import { useInvoiceTabStore } from '../../store/invoice/invoiceTab';
import { HospitalInvoice } from '../../components/Invoice/HospitalInvoice/HospitalInvoice';

const InvoiceView = () => {
  const tabValue = useInvoiceTabStore((state) => state.tabValue);

  const InvoiceViewRender: Record<number, JSX.Element> = {
    0: <PatientInvoice />,
    1: <HospitalInvoice />,
  };

  return (
    <Stack>
      <InvoiceTabs />
      {InvoiceViewRender[tabValue]}
    </Stack>
  );
};

export default InvoiceView;
