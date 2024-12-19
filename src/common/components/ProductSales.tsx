// material-ui
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// project imports
import { MainCard } from './MainCard';
import SimpleBarScroll from './Drawer/DrawerContent/SimpleBar';
import { SellsAndMovementsAdministration } from '@/features/treasury/administration/types/types.administration';

// ===========================|| DATA WIDGET - PRODUCT SALES ||=========================== //

export default function ProductSales({ sellsAndMovements }: { sellsAndMovements: SellsAndMovementsAdministration }) {
  return (
    <MainCard title="Ventas y movimientos" content={false}>
      <Grid sx={{ p: 2.5 }} container direction="row" justifyContent="space-around" alignItems="center">
        <Grid item>
          <Grid container direction="column" spacing={1} alignItems="center" justifyContent="center">
            <Grid item>
              <Typography variant="subtitle2" color="secondary">
                Entradas totales
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4">${sellsAndMovements.totalIngresos.toFixed(0)}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="column" spacing={1} alignItems="center" justifyContent="center">
            <Grid item>
              <Typography variant="subtitle2" color="secondary">
                Ayer
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4">${sellsAndMovements.ingresosAyer.toFixed(0)}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="column" spacing={1} alignItems="center" justifyContent="center">
            <Grid item>
              <Typography variant="subtitle2" color="secondary">
                Semana
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4">${sellsAndMovements.ingresosSemana.toFixed(0)}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <SimpleBarScroll
        sx={{
          height: 330,
        }}
      >
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: 3 }}>Folio</TableCell>
                <TableCell>Concepto</TableCell>
                <TableCell align="right" sx={{ pr: 3 }}>
                  Monto
                </TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellsAndMovements.detalles.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell sx={{ pl: 3 }}>
                    <span>{row.folio}</span>
                  </TableCell>
                  <TableCell>{row.concepto}</TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <span>${row.cantidad.toFixed()}</span>
                  </TableCell>
                  <TableCell>{row.fechaIngreso}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SimpleBarScroll>
    </MainCard>
  );
}
