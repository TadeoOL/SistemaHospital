import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useCallback, useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { ModifyProviderModal } from './Modal/ModifyProviderModal';
import { ProvidersInfoModal } from './Modal/ProvidersInfoModal';
import { useProviderPagination } from '../../../store/purchaseStore/providerPagination';
import { shallow } from 'zustand/shallow';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { disableProvider } from '../../../api/api.routes';
import { SortComponent } from '../../Commons/SortComponent';

const useDisableProvider = () => {
  const { setHandleChangeProvider, enabled, handleChangeProvider } = useProviderPagination(
    (state) => ({
      setHandleChangeProvider: state.setHandleChangeProvider,
      enabled: state.enabled,
      handleChangeProvider: state.handleChangeProvider,
    }),
    shallow
  );

  const disableProviderModal = (userId: string) => {
    withReactContent(Swal)
      .fire({
        title: 'Advertencia',
        text: `Estas a punto de ${enabled ? 'deshabilitar' : 'habilitar'} un proveedor`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `${enabled ? 'Deshabilitar' : 'Habilitar'}`,
        confirmButtonColor: 'red',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await disableProvider(userId);
            setHandleChangeProvider(!handleChangeProvider);
            withReactContent(Swal).fire({
              title: `${enabled ? 'Deshabilitado!' : 'Habilitado!'}`,
              text: `El proveedor se ha ${enabled ? 'deshabilitado' : 'habilitado'}`,
              icon: 'success',
            });
          } catch (error) {
            console.log(error);
            withReactContent(Swal).fire({
              title: 'Error!',
              text: `No se pudo ${enabled ? 'deshabilitar' : 'habilitar'} al proveedor`,
              icon: 'error',
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          withReactContent(Swal).fire({
            title: 'Cancelado',
            icon: 'error',
          });
        }
      });
  };

  return disableProviderModal;
};

export const ProvidersTable = () => {
  const disableProviderModal = useDisableProvider();
  const [providerId, setProviderId] = useState<string>('');
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const {
    pageIndex,
    pageSize,
    count,
    fetchProviders,
    search,
    enabled,
    data,
    setPageSize,
    setPageIndex,
    isLoading,
    handleChangeProvider,
    setSort,
    sort,
  } = useProviderPagination(
    (state) => ({
      pageIndex: state.pageIndex,
      pageSize: state.pageSize,
      count: state.count,
      fetchProviders: state.fetchProviders,
      search: state.search,
      enabled: state.enabled,
      data: state.data,
      setPageSize: state.setPageSize,
      setPageIndex: state.setPageIndex,
      isLoading: state.isLoading,
      handleChangeProvider: state.handleChangeProvider,
      setSort: state.setSort,
      sort: state.sort,
    }),
    shallow
  );

  const handlePageChange = useCallback((event: any, value: any) => {
    event.stopPropagation();
    setPageIndex(value);
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [pageIndex, pageSize, search, enabled, handleChangeProvider, sort]);

  return (
    <>
      <Card sx={{ m: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={'26%'}>
                <SortComponent
                  tableCellLabel="Nombre de la Compañía"
                  headerName="nombreCompania"
                  setSortFunction={setSort}
                />
              </TableCell>
              <TableCell width={'31%'}>
                <SortComponent
                  tableCellLabel="Nombre del Contacto"
                  headerName="nombreContacto"
                  setSortFunction={setSort}
                />
              </TableCell>
              <TableCell width={'10%'}>
                <SortComponent tableCellLabel="Teléfono" headerName="telefono" setSortFunction={setSort} />
              </TableCell>
              <TableCell width={'36%'}>
                <SortComponent
                  tableCellLabel="Correo Electrónico"
                  headerName="correoElectronico"
                  setSortFunction={setSort}
                />
              </TableCell>

              <TableCell width={'7%'}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0
              ? null
              : isLoading
                ? null
                : data.map((provider) => {
                    const { id, nombreCompania, nombreContacto, correoElectronico, telefono } = provider;

                    return (
                      <TableRow
                        key={id}
                        onClick={() => {
                          setOpenInfoModal(true);
                          setProviderId(provider.id);
                        }}
                        sx={{
                          '&:hover': {
                            cursor: 'pointer',
                            bgcolor: 'whitesmoke',
                          },
                        }}
                      >
                        <TableCell>{nombreCompania}</TableCell>
                        <TableCell>{nombreContacto}</TableCell>
                        <TableCell>{telefono}</TableCell>
                        <TableCell>{correoElectronico}</TableCell>
                        <TableCell>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              sx={{ color: 'neutral.700' }}
                              onClick={(e) => {
                                setProviderId(provider.id);
                                setOpenEditModal(true);
                                e.stopPropagation();
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={enabled ? 'Deshabilitar' : 'Habilitar'}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                disableProviderModal(provider.id);
                                e.stopPropagation();
                              }}
                            >
                              {enabled ? (
                                <RemoveCircleIcon sx={{ color: 'red' }} />
                              ) : (
                                <CheckIcon sx={{ color: 'green' }} />
                              )}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
          </TableBody>
        </Table>
        {isLoading && (
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {data.length === 0 && !isLoading && (
          <Card
            sx={{
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
              columnGap: 1,
            }}
          >
            <ErrorOutlineIcon sx={{ color: 'neutral.400', width: '40px', height: '40px' }} />
            <Typography sx={{ color: 'neutral.400' }} fontSize={24} fontWeight={500}>
              No existen registros
            </Typography>
          </Card>
        )}
        {
          <TablePagination
            component="div"
            count={count}
            onPageChange={handlePageChange}
            onRowsPerPageChange={(e: any) => {
              setPageSize(e.target.value);
            }}
            page={pageIndex}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Filas por página"
          />
        }
      </Card>
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <div>
          <ModifyProviderModal providerId={providerId} setOpen={setOpenEditModal} />
        </div>
      </Modal>
      <Modal open={openInfoModal} onClose={() => setOpenInfoModal(false)}>
        <div>
          <ProvidersInfoModal setOpen={setOpenInfoModal} providerId={providerId} />
        </div>
      </Modal>
    </>
  );
};
