interface TableOptions {
  headerFontSize?: number;
}

export const getEmpityTable = (data: TableOptions) => {
  const columns = [
    { text: 'Circulante', alignment: 'center', bold: true, fontSize: 11 },
    { text: 'Realizando Devolución', alignment: 'center', bold: true, fontSize: 11 },
    { text: 'Farmacia', alignment: 'center', bold: true, fontSize: 11 },
  ];

  const emptySignatures = [
    { text: '', border: [true, true, true, true], fontSize: 9, margin: [0, 15, 0, 15] },
    { text: '', border: [true, true, true, true], fontSize: 9, margin: [0, 15, 0, 15] },
    { text: '', border: [true, true, true, true], fontSize: 9, margin: [0, 15, 0, 15] },
  ];

  const body = [
    [
      {
        text: 'Firmas',
        alignment: 'center',
        bold: true,
        fontSize: data.headerFontSize || 12,
        colSpan: 3,
        border: [true, true, true, true],
        fillColor: '#e1e2e1',
        margin: [0, 5, 0, 5],
      },
      {}, 
      {},
    ],
    columns,
    emptySignatures,
  ];

  return [
    {
      layout: {
        hLineWidth: function () {
          return 1;
        },
        vLineWidth: function () {
          return 1;
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
        widths: ['*', '*', '*'],
        body, 
      },
    },
  ];
};