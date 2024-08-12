import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import dayjs from 'dayjs';

// Estilos para el documento PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 8,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  table: {
    // display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#E4E4E4',
    padding: 5,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCellHeader: {
    fontWeight: 'bold',
  },
  tableCell: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  textBold: {
    fontWeight: 'bold',
  },
  textRight: {
    textAlign: 'right',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  totalText: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingRight: 10,
  },
});

type Props = {
  articles: {
    id_DetalleVenta: string;
    id_ArticuloExistente: string;
    nombre: string;
    precioUnitario: number;
    cantidad: number;
    precioTotal: number;
    precioIVA: number;
    precioSubTotal: number;
  }[];
};

export const ArticlesSoldReport = ({ articles }: Props) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <View style={{ display: 'flex', justifyContent: 'space-between', flex: 1, flexDirection: 'row' }}>
          <Text>Fecha: {dayjs().format('DD/MM/YYYY - HH:mm')}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Detalles de la venta</Text>
        {articles && articles.length > 0 && (
          <>
            <Text style={styles.header}>Artículos</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCol}>Nombre</Text>
                <Text style={styles.tableCol}>Precio Unitario</Text>
                <Text style={styles.tableCol}>Precio SubTotal</Text>
                <Text style={styles.tableCol}>IVA</Text>
                <Text style={styles.tableCol}>Precio Total</Text>
              </View>
              {articles.map((article, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{article.nombre}</Text>
                  <Text style={styles.tableCell}>{article.precioUnitario.toFixed(2)}</Text>
                  <Text style={styles.tableCell}>{article.precioSubTotal.toFixed(2)}</Text>
                  <Text style={styles.tableCell}>${article.precioIVA.toFixed(2)}</Text>
                  <Text style={styles.tableCell}>${article.precioTotal.toFixed(2)}</Text>
                </View>
              ))}
            </View>
            <View style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Text style={{ textAlign: 'right' }}>
                Total: ${CalculateTotal(articles.flatMap((x) => x.precioTotal.toFixed(2)))}
              </Text>
            </View>
          </>
        )}
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
          <View style={{ border: 1, borderRadius: 5, padding: 5, width: 'auto', minWidth: 150 }}>
            <Text>SubTotal: ${CalculateTotal(articles.flatMap((x) => x.precioSubTotal.toFixed(2)))}</Text>
            <Text>IVA: ${CalculateTotal(articles.flatMap((x) => x.precioIVA.toFixed(2)))}</Text>
            <Text>Total Pago: ${CalculateTotal(articles.flatMap((x) => x.precioTotal.toFixed(2)))}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

function CalculateTotal(data: any[]) {
  return data.reduce((arg, sum) => arg + sum, 0);
}
