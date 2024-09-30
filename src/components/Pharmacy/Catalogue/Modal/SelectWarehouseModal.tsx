import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  createFilterOptions,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { Save, Cancel } from '@mui/icons-material';
import { IWarehouseData } from '../../../../types/types';
import { getWarehouseById } from '../../../../api/api.routes';
import { usePosTabNavStore } from '../../../../store/pharmacy/pointOfSale/posTabNav';
import { useExistingArticlePagination } from '../../../../store/warehouseStore/existingArticlePagination';
import { useWarehouseMovementPaginationStore } from '../../../../store/warehouseStore/movimientoAlmacenPaginacion';
import { useNurseRequestPaginationStore } from '../../../../store/pharmacy/nurseRequest/nurseRequestPagination';

const OPTIONS_LIMIT = 20;
const filterArticleOptions = createFilterOptions<IWarehouseData>({
  limit: OPTIONS_LIMIT,
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, md: 900 },

  borderRadius: 8,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 600,
};

const style2 = {
  bgcolor: 'background.paper',
  overflowY: 'auto',
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
  },
};

export const SelectWarehouseModal = (props: { setOpen: Function }) => {
  const [isLoadingWarehouse, setIsLoadingWarehouse] = useState(true);
  const [warehouses, setWarehouses] = useState<IWarehouseData[]>([]);
  const [warehouseSelected, setWarehouseSelected] = useState<IWarehouseData | null>(null);
  const warehouseIdSeted: string = usePosTabNavStore((state) => state.warehouseId);
  const fetchExistingArticles = useExistingArticlePagination((state) => state.fetchExistingArticles);
  const setWarehouseId = useExistingArticlePagination((state) => state.setWarehouseId);
  const setPrincipalWarehouseId = useExistingArticlePagination((state) => state.setPrincipalWarehouseId);
  const fetchWareHouseMovements = useWarehouseMovementPaginationStore((state) => state.fetchWarehouseMovements);
  const fetchData = useNurseRequestPaginationStore((state) => state.fetchData);

  useEffect(() => {
    const fetchWarehouse = async () => {
      const warehouseInfo = await getWarehouseById(warehouseIdSeted);
      const allWarehouses = [warehouseInfo, ...warehouseInfo.subAlmacenes];
      setWarehouseSelected(allWarehouses[0]);
      setIsLoadingWarehouse(false);
      setWarehouses(allWarehouses);
    };
    fetchWarehouse();
  }, []);
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Seleccion de almacen" />
      {isLoadingWarehouse ? (
        <Box
          sx={{
            bgcolor: 'background.paper',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            width: '100%',
            height: 300,
          }}
        >
          <CircularProgress size={40} sx={{ my: 'auto' }} />
        </Box>
      ) : (
        <Box sx={style2}>
          {
            <form noValidate onSubmit={/*handleSubmit(onSubmit)*/ () => {}}>
              <Stack sx={{ display: 'flex', flex: 1, p: 2, backgroundColor: 'white' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'space-between',
                    columnGap: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    rowGap: { xs: 2, sm: 0 },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flex: 1,
                      justifyContent: 'space-between',
                      columnGap: 2,
                      flexDirection: { xs: 'column', sm: 'row' },
                      rowGap: { xs: 2, sm: 0 },
                    }}
                  >
                    <Stack sx={{ display: 'flex', flex: 1 }}>
                      <Typography sx={{ fontWeight: 500, fontSize: 14 }}>Busqueda de almacen</Typography>
                      <Autocomplete
                        disablePortal
                        fullWidth
                        filterOptions={filterArticleOptions}
                        onChange={(e, val) => {
                          e.stopPropagation();
                          if (val !== null) {
                            setWarehouseSelected(val);
                          }
                        }}
                        getOptionLabel={(option) => option.nombre}
                        options={warehouses}
                        value={warehouseSelected}
                        noOptionsText="No se encontraron almacenes"
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Almacenes" sx={{ width: '100%' }} />
                        )}
                      />
                    </Stack>
                  </Box>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                ></Box>
                <Box
                  sx={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'space-between',
                    mt: 2,
                    bottom: 0,
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    color="error"
                    onClick={() => {
                      props.setOpen(false);
                      localStorage.setItem;
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    endIcon={<Save />}
                    disabled={warehouseSelected === null}
                    onClick={() => {
                      console.log('guardar');
                      localStorage.setItem('pharmacyWarehouse_Selected', JSON.stringify(warehouseSelected));
                      props.setOpen(false);
                      setWarehouseId(warehouseSelected?.id_Almacen ?? warehouseIdSeted);
                      fetchData(false, warehouseSelected?.id_Almacen ?? warehouseIdSeted);
                      if (warehouseSelected && warehouseSelected?.esSubAlmacen) {
                        setPrincipalWarehouseId(warehouseSelected.id_AlmacenPrincipal ?? warehouseIdSeted);
                        fetchWareHouseMovements(warehouseSelected.id_Almacen ?? warehouseIdSeted);
                      } else {
                        setPrincipalWarehouseId(warehouseSelected?.id_Almacen ?? warehouseIdSeted);
                      }
                      fetchExistingArticles();
                      //onSubmit();
                    }}
                  >
                    Aceptar
                  </Button>
                </Box>
              </Stack>
            </form>
          }
        </Box>
      )}
    </Box>
  );
};
