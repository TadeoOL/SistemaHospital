interface TableColumn {
  width?: string;
  subheader: string;
  value: string;
  align?: 'left' | 'center' | 'right';
}

interface TableOptions {
  header: any;
  columns: TableColumn[];
  rows: any[];
}

export const getTable = (data: TableOptions) => {
  if (data.rows.length === 0) {
    return [];
  }

  const columnsLength = data.columns.length;

  const widths = data.columns.map((column) => column.width || '*');

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
        widths,
        headerRows: 2,
        body: finalBody,
      },
    },
  ];
};
