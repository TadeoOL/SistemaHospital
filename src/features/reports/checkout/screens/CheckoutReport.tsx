import { TableBasic, TablePaginated, TableTop } from '@/common/components';
import { SearchBar } from '@/components/Inputs/SearchBar';
import { useEffect, useRef, useState } from 'react';
import { getCheckoutReport, getCheckoutReportSummary } from '../services/checkout';
import { Button, IconButton, Tooltip } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { generateCheckoutReportPDF } from '../pdfs/generateCheckoutReportPDF';

const CheckoutReport = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);

  const updateSummary = async () => {
    if (!selected) return;

    const res = await getCheckoutReportSummary(selected);
    setSummary(res);
    setData(res);
  };

  const handleGenerate = () => {
    generateCheckoutReportPDF(data);
  };

  useEffect(() => {
    updateSummary();
  }, [selected]);

  const tableRef = useRef<any>();

  const handleSee = (row: any) => {
    return () => {
      setSelected(row.id);
    };
  };

  const columns: any[] = [
    {
      header: 'Usuario',
      value: 'usuario',
      sort: true,
      width: 'auto',
    },
    {
      header: 'Dinero Inicial',
      value: 'dineroInicial',
      sort: true,
    },
    {
      header: 'Debito',
      value: 'debito',
      sort: true,
      width: '100px',
    },
    {
      header: 'Credito',
      value: 'credito',
      sort: true,
      width: '100px',
    },
    {
      header: 'Transferencia',
      value: 'transferencia',
      sort: true,
      width: '100px',
    },
    {
      header: 'Efectivo',
      value: 'efectivo',
      sort: true,
      width: 'auto',
    },
    {
      header: 'Total venta',
      value: 'ventaTotal',
      sort: true,
      width: 'auto',
    },
    {
      header: 'Dinero al corte',
      value: 'dineroAlCorte',
      sort: true,
      width: 'auto',
    },
    {
      header: 'Fecha del corte',
      value: 'diaHoraCorte',
      sort: true,
      width: 'auto',
    },
    {
      header: 'Acciones',
      value: (row: any) => (
        <>
          <Tooltip title="Ver">
            <IconButton size="small" onClick={handleSee(row)}>
              <RemoveRedEyeIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  // const headers = ["Folio", "Proveniente de", "Paciente", "Costo total", "Generado Por", "Monto de Pago", "Tipo de pago", "Fecha Emisión", "Acciones"];

  const summaryColumns = [
    {
      header: 'Folio',
      value: 'folio',
    },
    {
      header: 'Proveniente de',
      value: 'moduloProveniente',
    },
    {
      header: 'Paciente',
      value: 'paciente',
    },
    {
      header: 'Costo total',
      value: 'totalVenta',
    },
    {
      header: 'Generado por',
      value: 'generadoPor',
    },
    {
      header: 'Monto de pago',
      value: 'montoPago',
    },
    {
      header: 'Tipo de pago',
      value: 'tipoPago',
    },
    {
      header: 'Fecha emisión',
      value: 'fechaCobro',
    },
    {
      header: 'Acciones',
      value: 'acciones',
    },
  ];

  return (
    <>
      {(!selected && (
        <>
          <TableTop>
            <SearchBar title="Busca corte de caja por nombre..." searchState={setSearch} sx={{ width: '30%' }} />

            <IconButton
              sx={{
                height: '40px',
              }}
              onClick={() => {
                console.log('generar reporte');
              }}
            >
              {/* <FilterListOff /> */}
            </IconButton>
          </TableTop>
          <TablePaginated
            ref={tableRef}
            columns={columns}
            fetchData={getCheckoutReport}
            params={{
              search,
              // id_AlmacenPrincipal: warehouseSelected || null,
              // id_Almacen: warehouseSelected || null,
              // Id_SubCategoria: subcategory || null,
              // habilitado: enabled,
            }}
          />
        </>
      )) || (
        <>
          <TableTop>
            <IconButton
              sx={{
                bgcolor: 'grey.200',
              }}
              color="secondary"
              onClick={() => {
                setSelected(null);
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Button
              sx={{ height: '40px', mt: '8px', marginRight: '20px' }}
              variant="contained"
              // startIcon={<AddCircleOutlinedIcon />}
              onClick={handleGenerate}
            >
              Generar reporte de caja
            </Button>
          </TableTop>
          <TableBasic columns={summaryColumns} rows={summary?.resumenVenta || []}></TableBasic>
        </>
      )}
    </>
  );
};

export default CheckoutReport;
