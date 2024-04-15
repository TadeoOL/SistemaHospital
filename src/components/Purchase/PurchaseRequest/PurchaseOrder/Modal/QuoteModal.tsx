import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  Collapse,
  IconButton,
  Modal,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { addBillQuote, changeOrderStatus, deleteBillQuote, getBillPdf } from '../../../../../api/api.routes';
import { KeyboardArrowUp, CloudUpload, KeyboardArrowDown, Close, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { convertBase64 } from '../../../../../utils/functions/dataUtils';
import { usePurchaseOrderRequestModals } from '../../../../../store/purchaseStore/purchaseOrderRequestModals';
import { Provider, SingleProvider } from '../../../../../types/types';
import { useDropzone } from 'react-dropzone';
import { useShallow } from 'zustand/react/shallow';
import { usePurchaseOrderPagination } from '../../../../../store/purchaseStore/purchaseOrderPagination';

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
  providers: SingleProvider[];
};

const renderStepForm = (providers: SingleProvider[], id: string, open: Function) => {
  return <QuotePdf providers={providers} purchaseRequestId={id} setOpen={open} />;
};

const useFetchPdfProviders = (providers: SingleProvider[], id: string) => {
  const [providersData, setProvidersData] = useState<Array<Provider & { pdf: string | null }>>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const results = [];
      for (const provider of providers) {
        try {
          const pdf = await getBillPdf(id);
          if (provider.estatus === 1) {
            results.push({
              id: id,
              proveedor: {
                id_Proveedor: provider.id_Proveedor,
                nombre: provider.nombre,
                estatus: provider.estatus,
              },
              pdf: null,
            });
          } else {
            results.push({
              id: id,
              proveedor: {
                id_Proveedor: provider.id_Proveedor,
                nombre: provider.nombre,
                estatus: provider.estatus,
              },
              pdf: pdf,
            });
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
      setProvidersData(results);
    };
    fetch();
  }, [providers]);

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
      <HeaderModal title={'Solicitud No. ' + idFolio.folio} setOpen={open} />
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

export const QuotePdf = (props: { providers: SingleProvider[]; purchaseRequestId: string; setOpen: Function }) => {
  const { providers, purchaseRequestId } = props;
  const { providersData, isLoading } = useFetchPdfProviders(providers, purchaseRequestId);
  const setProviderSelected = usePurchaseOrderRequestModals(useShallow((state) => state.setProviderSelected));
  const [viewPdf, setViewPdf] = useState(false);
  const [pdfOpen, setPdfOpen] = useState('');
  const [providerQuoteRequest, setProviderQuoteRequest] = useState('');
  const [openCollapse, setOpenCollapse] = useState<{ [key: string]: boolean }>({});
  const [providersClone, setProvidersClone] = useState<typeof providersData>(structuredClone(providersData));
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    if (!providersData) return;
    // providersData.length > 1
    // 	? setIsManyProviders(true)
    // 	: setIsManyProviders(false);
    setProvidersClone(providersData);
  }, [providersData]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return toast.error('Error: Solo se puede adjuntar 1 archivo .pdf!');
      const base64 = await convertBase64(acceptedFiles[0]);
      const existingFile = providersClone?.find((file) => file.id === providerQuoteRequest && file.pdf === null);
      if (existingFile) {
        try {
          await addBillQuote(providerQuoteRequest, base64);
          await changeOrderStatus(purchaseRequestId, 2);
          usePurchaseOrderPagination.getState().fetch();
          setProvidersClone((prev) =>
            prev?.map((file) =>
              file.id === providerQuoteRequest && file.pdf === null ? { ...file, pdf: base64 } : file
            )
          );
          toast.success('Archivo subido con éxito!');
          setInputKey((prevKey) => prevKey + 1);
        } catch (error) {
          console.log(error);
          toast.error('Error al subir el documento pdf!');
        }
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
      <Stack spacing={1} sx={{ mt: 4 }}>
        {providersClone?.map((quoteRequest) => (
          <Stack key={quoteRequest.id}>
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                justifyContent: 'space-between',
                bgcolor: '#EDEDED',
                p: 1,
                borderRadius: 2,
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {openCollapse[quoteRequest.id] ? (
                  <IconButton
                    onClick={() =>
                      setOpenCollapse({
                        [quoteRequest.id]: !openCollapse[quoteRequest.id],
                      })
                    }
                  >
                    <KeyboardArrowUp />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      setOpenCollapse({
                        [quoteRequest.id]: !openCollapse[quoteRequest.id],
                      });
                      setProviderQuoteRequest(quoteRequest.id);
                      setProviderSelected(quoteRequest.proveedor.id_Proveedor);
                    }}
                  >
                    <KeyboardArrowDown />
                  </IconButton>
                )}
                <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                  {quoteRequest.pdf ? 'Ver PDF' : ' Subir PDF'}
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Proveedor: {quoteRequest.proveedor.nombre}</Typography>
            </Box>
            <Collapse in={openCollapse[quoteRequest.id]} sx={{ px: 2 }}>
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
                      setPdfOpen(quoteRequest.pdf as string);
                      setViewPdf(true);
                    }}
                    variant="outlined"
                    sx={{ p: 6 }}
                  >
                    {'Factura - ' + quoteRequest.proveedor.nombre}
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
            </Collapse>
          </Stack>
        ))}
      </Stack>
      <Modal open={viewPdf} onClose={() => setViewPdf(false)}>
        <Stack
          sx={{
            display: 'flex',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={() => setViewPdf(false)}>
              <Close />
            </IconButton>
          </Box>
          <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={() => setViewPdf(false)}>
            <Box
              sx={{
                display: 'flex',
                flex: 10,
                mx: 7,
                mb: 3,
              }}
            >
              <embed
                src={pdfOpen}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </Box>
          </ClickAwayListener>
        </Stack>
      </Modal>
    </>
  );
};
