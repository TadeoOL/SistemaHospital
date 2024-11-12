import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { ISale } from '../../../types/pharmacy/pointOfSaleTypes';

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

type Sell = {
  venta: ISale;
};

export const ArticlesSoldReport = ({ venta }: Sell) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <View style={{ display: 'flex', justifyContent: 'space-between', flex: 1, flexDirection: 'row' }}>
          <Text>Fecha: {dayjs().format('DD/MM/YYYY - HH:mm')}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Punto de Venta</Text>
        {venta.articulos && venta.articulos.length > 0 && (
          <>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCol}>Nombre</Text>
                <Text style={styles.tableCol}>Precio Unitario</Text>
                <Text style={styles.tableCol}>Precio SubTotal</Text>
                <Text style={styles.tableCol}>IVA</Text>
                <Text style={styles.tableCol}>Precio Total</Text>
              </View>
              {venta.articulos.map((articulo, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>$ {articulo.nombre}</Text>
                  <Text style={styles.tableCell}>$ {articulo.precioUnitario}</Text>
                  <Text style={styles.tableCell}>$ {articulo.precioBruto}</Text>
                  <Text style={styles.tableCell}>$ {articulo.iva}</Text>
                  <Text style={styles.tableCell}>$ {articulo.totalVenta}</Text>
                </View>
              ))}
            </View>
          </>
        )}
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
          <View style={{ border: 1, borderRadius: 5, padding: 5, width: 'auto', minWidth: 150 }}>
            <Text>SubTotal: $ {venta.subTotal}</Text>
            <Text>IVA: $ {venta.iva}</Text>
            <Text>Total Pago: $ {venta.totalVenta}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
