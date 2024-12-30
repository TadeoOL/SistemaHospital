import { getEmpityTable } from '@/common/helpers/getEmpityTable';
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

const getInfoCell = (label: string, value: string, width?: any) => {
  return {
    margin: [0, 0, 0, 0],
    width: width || '*',
    table: {
      body: [
        [
          {
            text: label.toUpperCase(),
            fontSize: 10,
            bold: true,
            fillColor: '#e1e2e1',
            border: [false, false, false, false],
            margin: [0, 2, 0, 2],
            noWrap: true,
          },
          {
            text: value,
            fontSize: 12,
            border: [false, false, false, false],
            margin: [0, 2, 0, 2],
            noWrap: true,
          },
        ],
      ],
    },
  };
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(price);
};

export const generateCheckoutSalePDF = (checkoutSale: any) => {
  console.log('checkoutSale:', checkoutSale);
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

  const folio = checkoutSale.folio;
  const iva = formatPrice(checkoutSale.iva);
  const subTotal = formatPrice(checkoutSale.subTotal);
  const totalVenta = formatPrice(checkoutSale.totalVenta);
  const usuarioVenta = checkoutSale.usuarioVenta;

  const articleTable = getTable({
    header: 'ARTICULOS',
    headerFontSize: 10,
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
        subheader: 'Precio unitario',
        value: 'precioUnitario',
      },
      {
        subheader: 'Precio bruto',
        value: 'precioBruto',
      },
    ],
    rows: checkoutSale.articulos
      .sort((a: any, b: any) => a.nombre.localeCompare(b.nombre))
      .map((articulo: any) => {
        return {
          nombre: articulo.nombre,
          cantidad: articulo.cantidad,
          precioUnitario: formatPrice(articulo.precioUnitario),
          precioBruto: formatPrice(articulo.precioBruto),
        };
      }),
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
          [getInfoCell('Folio', folio, '*'), getInfoCell('Usuario venta', usuarioVenta, '*')],
        ],
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['*', '*', '*'],
          body: [
            [
              getInfoCell('Subtotal', subTotal, '*'),
              getInfoCell('IVA', iva, '*'),
              getInfoCell('Total', totalVenta, '*'),
            ],
          ],
        },
      },
      /*{
        layout: 'noBorders',
        table: {
          widths: ['*', 'auto'],
          body: [[getInfoCell('Quirofano', quirofano, 'auto'), getInfoCell('Folio solicitud', espacioLibre, '*')]],
        },
      },*/
      //   {
      //     layout: 'noBorders',
      //     table: {
      //       widths: ['*', 'auto'],
      //       body: [[getInfoCell('Solicitado por', solicitadoPor, '*'), getInfoCell('Hora Ingreso', espacioLibre, '*')]],
      //     },
      //   },
      //   {
      //     layout: 'noBorders',
      //     table: {
      //       widths: ['*', 'auto'],
      //       body: [[getInfoCell('Diagnostico', espacioLibreAnes, '*'), getInfoCell('Hora Egreso', espacioLibre, '*')]],
      //     },
      //   },
      //   {
      //     layout: 'noBorders',
      //     table: {
      //       widths: ['auto', 'auto', 'auto'],
      //       body: [[getInfoCell('Anestesiologo', espacioLibreAnes, '*'), getInfoCell('Anestesia', espacioLibre, '*')]],
      //     },
      //   },
      articleTable,
    ],
  };

  const pdf = pdfmake.createPdf(docDefinition);
  pdf.open();
};
