import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  // ClickAwayListener,
  // Collapse,
  IconButton,
  Modal,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { addBillQuote, changeOrderStatus, deleteBillQuote, getBillPdf } from '../../../../../api/api.routes';
import { CloudUpload, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { convertBase64 } from '../../../../../utils/functions/dataUtils';
import { Provider } from '../../../../../types/types';
import { useDropzone } from 'react-dropzone';
import { usePurchaseOrderPagination } from '../../../../../store/purchaseStore/purchaseOrderPagination';
import { ViewPdf } from '../../../../Inputs/ViewPdf';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  display: 'flex',
  flexDirection: 'column',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 600, md: 800, lg: 800 },
};

const styleBar = {
  '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey',
    borderRadius: 10,
  },
};

type QuoteModalProps = {
  idFolio: { folio: string; OrderId: string };
  open: Function;
  providers: string;
};

const renderStepForm = (providers: string, id: string, open: Function) => {
  return <QuotePdf providers={providers} purchaseRequestId={id} setOpen={open} />;
};

const useFetchPdfProviders = (provider: string, id: string) => {
  const [providersData, setProvidersData] = useState<Array<Provider & { pdf: string | null }>>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const results = [];
      try {
        const pdf = await getBillPdf(id);
        if (pdf == null) {
          results.push({
            id: id,
            proveedor: provider,
            pdf: null,
          });
        } else {
          results.push({
            id: id,
            proveedor: provider,
            pdf: pdf,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }

      setProvidersData(results);
    };
    fetch();
  }, [provider]);

  return { providersData, isLoading };
};

export const QuoteModal = (props: QuoteModalProps) => {
  const { idFolio, open, providers } = props;
  if (!providers)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <Box sx={{ ...style }}>
      <HeaderModal title={'Folio No. ' + idFolio.folio} setOpen={open} />
      <Box sx={{ overflowY: 'auto', ...styleBar }}>
        <Box sx={{ maxHeight: 500 }}>
          <Stack
            sx={{
              px: 8,
              py: 3,
              bgcolor: 'white',
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
            }}
          >
            {renderStepForm(providers, idFolio.OrderId, open)}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export const QuotePdf = (props: { providers: string; purchaseRequestId: string; setOpen: Function }) => {
  const { providers, purchaseRequestId } = props;
  const { providersData, isLoading } = useFetchPdfProviders(providers, purchaseRequestId);
  // const setProviderSelected = usePurchaseOrderRequestModals(useShallow((state) => state.setProviderSelected));
  const [viewPdf, setViewPdf] = useState(false);
  const [pdfOpen, setPdfOpen] = useState('');
  const providerQuoteRequest = '';
  // const [openCollapse, setOpenCollapse] = useState<{ [key: string]: boolean }>({});
  const [providersClone, setProvidersClone] = useState<typeof providersData>(structuredClone(providersData));
  const inputKey = 0;

  useEffect(() => {
    if (!providersData) return;
    setProvidersClone(providersData);
  }, [providersData]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return toast.error('Error: Solo se puede adjuntar 1 archivo .pdf!');
      const base64 = await convertBase64(acceptedFiles[0]);
      try {
        await addBillQuote(purchaseRequestId, base64);
        await changeOrderStatus(purchaseRequestId, 2);
        usePurchaseOrderPagination.getState().fetch();
        setProvidersClone((prev) =>
          prev?.map((file) => (file.id === purchaseRequestId ? { ...file, pdf: base64 } : file))
        );
        toast.success('Archivo subido con éxito!');
      } catch (error) {
        console.log(error);
        toast.error('Error al subir el documento pdf!');
      }
    },
    [providerQuoteRequest, providersClone]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const handleDeleteQuote = useCallback(
    async (idQuote: string) => {
      if (!providersClone) return;
      try {
        await deleteBillQuote(idQuote);
        await changeOrderStatus(purchaseRequestId, 1);
        usePurchaseOrderPagination.getState().fetch();
        setProvidersClone((prev) => prev?.map((file) => (file.id === idQuote ? { ...file, pdf: null } : file)));
        toast.success('Factura eliminada con éxito!');
      } catch (error) {
        toast.error('Error al eliminar la factura!');
        console.log(error);
      }
    },
    [providersClone]
  );

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', m: 4 }}>
        <CircularProgress />
      </Box>
    );
  return (
    <>
      <Stack spacing={1}>
        {providersClone?.map((quoteRequest) => (
          <Stack key={quoteRequest.id}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, textAlign: 'end' }}>
              Proveedor: {quoteRequest.proveedor}
            </Typography>
            {quoteRequest.pdf ? (
              <Box
                sx={{
                  display: 'flex',
                  flex: 1,
                  justifyContent: 'center',
                  p: 1,
                }}
              >
                <Button
                  onClick={() => {
                    //codigo a copiar
                    setPdfOpen(quoteRequest.pdf as string);
                    setViewPdf(true);
                  }}
                  variant="outlined"
                  sx={{ p: 6 }}
                >
                  {'Factura - ' + quoteRequest.proveedor}
                </Button>
                <Box>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDeleteQuote(quoteRequest.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ) : (
              <Stack
                sx={{
                  my: 1,
                  p: 4,
                  border: '1px #B4B4B8 dashed',
                  borderRadius: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                {...getRootProps({ className: 'dropzone' })}
              >
                <CloudUpload sx={{ width: 40, height: 40, color: 'Gray' }} />
                <input key={inputKey} {...getInputProps()} />
                <Typography
                  sx={{
                    color: '#B4B4B8',
                    fontSize: 14,
                    fontWeight: 700,
                    textAlign: 'center',
                  }}
                >
                  Arrastra y suelta tus archivos aquí para subirlos
                </Typography>
              </Stack>
            )}
          </Stack>
        ))}
      </Stack>

      <Modal open={viewPdf} onClose={() => setViewPdf(false)}>
        <ViewPdf pdf={pdfOpen} setViewPdf={setViewPdf} />
      </Modal>
    </>
  );
};
