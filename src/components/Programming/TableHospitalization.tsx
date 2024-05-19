import { Card, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { TableHeaderComponent } from '../Commons/TableHeaderComponent';
import { SellTableFooter } from '../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../Commons/NoDataInTableInfo';
const headers = ['Clave paciente', 'Nombre Paciente', 'Fecha Ingreso', 'Datos Paciente', 'Datos Clinicos', 'Acciones'];

interface TableBodyHospitalizationProps {
  data: any[];
}

interface TableRowHospitalizationProps {
  data: any;
}

export const TableHospitalization = () => {
  const data: any[] = [];
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent Headers={headers} />
          <TableBodyHospitalization data={data} />
          {data.length > 0 && (
            <SellTableFooter count={0} pageIndex={0} pageSize={5} setPageIndex={() => {}} setPageSize={() => {}} />
          )}
        </Table>
      </TableContainer>
      {data.length < 1 && <NoDataInTableInfo infoTitle="No hay pacientes registrados" />}
    </Card>
  );
};

const TableBodyHospitalization = (props: TableBodyHospitalizationProps) => {
  return (
    <>
      <TableBody>
        {props.data.map((item, index) => {
          return <TableRowHospitalization data={item} key={index} />;
        })}
      </TableBody>
    </>
  );
};

const TableRowHospitalization = (props: TableRowHospitalizationProps) => {
  const { data } = props;
  return (
    <TableRow>
      <TableCell>{data.nombre}</TableCell>
      <TableCell>bbb</TableCell>
      <TableCell>cccc</TableCell>
    </TableRow>
  );
};
