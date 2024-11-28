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

const formatCurrency = (v: number) => `$${v.toFixed(2)}`;

export const generateCheckoutReportPDF = async (checkout: any) => {
  console.log('checkout:', checkout);

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

  const checkoutItemsTable = getTable({
    header: 'CORTE DE CAJA',
    columns: [
      {
        subheader: 'Folio',
        value: 'folio',
      },
      {
        subheader: 'Proveniente de',
        value: 'moduloProveniente',
      },
      {
        subheader: 'Paciente',
        value: 'paciente',
      },
      {
        subheader: 'Costo total',
        value: 'totalVenta',
      },
      {
        subheader: 'Generado por',
        value: 'generadoPor',
      },
      {
        subheader: 'Monto de pago',
        value: 'montoPago',
      },
      {
        subheader: 'Tipo de pago',
        value: 'tipoPago',
      },
      {
        subheader: 'Fecha emisión',
        value: 'fechaCobro',
      },
      {
        subheader: 'Notas',
        value: 'notas',
      },
    ],
    rows: checkout.resumenVenta.map((item: any) => ({
      ...item,
      totalVenta: formatCurrency(item.totalVenta),
      montoPago: formatCurrency(item.montoPago),
    })),
  });

  const fecha = new Date();
  const encargadoDelCorte = checkout.usuario;
  const dineroInicial = checkout.dineroInicial;
  const ventaTotal = checkout.ventaTotal;
  const dineroAlCorte = checkout.dineroAlCorte;
  const diaHoraCorte = checkout.diaHoraCorte;
  const debito = checkout.debito;
  const credito = checkout.credito;
  const efectivo = checkout.efectivo;
  const transferencia = checkout.transferencia;

  const getInfoCell = (label: string, value: string, width?: any) => {
    return {
      margin: [0, 0, 0, 8],
      width: width || '*',
      table: {
        body: [
          [
            {
              text: label.toUpperCase(),
              fontSize: 12,
              bold: true,
              alignment: 'left',
              fillColor: '#e1e2e1',
              border: [false, false, false, false],
              margin: [0, 2, 0, 2],
              noWrap: true,
            },
            {
              text: value,
              fontSize: 12,
              alignment: 'left',
              border: [false, false, false, false],
              margin: [0, 2, 0, 2],
              noWrap: true,
            },
          ],
        ],
      },
    };
  };

  const docDefinition: any = {
    pageOrientation: 'landscape',
    pageMargins: [20, 20, 20, 20],
    header,
    content: [
      {
        width: 100,
        margin: [0, 0, 0, 20],
        columns: [
          {
            image: logoWithText,
            width: 200,
          },
        ],
      },
      {
        text: [
          {
            text: 'FECHA: ',
            bold: true,
          },
          {
            text: fecha.toLocaleString(),
          },
        ],
        alignment: 'right',
      },
      {
        columns: [getInfoCell('Encargado del corte:', encargadoDelCorte)],
      },
      {
        columns: [
          getInfoCell('Fondo inicial:', formatCurrency(dineroInicial), '*'),
          getInfoCell('Total ventas:', formatCurrency(ventaTotal), 'auto'),
          getInfoCell('Dinero al corte:', formatCurrency(dineroAlCorte), '*'),
          getInfoCell('Fecha CORTE:', diaHoraCorte, 'auto'),
        ],
      },
      {
        columns: [
          getInfoCell('Débito:', formatCurrency(debito)),
          getInfoCell('Crédito:', formatCurrency(credito)),
          getInfoCell('Efectivo:', formatCurrency(efectivo)),
          getInfoCell('Transferencia:', formatCurrency(transferencia)),
        ],
      },
      checkoutItemsTable,
    ],
  };

  const pdf = pdfmake.createPdf(docDefinition);
  pdf.open();
};
