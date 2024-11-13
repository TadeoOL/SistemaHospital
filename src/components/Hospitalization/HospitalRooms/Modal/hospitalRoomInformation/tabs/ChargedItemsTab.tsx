import { Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IChargedItemsHospitalRoom } from '../../../../../../types/hospitalization/hospitalRoomTypes';
import { NoDataInTableInfo } from '../../../../../Commons/NoDataInTableInfo';

interface Props {
  chargedItems?: IChargedItemsHospitalRoom[];
}

export const ChargedItemsTab = ({ chargedItems }: Props) => {
  return (
    <Card>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="center">Cantidad</TableCell>
              <TableCell align="center">Fecha Cargo</TableCell>
              <TableCell>Cargado Por</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chargedItems?.map((item) => (
              <TableRow key={item.Id_Articulo}>
                <TableCell>{item.nombre}</TableCell>
                <TableCell align="center">{item.cantidad}</TableCell>
                <TableCell align="center">{item.fechaCargo}</TableCell>
                <TableCell>{item.usuarioCargo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {chargedItems?.length === 0 && (
          <NoDataInTableInfo infoTitle="No hay artículos cargados" sizeIcon={35} variantText="h3" />
        )}
      </TableContainer>
    </Card>
  );
};
