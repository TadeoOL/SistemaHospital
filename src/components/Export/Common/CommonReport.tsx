import { Document, Page, Text, StyleSheet, View, Font } from '@react-pdf/renderer';

// Registrar la fuente Helvetica
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helvetica/v8/4UaHrEJwXsklSGK3lt-w.ttf' },
    { src: 'https://fonts.gstatic.com/s/helvetica/v8/4UaHrEJwXsklSGK3lt-w.ttf', fontWeight: 'bold' },
  ],
});

// Definir estilos
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    display: 'flex',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#b0b0b0',
    borderCollapse: 'collapse',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCellHeader: {
    backgroundColor: '#004080', // Color azul para el encabezado
    borderBottomWidth: 1,
    borderBottomColor: '#b0b0b0',
    borderBottomStyle: 'solid',
    padding: 8,
    fontWeight: 'bold',
    color: '#FFFFFF', // Texto en blanco
    fontSize: 9,
    flexGrow: 1,
    width: '33.33%', // Para dividir el ancho de la tabla entre tres columnas
  },
  tableCell: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderBottomStyle: 'solid',
    padding: 8,
    fontSize: 9,
    flexGrow: 1,
    width: '33.33%', // Para dividir el ancho de la tabla entre tres columnas
  },
  tableCellOdd: {
    backgroundColor: '#f3f3f3', // Color gris claro para celdas impares
  },
  tableCellEven: {
    backgroundColor: '#FFFFFF', // Color blanco para celdas pares
  },
});

export const CommonReport = ({ title, header, data }: CommonExportProps) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          {header.map((item, index: number) => (
            <Text style={styles.tableCellHeader} key={index}>
              {item.nameHeader}
            </Text>
          ))}
        </View>
        {data.map((item: any, index: number) => (
          <View style={styles.tableRow} key={index}>
            {header.map((headerItem: HeaderItem, headerIndex) => (
              <Text
                key={headerIndex}
                style={[styles.tableCell, index % 2 ? styles.tableCellOdd : styles.tableCellEven]}
              >
                {headerItem.key in item ? item[headerItem.key] : ''}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
