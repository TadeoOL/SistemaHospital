import { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CommonReport } from '../../../../../Export/Common/CommonReport';
import { CommonSpreadSheet } from '../../../../../Export/Common/CommonSpreadSheet';

interface ExportMenuProps {
  reportData?: any;
  title?: string;
  header?: Array<{ key: string; nameHeader: string }>;
}

export const ExportMenu = ({
  reportData = [],
  title = 'Reporte de Orden de Compra',
  header = [
    { key: 'folio_Extension', nameHeader: 'Orden de Compra' },
    { key: 'usuarioSolicitado', nameHeader: 'Creado por' },
    { key: 'proveedor', nameHeader: 'Proveedor' },
    { key: 'fechaSolicitud', nameHeader: 'Fecha de Solicitud' },
    { key: 'total', nameHeader: 'Total' },
    { key: 'estatusConcepto', nameHeader: 'Estatus' },
  ],
}: ExportMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <DownloadIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleClose}>
          <PDFDownloadLink
            document={<CommonReport title={title} header={header} data={reportData} />}
            fileName={`${Date.now()}.pdf`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            PDF
          </PDFDownloadLink>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <CommonSpreadSheet title={`${Date.now()}`} header={header} data={reportData} />
        </MenuItem>
      </Menu>
    </>
  );
};
