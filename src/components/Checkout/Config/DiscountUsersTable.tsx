import { TableContainer, Table, TableRow, TableCell, Card, IconButton, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';

const HEADER_COLUMNS: string[] = ['Nombre del usuario', 'Acciones'];

export const DiscountUsersTable = ({
  usersDiscount,
  setUsersDiscount,
}: {
  usersDiscount: { id: string; name: string }[];
  setUsersDiscount: (users: { id: string; name: string }[]) => void;
}) => {
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={HEADER_COLUMNS} />
          {usersDiscount.map((user) => (
            <DiscountUsersTableRow
              key={user.id}
              user={user}
              setUsersDiscount={setUsersDiscount}
              usersDiscount={usersDiscount}
            />
          ))}
        </Table>
      </TableContainer>
      {usersDiscount.length === 0 && (
        <NoDataInTableInfo infoTitle="No se encontraron usuarios con descuento" sizeIcon={20} variantText="h5" />
      )}
    </Card>
  );
};

export const DiscountUsersTableRow = ({
  user,
  setUsersDiscount,
  usersDiscount,
}: {
  user: { id: string; name: string };
  setUsersDiscount: (users: { id: string; name: string }[]) => void;
  usersDiscount: { id: string; name: string }[];
}) => {
  const handleDelete = () => {
    setUsersDiscount(usersDiscount.filter((u) => u.id !== user.id));
  };
  return (
    <TableRow>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <Tooltip title="Eliminar">
          <IconButton color="error" onClick={handleDelete}>
            <Delete />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};
