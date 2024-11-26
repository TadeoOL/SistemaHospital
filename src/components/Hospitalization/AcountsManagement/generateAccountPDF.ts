import pdfmake from 'pdfmake/build/pdfmake';
import { logoWithText } from '../../../common/logoWithText';
import { IPatientAccount, PatientAccountStatus } from '../../../types/checkout/patientAccountTypes';

pdfmake.fonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
  },
};

interface TableColumn {
  subheader: string;
  value: string;
  align?: 'left' | 'center' | 'right';
}

interface TableOptions {
  header: any;
  columns: TableColumn[];
  rows: any[];
}

const getTable = (data: TableOptions) => {
  if (data.rows.length === 0) {
    return [];
  }

  const columnsLength = data.columns.length;
  const columns = data.columns.map((column) => {
    return {
      text: column.subheader,
      alignment: 'center',
      bold: true,
      fontSize: 11,
    };
  });

  const body = data.rows.map((row) => {
    return data.columns.map((column) => {
      return {
        text: row[column.value],
        border: [false, false, false, false],
        alignment: column.align || 'center',
        fontSize: 9,
        margin: [0, 2, 0, 2],
      };
    });
  });

  const finalBody = [
    [
      {
        fontSize: 12,
        bold: true,
        fillColor: '#e1e2e1',
        margin: [0, 2, 0, 2],
        border: [false, false, false, false],
        colSpan: columnsLength,
        text: data.header,
        alignment: 'center',
      },
      ...Array(columnsLength - 1).fill({
        border: [false, false, false, false],
        text: '',
      }),
    ],
    columns,
    ...body,
  ];

  return [
    {
      layout: {
        fillColor: function (rowIndex: any) {
          if (rowIndex < 2) return null;
          return rowIndex % 2 === 0 ? null : '#f4f4f3';
        },
        hLineWidth: function (i: number) {
          return i === 1 || i === 2;
        },
        vLineWidth: function (i: number) {
          return i === 0 || i === 1;
        },
        hLineColor: function () {
          return 'black';
        },
        vLineColor: function () {
          return 'black';
        },
      },
      margin: [0, 20, 0, 15],
      table: {
        headerRows: 2,
        widths: Array(columnsLength).fill('*'),
        body: finalBody,
      },
    },
  ];
};

const formatCurrency = (value: number) => {
  return `$${value.toFixed(2)}`;
};

const sum = (arr: any[], key: string) => {
  return arr.reduce((acc, curr) => acc + curr[key], 0);
};

export const generateAccountPDF = (accountInfo: IPatientAccount) => {
  console.log({ accountInfo });
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

    return [
      {
        ...style,
        text: pageText,
        margin: [0, 40, 40, 0],
      },
      {
        ...style,
        text: date,
        margin: [0, 0, 40, 0],
      },
    ];
  };

  const patientInfoRows = [
    {
      title: 'Nombre: ',
      value: accountInfo.paciente?.nombrePaciente,
    },
    {
      title: 'Fecha: ',
      value: accountInfo.paciente?.fechaCierreCuenta ? accountInfo.paciente?.fechaIngreso : null,
    },
    {
      title: 'Nombre Doctor: ',
      value: accountInfo.paciente?.nombreMedico,
    },
    {
      title: 'Tipo: ',
      value: 'Hospitalización',
    },
    // {
    //   title: 'Total de Servicios y Estudios: ',
    //   value: '$3116.86',
    // },
    // {
    //   title: 'Total de Material: ',
    //   value: '$5315.93',
    // },
    // {
    //   title: 'Total de Medicamento: ',
    //   value: '$5340.21',
    // },
  ]
    .filter((r) => r.value)
    .map((r) => {
      return [
        {
          margin: [0, 0, 0, -3],
          border: [false, false, false, false],
          text: [
            {
              text: r.title,
              bold: true,
            },
            {
              text: r.value,
            },
          ],
        },
      ];
    });

  const patientInfoTable = {
    margin: [0, 0, 20, 20],
    table: {
      widths: ['*'],
      body: [
        [
          {
            border: [false, false, false, false],
            style: 'tableHeader',
            text: 'INFORMACIÓN DEL PACIENTE',
          },
        ],
        ...patientInfoRows,
      ],
    },
  };

  const sumCuartos = sum(accountInfo.cuartos || [], 'total');
  const sumQuirofanos = sum(accountInfo.quirofanos || [], 'total');
  const sumCirugias = sum(accountInfo.cirugias || [], 'total');
  const sumServicios = sum([...(accountInfo.servicios || []), ...(accountInfo.equipoHonorario || [])], 'total');
  const sumArticulos = sum(accountInfo.articulos || [], 'total');
  const sumPagos = sum(accountInfo.pagosCuenta || [], 'monto');

  const isOpen = accountInfo.estatusCuenta === PatientAccountStatus.Admitted;

  const documentDefinition: any = {
    watermark: {
      text: isOpen ? 'CUENTA ABIERTA' : '',
      color: 'red',
      opacity: 0.2,
      bold: true,
      italics: false,
    },
    header,
    pageSize: 'LETTER',
    pageMargins: [40, 60, 40, 60],
    styles: {
      tableHeader: {
        fontSize: 12,
        bold: true,
        alignment: 'center',
        fillColor: '#e1e2e1',
        margin: [0, 2, 0, 2],
      },
      columnHeader: {},
    },
    pageBreakBefore: function (currentNode: any) {
      if (!currentNode.headlineLevel) {
        return false;
      }

      const Y = currentNode.startPosition.top;
      const pagebreak = Y > currentNode.headlineLevel;
      return pagebreak;
    },
    content: [
      {
        margin: [0, 20, 0, 10],
        columns: [
          patientInfoTable,
          {
            image: logoWithText,
            width: 230,
            alignment: 'center',
          },
        ],
      },
      ...getTable({
        header: 'CUARTOS',
        columns: [
          {
            subheader: 'Nombre',
            value: 'nombre',
          },
          {
            subheader: 'Días',
            value: 'dias',
          },
          {
            subheader: 'Precio por Día',
            value: 'precioPorDia',
          },
          {
            subheader: 'Precio Neto',
            value: 'precioNeto',
          },
          {
            subheader: 'IVA',
            value: 'iva',
          },
          {
            subheader: 'Total',
            value: 'total',
          },
        ],
        rows:
          accountInfo.cuartos?.map((c) => {
            return {
              nombre: c.nombre,
              dias: c.cantidadDias,
              precioPorDia: formatCurrency(c.precioDia),
              precioNeto: formatCurrency(c.neto),
              iva: formatCurrency(c.iva),
              total: formatCurrency(c.total),
            };
          }) || [],
      }),
      {
        text: accountInfo.cuartos?.length
          ? [
              {
                text: 'Total: ',
                bold: true,
                italics: true,
              },
              {
                text: formatCurrency(sumCuartos),
                italics: true,
              },
            ]
          : '',
        alignment: 'right',
        margin: [0, 0, 0, 5],
      },
      ...getTable({
        header: 'QUIRÓFANOS',
        columns: [
          {
            subheader: 'Nombre',
            value: 'nombre',
          },
          {
            subheader: 'Tiempo',
            value: 'tiempo',
          },
          {
            subheader: 'Precio Neto',
            value: 'precioNeto',
          },
          {
            subheader: 'IVA',
            value: 'iva',
          },
          {
            subheader: 'Total',
            value: 'total',
          },
        ],
        rows: [
          ...(accountInfo.quirofanos?.map((c) => {
            return {
              nombre: c.nombre,
              tiempo: c.tiempo,
              precioNeto: formatCurrency(c.neto),
              iva: formatCurrency(c.iva),
              total: formatCurrency(c.total),
            };
          }) || []),
        ],
      }),
      {
        text: accountInfo.quirofanos?.length
          ? [
              {
                text: 'Total: ',
                bold: true,
                italics: true,
              },
              {
                text: formatCurrency(sumQuirofanos),
                italics: true,
              },
            ]
          : '',
        alignment: 'right',
        margin: [0, 0, 0, 5],
      },
      ...getTable({
        header: 'PROCEDIMIENTOS',
        columns: [
          {
            subheader: 'Nombre',
            value: 'nombre',
          },
          {
            subheader: 'Precio Neto',
            value: 'precioNeto',
          },
          {
            subheader: 'IVA',
            value: 'iva',
          },
          {
            subheader: 'Precio Total',
            value: 'total',
          },
        ],
        rows: [
          ...(accountInfo.cirugias?.map((c) => {
            return {
              nombre: c.nombre,
              precioNeto: formatCurrency(c.neto),
              iva: formatCurrency(c.iva),
              total: formatCurrency(c.total),
            };
          }) || []),
        ],
      }),
      {
        text: accountInfo.cirugias?.length
          ? [
              {
                text: 'Total: ',
                bold: true,
                italics: true,
              },
              {
                text: formatCurrency(sumCirugias),
                italics: true,
              },
            ]
          : '',
        alignment: 'right',
        margin: [0, 0, 0, 5],
      },
      ...getTable({
        header: 'SERVICIOS Y/O EQUIPO HONORARIO',
        columns: [
          {
            subheader: 'Nombre',
            value: 'nombre',
          },
          {
            subheader: 'Precio Neto',
            value: 'precioNeto',
          },
          {
            subheader: 'IVA',
            value: 'iva',
          },
          {
            subheader: 'Precio Total',
            value: 'total',
          },
        ],
        rows: [
          ...([...(accountInfo.servicios || []), ...(accountInfo.equipoHonorario || [])].map((c) => {
            return {
              nombre: c.nombre,
              precioNeto: formatCurrency(c.neto),
              iva: formatCurrency(c.iva),
              total: formatCurrency(c.total),
            };
          }) || []),
        ],
      }),
      {
        text:
          accountInfo.servicios?.length || accountInfo.equipoHonorario?.length
            ? [
                {
                  text: 'Total: ',
                  bold: true,
                  italics: true,
                },
                {
                  text: formatCurrency(sumServicios),
                  italics: true,
                },
              ]
            : '',
        alignment: 'right',
        margin: [0, 0, 0, 5],
      },
      ...getTable({
        header: 'ARTÍCULOS',
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
            subheader: 'Solicitud',
            value: 'solicitud',
          },
          {
            subheader: 'IVA',
            value: 'iva',
          },
          {
            subheader: 'Fecha Solicitado',
            value: 'fechaSolicitado',
          },
          {
            subheader: 'Precio Unitario',
            value: 'precioUnitario',
          },
          {
            subheader: 'Precio Neto',
            value: 'precioNeto',
          },
          {
            subheader: 'Precio Total',
            value: 'total',
          },
        ],
        rows: [
          ...(accountInfo.articulos?.map((c) => {
            return {
              nombre: c.nombre,
              cantidad: c.cantidad,
              solicitud: c.solicitadoEn,
              iva: formatCurrency(c.iva),
              fechaSolicitado: c.fechaSolicitado,
              precioUnitario: formatCurrency(c.precioUnitario),
              precioNeto: formatCurrency(c.neto),
              total: formatCurrency(c.total),
            };
          }) || []),
        ],
      }),
      {
        text: accountInfo.articulos?.length
          ? [
              {
                text: 'Total: ',
                bold: true,
                italics: true,
              },
              {
                text: formatCurrency(sumArticulos),
                italics: true,
              },
            ]
          : '',
        alignment: 'right',
        margin: [0, 0, 0, 5],
      },
      ...getTable({
        header: 'PAGOS',
        columns: [
          {
            subheader: 'Folio',
            value: 'folio',
          },
          {
            subheader: 'Pagado',
            value: 'pagado',
          },
          {
            subheader: 'Fecha de Pago',
            value: 'fechaPago',
          },
          {
            subheader: 'Importe',
            value: 'importe',
          },
        ],
        rows: [
          ...(accountInfo.pagosCuenta?.map((c) => {
            return {
              folio: c.folio,
              pagado: formatCurrency(c.monto),
              fechaPago: c.fechaPago,
              importe: formatCurrency(c.monto),
            };
          }) || []),
        ],
      }),
      {
        text: accountInfo.pagosCuenta?.length
          ? [
              {
                text: 'Total: ',
                bold: true,
                italics: true,
              },
              {
                text: formatCurrency(sumPagos),
                italics: true,
              },
            ]
          : '',
        alignment: 'right',
        margin: [0, 0, 0, 5],
      },
      {
        headlineLevel: 650,
        margin: [0, 30, 0, 15],
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: 'TOTALES',
                border: [false, false, false, false],
                fontSize: 12,
                bold: true,
                fillColor: '#e1e2e1',
                margin: [0, 2, 0, 2],
                alignment: 'center',
              },
            ],
          ],
        },
      },
      {
        fontSize: 10,
        columns: [
          [
            {
              margin: [0, 0, 0, 4],
              text: [
                {
                  text: 'SubTotal: ',
                  italics: true,
                  bold: true,
                },
                {
                  text: formatCurrency(accountInfo.subTotal),
                  italics: true,
                },
              ],
            },
            {
              margin: [0, 0, 0, 4],
              text: [
                {
                  text: 'IVA: ',
                  italics: true,
                  bold: true,
                },
                {
                  text: formatCurrency(accountInfo.iva),
                  italics: true,
                },
              ],
            },
            {
              margin: [0, 0, 0, 4],
              text: [
                {
                  text: 'Total: ',
                  italics: true,
                  bold: true,
                },
                {
                  text: formatCurrency(accountInfo.total),
                  italics: true,
                },
              ],
            },
          ],
          [
            {
              alignment: 'right',
              margin: [0, 0, 0, 4],
              text: [
                {
                  text: 'Total Abonos: ',
                  italics: true,
                  bold: true,
                },
                {
                  text: formatCurrency(accountInfo.totalPagos),
                  italics: true,
                },
              ],
            },
            {
              alignment: 'right',
              margin: [0, 0, 0, 4],
              text: [
                {
                  text: 'Total Restante: ',
                  italics: true,
                  bold: true,
                },
                {
                  text: formatCurrency(accountInfo.totalRestante),
                  italics: true,
                },
              ],
            },
          ],
        ],
      },
      {
        margin: [0, 30, 0, 15],
        layout: {
          hLineWidth: function () {
            return 0.5;
          },
          vLineWidth: function () {
            return 0.5;
          },
        },
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: 'NOTAS',
                border: [false, false, false, false],
                fontSize: 12,
                bold: true,
                fillColor: '#e1e2e1',
                margin: [0, 2, 0, 2],
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Información adicional',
              },
            ],
          ],
        },
      },
    ],
  };

  const pdf = pdfmake.createPdf(documentDefinition);
  pdf.open();
};
