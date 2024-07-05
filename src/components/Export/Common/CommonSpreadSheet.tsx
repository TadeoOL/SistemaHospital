import * as XLSX from 'xlsx';

type DataItem = { [key: string]: any };

export const CommonSpreadSheet: React.FC<CommonExportProps> = ({ title, header, data }) => {
  const handleOnExport = () => {
    function mapData(header: HeaderItem[], data: any): DataItem[] {
      return data.map((item: any) => {
        const newItem: DataItem = {};
        header.forEach((headerItem) => {
          if (headerItem.key in item) {
            newItem[headerItem.nameHeader] = item[headerItem.key];
          } else if (headerItem.key === 'proveedorNombre' && item.proveedor) {
            newItem[headerItem.nameHeader] = item.proveedor.nombre;
          } else {
            newItem[headerItem.nameHeader] = null;
          }
        });
        return newItem;
      });
    }

    const mappedData = mapData(header, data);
    console.log(mappedData);

    var workbook = XLSX.utils.book_new();
    var worksheet = XLSX.utils.json_to_sheet(mappedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'test');
    XLSX.writeFile(workbook, `${title}.xlsx`);
  };

  return <div onClick={handleOnExport}>Excel</div>;
};
