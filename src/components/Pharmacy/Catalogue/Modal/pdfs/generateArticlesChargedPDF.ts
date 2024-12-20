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

export const generatearticlesChargedPDF = (articlesCharged: {
    pacienteNombre: string;
    quirofano: string;
    articulos:{
        nombre: string;
        cantidad: number;
    }[]
    articulosExtra:{
      nombre: string;
      cantidad: number;
    }[]
}) => {
  console.log('articlesCharged:', articlesCharged);
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
        subheader: 'Cargo',
        value: 'espacio',
      },
    ],
    rows: articlesCharged.articulos.map((art) => ({...art, espacio: ''})),
  });

  const extraArticleSTable = getTable({
    header: 'ARTICULOS EXTRA',
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
        subheader: 'Cargo',
        value: 'espacio',
      },
    ],
    rows: articlesCharged.articulosExtra.map((art) => ({...art, espacio: ''})),
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
        ],
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['*','*'],
          body: [
            [
                getInfoCell('Paciente', articlesCharged.pacienteNombre, '*'),
                getInfoCell('Espacio', articlesCharged.quirofano, '*'),
            ],
          ],
        },
      },
      articleTable,
      extraArticleSTable.length > 0 && extraArticleSTable
    ],
  };

  try {
    const pdf = pdfmake.createPdf(docDefinition);
    pdf.open();
  } catch (error) {
    console.error('Error al generar el PDF:', error);
  }
};
