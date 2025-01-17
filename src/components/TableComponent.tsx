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
import React, { useCallback, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';
import { useWarehouseTabsNavStore } from '../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';

interface ITableComponentProps {
  fetchDataHook: () => {
    data: any[];
    count: number;
    pageSize: number;
    pageIndex: number;
    isLoading: boolean;
    enabled: boolean;
    setPageIndex: (index: number) => void;
    setPageSize: (size: number) => void;
  };
  navigatingRowsWareHouse?: boolean;
  hasPrices?: number[];
  disableHook: (id: string) => void;
  modifyModalComponent: (props: { data: string; open: (isOpen: boolean) => void }) => React.ReactElement;
  headers: any;
}

export const TableComponent: React.FC<ITableComponentProps> = ({
  fetchDataHook,
  disableHook,
  modifyModalComponent,
  headers,
  navigatingRowsWareHouse,
  hasPrices,
}) => {
  const [dataId, setDataId] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const clearState = useWarehouseTabsNavStore(useShallow((state) => state.clearWarehouseData));

  const { count, data, enabled, isLoading, pageIndex, pageSize, setPageIndex, setPageSize } = fetchDataHook();

  const handlePageChange = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, value: number) => {
    event?.stopPropagation();
    setPageIndex(value);
  }, []);

  return (
    <>
      <Card sx={{ m: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {headers?.lenght > 0 ? (
                headers.map((header: any, i: any) => <TableCell key={i}>{header}</TableCell>)
              ) : (
                <></>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0
              ? null
              : isLoading
                ? null
                : data.map((item: any) => (
                    <React.Fragment key={item.id}>
                      <TableRow
                        onClick={
                          navigatingRowsWareHouse
                            ? () => {
                                clearState();
                                navigate(`/almacenes/${item.id}`);
                              }
                            : () => {}
                        }
                        sx={{
                          '&:hover': {
                            cursor: 'pointer',
                            bgcolor: 'whitesmoke',
                          },
                        }}
                      >
                        {Object.keys(item).map(
                          (key, index) =>
                            key !== 'id' && (
                              <TableCell key={index}>
                                {hasPrices?.includes(index) ? '$' : ''}
                                {item[key]}
                              </TableCell>
                            )
                        )}
                        <TableCell>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              sx={{ color: 'neutral.700' }}
                              onClick={(e) => {
                                setDataId(item.id);
                                setOpen(true);
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
                                disableHook(item.id);
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
                    </React.Fragment>
                  ))}
          </TableBody>
        </Table>
        {isLoading && (
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {data.length === 0 && !isLoading && (
          <Box
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
          </Box>
        )}
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
      </Card>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div>{modifyModalComponent({ data: dataId, open: setOpen })}</div>
      </Modal>
    </>
  );
};
