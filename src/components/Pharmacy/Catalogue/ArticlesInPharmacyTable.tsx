import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  InputLabel,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import { Info, Warning } from '@mui/icons-material';
import { shallow } from 'zustand/shallow';
import { warning } from '../../../theme/colors';
import { useExistingArticlePagination } from '../../../store/warehouseStore/existingArticlePagination';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import { SearchBar } from '../../Inputs/SearchBar';
import { IExistingArticle, IWarehouseData } from '../../../types/types';
import { ArticlesExitModal } from './Modal/ArticlesExitModal';
import { SortComponent } from '../../Commons/SortComponent';
import { usePosTabNavStore } from '../../../store/pharmacy/pointOfSale/posTabNav';
import { useWarehouseTabsNavStore } from '../../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';
import { ArticlesPatientAcountManagementModal } from './Modal/ArticlesPatientAcountManagementModal';
import { ArticlesPatientAcountManagementPharmacyModal } from './Modal/ArticlesPatientAcountManagemenPharmacytModal';
import { ModalBasic, SelectBasic, TableBasic } from '@/common/components';
import { getPatientsWithAccount } from '@/services/programming/patientService';
import { createFilterOptions } from '@mui/material';
import { TextField } from '@mui/material';
import { getPatientHospitalSpaces } from '@/services/admission/admisionService';
import { getHospitalRoomArticles } from '@/services/programming/hospitalSpace';

const OPTIONS_LIMIT = 30;
const filterPatientOptions = createFilterOptions<any>({
  limit: OPTIONS_LIMIT,
});

const usePatientsOnSelect = (search: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const fetchPatients = async (search: string) => {
    setIsLoading(true);
    try {
      const res = await getPatientsWithAccount(search);
      setData(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(search);
  }, [search]);

  return {
    isLoading,
    data,
  };
};

const useHospitalRoom = (patient: any | null) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHospitalRoom = async (patient: any) => {
    console.log('patient:', patient);
    setIsLoading(true);

    if (!patient) {
      setData(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await getPatientHospitalSpaces(patient.id_CuentaPaciente);
      console.log('res:', res);
      setData(res);
    } catch (error) {
      setData(null);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalRoom(patient);
  }, [patient]);

  return {
    data,
    isLoading,
  };
};
const useHospitalRoomArticles = (hospitalRoomId: any | null) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHospitalRoom = async (hospitalRoomId: any) => {
    console.log('hospitalRoomId:', hospitalRoomId);
    setIsLoading(true);

    if (!hospitalRoomId) {
      setData([]);
      setIsLoading(false);
      return;
    }

    try {
      const res = await getHospitalRoomArticles(hospitalRoomId);
      console.log('res:', res);
      setData(res);
    } catch (error) {
      setData([]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalRoom(hospitalRoomId);
  }, [hospitalRoomId]);

  return {
    data,
    isLoading,
  };
};

const useGetExistingArticles = (warehouseId: string, principalWarehouseId: string) => {
  const warehouseSL: IWarehouseData | null = JSON.parse(localStorage.getItem('pharmacyWarehouse_Selected') as string);
  const {
    data,
    setSearch,
    search,
    fetchExistingArticles,
    setWarehouseId,
    setPrincipalWarehouseId,
    setStartDate,
    setEndDate,
    clearFilters,
    setPageIndex,
    setPageSize,
    startDate,
    endDate,
    clearAllData,
    isLoading,
    setSort,
    sort,
    pageCount,
    pageSize,
    pageIndex,
  } = useExistingArticlePagination(
    (state) => ({
      data: state.data,
      setSearch: state.setSearch,
      search: state.search,
      fetchExistingArticles: state.fetchExistingArticles,
      setWarehouseId: state.setWarehouseId,
      setPrincipalWarehouseId: state.setPrincipalWarehouseId,
      setStartDate: state.setStartDate,
      setEndDate: state.setEndDate,
      clearFilters: state.clearFilters,
      setPageIndex: state.setPageIndex,
      pageSize: state.pageSize,
      pageCount: state.pageCount,
      setPageSize: state.setPageSize,
      pageIndex: state.pageIndex,
      startDate: state.startDate,
      endDate: state.endDate,
      clearAllData: state.clearAllData,
      isLoading: state.isLoading,
      sort: state.sort,
      setSort: state.setSort,
    }),
    shallow
  );

  useEffect(() => {
    clearAllData();
  }, []);

  useEffect(() => {
    setWarehouseId(warehouseSL?.id_Almacen ?? warehouseId);
    if (warehouseSL && warehouseSL?.esSubAlmacen) {
      setPrincipalWarehouseId(warehouseSL.id_AlmacenPrincipal ?? '');
    } else {
      setPrincipalWarehouseId(principalWarehouseId);
    }
    fetchExistingArticles();
  }, [search, startDate, endDate, clearFilters, sort, pageIndex, pageSize]);

  return {
    data,
    setSearch,
    setStartDate,
    setEndDate,
    clearFilters,
    setPageIndex,
    setPageSize,
    startDate,
    endDate,
    isLoading,
    setSort,
    fetchExistingArticles,
    pageIndex,
    pageSize,
    pageCount,
  };
};
export const ArticlesPharmacyTable = () => {
  const warehouseIdSeted: string = usePosTabNavStore((state) => state.warehouseId);
  const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));

  const {
    data,
    setSearch,
    setPageIndex,
    setPageSize,
    setSort,
    fetchExistingArticles,
    isLoading,
    pageCount,
    pageSize,
    pageIndex,
  } = useGetExistingArticles(warehouseIdSeted, warehouseData.id_AlmacenPrincipal || '');
  const [openModal, setOpenModal] = useState(false);
  const [exitArticlesM, setExitArticlesM] = useState(false);
  const [entryArticlesM, setEntryArticlesM] = useState(false);
  const [openPatientChargesModal, setOpenPatientChargesModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSearch, setPatientSearch] = useState('');

  const { isLoading: isLoadingPatients, data: patientsData } = usePatientsOnSelect(patientSearch);
  const { isLoading: isLoadingHospitalRoom, data: hospitalRooms } = useHospitalRoom(selectedPatient);

  const [selectedHospitalRoom, setSelectedHospitalRoom] = useState<any | null>(null);

  const { isLoading: isLoadingHospitalRoomArticles, data: hospitalRoomArticles } =
    useHospitalRoomArticles(selectedHospitalRoom);

  const columns: any[] = [
    {
      header: 'Nombre',
      value: 'nombre',
    },
    {
      header: 'Fecha cargo',
      value: 'fechaCargo',
    },
    {
      header: 'Cantidad',
      value: 'cantidad',
    },
  ];
  return (
    <>
      <Stack sx={{ overflowX: 'auto' }}>
        <Stack spacing={2} sx={{ minWidth: 950 }}>
          <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
            <SearchBar
              title="Buscar articulo en farmacia..."
              searchState={setSearch}
              sx={{ display: 'flex', flex: 1 }}
              size="small"
            />
            <Box sx={{ display: 'flex', flex: 1, columnGap: 2, justifyContent: 'flex-end' }}>
              <Button
                sx={{ minWidth: 200 }}
                variant="contained"
                startIcon={<TurnLeftIcon />}
                onClick={() => {
                  setExitArticlesM(true);
                  setEntryArticlesM(false);
                  setOpenModal(!openModal);
                }}
              >
                Salida de artículos
              </Button>
              <Button
                sx={{ minWidth: 200 }}
                variant="contained"
                startIcon={<PersonIcon />}
                onClick={() => {
                  setOpenPatientChargesModal(true);
                }}
              >
                Cargos por paciente
              </Button>
              {/*<Button
                sx={{ minWidth: 200 }}
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={() => {
                  setEntryArticlesM(true);
                  setExitArticlesM(false);
                  setOpenModal(!openModal);
                }}
              >
                Movimientos Hospitalarios
              </Button>
              <Button
                sx={{ minWidth: 200 }}
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={() => {
                  setExitArticlesM(false);
                  setEntryArticlesM(false);
                  setOpenModal(!openModal);
                }}
              >
                Movimientos de Quirofano
              </Button>*/}
            </Box>
          </Box>
          <Card>
            {isLoading && data.length === 0 ? (
              <Box sx={{ display: 'flex', flex: 1, p: 4 }}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <SortComponent tableCellLabel="Nombre" headerName="nombre" setSortFunction={setSort} />
                      </TableCell>
                      <TableCell>
                        <SortComponent
                          tableCellLabel="Stock mínimo"
                          headerName="stockMinimo"
                          setSortFunction={setSort}
                        />
                      </TableCell>
                      <TableCell>
                        <SortComponent tableCellLabel="Stock" headerName="stockActual" setSortFunction={setSort} />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data && data.map((article) => <TableRowComponent article={article} key={article.id_Articulo} />)}
                  </TableBody>
                </Table>
                {!data ||
                  (data.length === 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 5,
                        columnGap: 1,
                      }}
                    >
                      <Info sx={{ width: 40, height: 40, color: 'gray' }} />
                      <Typography variant="h2" color="gray">
                        No hay artículos existentes
                      </Typography>
                    </Box>
                  ))}
                <TablePagination
                  component="div"
                  count={pageCount}
                  onPageChange={(e, value) => {
                    e?.stopPropagation();
                    setPageIndex(value);
                  }}
                  onRowsPerPageChange={(e: any) => {
                    setPageSize(e.target.value);
                  }}
                  page={pageIndex}
                  rowsPerPage={pageSize}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  labelRowsPerPage="Filas por página"
                />
              </TableContainer>
            )}
          </Card>
        </Stack>
      </Stack>
      <Modal open={openModal}>
        <>
          {exitArticlesM ? (
            <ArticlesExitModal setOpen={setOpenModal} warehouseId={warehouseIdSeted} refetch={fetchExistingArticles} />
          ) : entryArticlesM ? (
            <ArticlesPatientAcountManagementPharmacyModal
              setOpen={setOpenModal}
              warehouseId={warehouseIdSeted}
              refetch={fetchExistingArticles}
            />
          ) : (
            <ArticlesPatientAcountManagementModal
              setOpen={setOpenModal}
              warehouseId={warehouseIdSeted}
              refetch={fetchExistingArticles}
            />
          )}
        </>
      </Modal>
      <ModalBasic
        open={openPatientChargesModal}
        header={'Cargos por Paciente'}
        onClose={() => setOpenPatientChargesModal(false)}
      >
        <form noValidate>
          <Grid component="span" container spacing={1} width={500}>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel>Pacientes</InputLabel>
                <Autocomplete
                  disablePortal
                  fullWidth
                  filterOptions={filterPatientOptions}
                  onChange={(e: any, val: any) => {
                    e.stopPropagation();
                    setSelectedPatient(val);
                  }}
                  loading={isLoadingPatients}
                  getOptionLabel={(option) => option?.nombrePaciente || ''}
                  options={patientsData}
                  value={selectedPatient}
                  noOptionsText="No se encontraron pacientes"
                  isOptionEqualToValue={(op, val) => op.id_Paciente === val.id_Paciente}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Pacientes"
                      sx={{ width: '100%' }}
                      onChange={(e) => {
                        if (e.target.value === null) {
                          setPatientSearch('');
                        }

                        setPatientSearch(e.target.value);
                      }}
                    />
                  )}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectBasic
                uniqueProperty="id_EspacioHospitalario"
                displayProperty="nombre"
                label="Espacio hospitalario"
                placeholder="Seleccione un espacio"
                options={hospitalRooms}
                value={selectedHospitalRoom}
                onChange={(e: any) => {
                  setSelectedHospitalRoom(e.target.value);
                }}
              />
            </Grid>
          </Grid>

          <TableBasic
            rows={hospitalRoomArticles}
            isLoading={isLoadingHospitalRoomArticles}
            columns={columns}
          ></TableBasic>
        </form>
      </ModalBasic>
      {
        //<ArticlesEntryModal setOpen={setOpenModal} warehouseId={warehouseIdSeted} refetch={fetchExistingArticles} />
      }
    </>
  );
};

interface TableRowComponentProps {
  article: IExistingArticle;
}
const TableRowComponent: React.FC<TableRowComponentProps> = ({ article }) => {
  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>{article.nombre}</Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', columnGap: 1 }}>
            <Box>{article.stockMinimo}</Box>
            <Box>
              {article.stockActual < article.stockMinimo ? (
                <Tooltip title="Stock bajo">
                  <Warning sx={{ color: warning.main }} />
                </Tooltip>
              ) : null}
            </Box>
          </Box>
        </TableCell>
        <TableCell>{article.stockActual}</TableCell>
      </TableRow>
    </React.Fragment>
  );
};
