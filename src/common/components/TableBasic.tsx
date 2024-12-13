// material-ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CircularProgress from '@mui/material/CircularProgress';

// project imports
import React, { useState } from 'react';
import { SortComponent } from '@/components/Commons/SortComponent';
import { Box, Card, Typography } from '@mui/material';
import { Stack } from '@mui/material';
import { TableBasicColumn, TableBasicProps } from '@/types/tableComponentTypes';
import { NoDataInTableInfo } from '@/components/Commons/NoDataInTableInfo';
import SimpleBarScroll from './Drawer/DrawerContent/SimpleBar';

export const TableBasic = <T extends object>({
  rows,
  columns,
  isLoading,
  maxHeight,
  children,
  nestedTable,
}: TableBasicProps<T>) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const hasNestedData = (row: T): boolean => {
    if (!nestedTable) return false;
    return Object.keys(nestedTable).some((key) => {
      const nestedData = row[key as keyof T];
      return Array.isArray(nestedData) && nestedData.length > 0;
    });
  };

  return (
    <>
      {children && (
        <Stack direction="row" spacing={2} sx={{ p: 2 }}>
          {children}
        </Stack>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <SimpleBarScroll>
          <TableContainer sx={{ maxHeight }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {nestedTable && (
                    <TableCell
                      style={{
                        width: 50,
                        backgroundColor: 'background.paper',
                        position: 'sticky',
                        left: 0,
                        zIndex: 3,
                      }}
                    />
                  )}
                  {columns.map((column: TableBasicColumn<T>, index: number) => (
                    <TableCell
                      key={index}
                      align={column.align}
                      width={column.width}
                      sx={{ zIndex: 100, position: 'sticky !important' }}
                    >
                      {column.sort ? (
                        <SortComponent
                          tableCellLabel={column.header?.toString() || ''}
                          headerName={typeof column.value === 'string' ? column.value : ''}
                          setSortFunction={typeof column.sort === 'function' ? column.sort : () => {}}
                        />
                      ) : (
                        column.header
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <TableRow hover>
                      {nestedTable && hasNestedData(row) && (
                        <TableCell>
                          <IconButton size="small" onClick={() => toggleRow(rowIndex)}>
                            {expandedRows.has(rowIndex) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </TableCell>
                      )}
                      {columns.map((column, colIndex) => (
                        <TableCell key={colIndex} align={column.align}>
                          {typeof column.value === 'function' ? column.value(row) : String(row[column.value] ?? '')}
                        </TableCell>
                      ))}
                    </TableRow>

                    {nestedTable && (
                      <TableRow className="noHover">
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 1}>
                          <Collapse in={expandedRows.has(rowIndex)} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                              {(
                                Object.entries(nestedTable) as [
                                  string,
                                  { columns: TableBasicColumn<T>[]; title?: string },
                                ][]
                              ).map(([key, config]) => {
                                const nestedData = row[key as keyof T];
                                if (Array.isArray(nestedData) && nestedData.length > 0) {
                                  return (
                                    <Box key={key} sx={{ my: 2 }}>
                                      {config.title && (
                                        <Typography variant="h5" gutterBottom>
                                          {config.title}
                                        </Typography>
                                      )}
                                      <Card>
                                        <Table size="small">
                                          <TableHead>
                                            <TableRow className="noHover">
                                              {config.columns.map((col: TableBasicColumn<T>, index: number) => (
                                                <TableCell key={index} align={col.align}>
                                                  {col.header}
                                                </TableCell>
                                              ))}
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {nestedData.map((nestedRow, nestedIndex) => (
                                              <TableRow key={nestedIndex} className="noHover">
                                                {config.columns.map((col: TableBasicColumn<T>, colIndex: number) => (
                                                  <TableCell key={colIndex} align={col.align}>
                                                    {typeof col.value === 'function'
                                                      ? col.value(nestedRow)
                                                      : nestedRow[col.value]}
                                                  </TableCell>
                                                ))}
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </Card>
                                    </Box>
                                  );
                                }
                                return null;
                              })}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {rows.length === 0 && <NoDataInTableInfo infoTitle="No existen registros" />}
        </SimpleBarScroll>
      )}
    </>
  );
};
