import { getTable } from '@/common/helpers/getTable';
import { logoWithText } from '@/common/logoWithText';
import pdfmake from 'pdfmake/build/pdfmake';

pdfmake.fonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
  },
};

const getInfoCell = (label: string, value: string, width?: any, alignment?: any) => {
  return {
    margin: [0, 0, 0, 8],
    width: width || '*',
    alignment: alignment || 'left',
    table: {
      body: [
        [
          {
            text: label.toUpperCase(),
            fontSize: 12,
            bold: true,
            alignment: alignment || 'left',
            fillColor: '#e1e2e1',
            border: [false, false, false, false],
            margin: [0, 2, 0, 2],
            noWrap: true,
          },
          {
            text: value,
            fontSize: 12,
            alignment: alignment || 'left',
            border: [false, false, false, false],
            margin: [0, 2, 0, 2],
            noWrap: true,
          },
        ],
      ],
    },
  };
};

export const generatePurchaseOrderPdf = (orderDetails: any) => {
  console.log('orderDetails:', orderDetails);

  const header = function (currentPage: number, pageCount: number) {
    // you can apply any logic and return any valid pdfmake element
    const pageText = `PÁG ${currentPage} DE ${pageCount}`;
    const month = new Date().toLocaleString('es-ES', { month: 'long' }).toUpperCase();
    const year = new Date().getFullYear();

    const date = `${month} ${year}`;

    const style = {
      fontSize: 7,
      alignment: 'right',
      italics: true,
      bold: true,
    };

    const marginTop = 20;

    return [
      {
        ...style,
        text: pageText,
        margin: [0, marginTop, 20, 0],
      },
      {
        ...style,
        text: date,
        margin: [0, 0, 20, 0],
      },
    ];
  };

  const precioTotal = orderDetails.precioTotalOrden;
  const folio = orderDetails.folio;
  const fecha = orderDetails.fechaCreacion;
  const conceptoPago = orderDetails.conceptoPago;

  const articleTable = getTable({
    header: 'Artículos de la Orden',
    columns: [
      {
        subheader: 'Nombre',
        value: 'nombre',
      },
      {
        subheader: 'Cantidad',
        value: 'cantidad',
      },
      {
        subheader: 'Precio',
        value: 'precioProveedor',
      },
    ],
    rows: orderDetails.ordenCompraArticulo,
  });

  const docDefinition: any = {
    pageMargins: [20, 40, 20, 20],
    header,
    content: [
      {
        margin: [0, 0, 0, 20],
        columns: [
          [
            {
              image: logoWithText,
              width: 200,
            },
          ],
          {
            width: '*',
            alignment: 'right',
            table: {
              body: [[getInfoCell('Fecha', fecha, '*', 'right')], [getInfoCell('Folio', folio, '*', 'right')]],
            },
          },
        ],
      },
      {
        columns: [getInfoCell('Concepto de Pago', conceptoPago, '*'), getInfoCell('Precio Total', precioTotal, 'auto')],
      },
      articleTable,
    ],
  };

  const pdf = pdfmake.createPdf(docDefinition);
  pdf.open();
};
    