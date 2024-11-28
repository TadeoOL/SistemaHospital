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

  const columns = [
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
      header: 'Notas',
      value: 'notas',
    },
  ];

  const columnsLength = columns.length;

  const docDefinition: any = {
    content: [
      {
        width: 100,
        columns: [
          {
            image: logoWithText,
            width: 200,
          },
        ],
      },
      {
        margin: [0, 20, 0, 15],
        table: {
          widths: Array(columnsLength).fill('*'),
          body: [
            columns.map((column) => ({
              text: column.header,
              fontSize: 8,
              alignment: 'center',
            })),
            ...checkout.resumenVenta.map((row: any) =>
              columns.map((column) => ({
                text: row[column.value],
                fontSize: 8,
                alignment: 'center',
              }))
            ),
          ],
        },
      },
    ],
  };

  const pdf = pdfmake.createPdf(docDefinition);
  pdf.open();
};
