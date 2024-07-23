import {
  Box,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { IConfigEmitterUsers } from '../../types/types';
import { Delete, Edit } from '@mui/icons-material';
import { NoDataInTableInfo } from '../Commons/NoDataInTableInfo';

interface UsersEmitterTableBodyProps {
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
  data: IConfigEmitterUsers[];
}
interface UsersEmitterTableRowProps {
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
  data: IConfigEmitterUsers;
}
interface EmitterUsersTableProps {
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
  data: IConfigEmitterUsers[];
  loading: boolean;
}
interface LeaveConceptsProps {
  data: string;
}

export const EmitterUsersTable = (props: EmitterUsersTableProps) => {
  return (
    <Card>
      <TableContainer>
        <Table>
          <UsersEmitterTableHeader />
          {!props.loading && (
            <UsersEmitterTableBody data={props.data} handleEdit={props.handleEdit} handleDelete={props.handleDelete} />
          )}
        </Table>
      </TableContainer>
      {props.data.length < 1 && !props.loading && <NoDataInTableInfo infoTitle="No hay usuarios" />}
      {props.loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={40} />
        </Box>
      )}
    </Card>
  );
};

const UsersEmitterTableHeader = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Nombre del usuario</TableCell>
        <TableCell>Concepto de salida</TableCell>
        <TableCell>Acciones</TableCell>
      </TableRow>
    </TableHead>
  );
};

const UsersEmitterTableBody = (props: UsersEmitterTableBodyProps) => {
  return (
    <TableBody>
      {props.data.map((data) => (
        <UsersEmitterTableRow
          key={data.id_Usuario}
          data={data}
          handleEdit={props.handleEdit}
          handleDelete={props.handleDelete}
        />
      ))}
    </TableBody>
  );
};

const UsersEmitterTableRow = (props: UsersEmitterTableRowProps) => {
  return (
    <TableRow>
      <TableCell>{props.data.nombre}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', flex: 1, columnGap: 0.5, alignItems: 'center' }}>
          {props.data.departamento.slice(0, 2).map((dp, i) => (
            <LeaveConcepts key={dp + i} data={dp} />
          ))}
          {props.data.departamento.length > 2 && (
            <Tooltip title={props.data.departamento.slice(2).join(', ')}>
              <Box sx={{ borderRadius: '50%', px: 1, bgcolor: '#E2E3E5', py: 0.5 }}>
                +{props.data.departamento.length - 2}
              </Box>
            </Tooltip>
          )}
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', flex: 1, columnGap: 0.5, alignItems: 'center' }}>
          <Tooltip
            title="Editar"
            onClick={(e) => {
              e.stopPropagation();
              props.handleEdit(props.data.id_Usuario);
            }}
          >
            <IconButton>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                props.handleDelete(props.data.id_Usuario);
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};

const LeaveConcepts = (props: LeaveConceptsProps) => {
  return <Chip label={props.data} />;
};
