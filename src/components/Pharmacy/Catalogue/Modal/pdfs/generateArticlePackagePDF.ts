import { getTable } from '@/common/helpers/getTable';
import { logoWithText } from '@/common/logoWithText';
import { LineWeight } from '@mui/icons-material';
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

export const generateArticlePackagePDF = (articlePackage: any) => {
  console.log('articlePackage:', articlePackage);
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

  const paciente = articlePackage.paciente;
  const edadPaciente = "___";
  const solicitadoPor = articlePackage.usuarioSolicito;
  const medico = articlePackage.medico;
  const quirofano = articlePackage.quirofano;
  const espacioLibre = "____________"
  const espacioLibreAnes = "____________________________"
  const horaCirugia = articlePackage.horaCirugia;

  const articleTable = getTable({
    header: 'ARTICULOS',
    headerFontSize: 10,
    columns: [
      {
        subheader: 'Nombre',
        value: 'nombre',
      },
      {
        subheader: 'Solicitado',
        value: 'cantidad',
      },
      {
        subheader: 'Utilizado',
        value: 'utilizado',
      },
    ],
    rows: articlePackage.articulos.map((art: any) => ({...art, utilizado: ''})),
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
          widths: ['*', 'auto','*'],
          body: [
            [
              getInfoCell('Paciente', paciente, '*'),
              getInfoCell('Edad', edadPaciente, '*'),
              getInfoCell('Hora Cirugia', horaCirugia, '*'),
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
      {
        layout: 'noBorders',
        table: {
          widths: ['*', 'auto'],
          body: [[getInfoCell('Medico', medico, 'auto'), getInfoCell('Hora Inicio', espacioLibre, '*')]],
        },
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['*', 'auto'],
          body: [[getInfoCell('Solicitado por', solicitadoPor, '*'), getInfoCell('Hora fin', espacioLibre, '*')]],
        },
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['auto', 'auto','auto'],
          body: [
            [
              getInfoCell('Anestesiologo', espacioLibre, '*'),
              getInfoCell('Diagnostico', espacioLibre, '*'),
              getInfoCell('Anestesia', espacioLibre, '*'),
            ]],
        },
      },
      articleTable,
      singsHeaders,
      singsSpaces,
    ],
  };

  const pdf = pdfmake.createPdf(docDefinition);
  pdf.open();
};

const singsHeaders = getTable({
  header: 'Firmas',
  headerFontSize: 10,
  columns: [
    {
      subheader: 'Circulante',
      value: 'espacio1',
    },
    {
      subheader: 'Realizando Devolucion',
      value: 'espacio2',
    },
    {
      subheader: 'Farmacia',
      value: 'espacio3',
    },
  ],
  rows: [],
});
const singsSpaces = getTable({
  header: 'Firmas',
  headerFontSize: 10,
  columns: [
    {
      subheader: '',
      value: 'espacio1',
    },
    {
      subheader: ' ',
      value: 'espacio2',
    },
    {
      subheader: '',
      value: 'espacio3',
    },
  ],
  rows: [],
});