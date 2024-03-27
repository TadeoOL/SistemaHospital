import {
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  CircularProgress,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
} from '@mui/material';
import { Info } from '@mui/icons-material';
import { dataTagSymbol } from '@tanstack/react-query';
import React, { useEffect } from 'react';

export const WarehousePurchases = () => {
  const mockdatita = [{}, {}];

  return (
    <Stack>
      asadasd
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Petición de Almacén</TableCell>
                <TableCell>Artículos</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockdatita && mockdatita.length > 0 ? (
                mockdatita.map((petition, i) => <React.Fragment key={i}>hu</React.Fragment>)
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        flex: 1,
                        justifyContent: 'center',
                        p: 2,
                        columnGap: 1,
                      }}
                    >
                      {
                        //isLoading && !data ? (
                        false ? (
                          <CircularProgress size={25} />
                        ) : (
                          <>
                            <Info sx={{ width: 40, height: 40, color: 'gray' }} />
                            <Typography variant="h2" color="gray">
                              No hay movimientos
                            </Typography>
                          </>
                        )
                      }
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Stack>
  );
};
