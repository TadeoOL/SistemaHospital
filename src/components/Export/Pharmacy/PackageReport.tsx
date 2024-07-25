import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos para el documento PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  table: {
    // display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 8,
  },
  header: {
    fontSize: 8,
    fontWeight: 'bold',
  },
});

type Lote = {
  id_ArticuloExistente: string;
  id_Articulo: string;
  nombre: string;
  cantidad: number;
  fechaCaducidad: string;
};

type Articulo = {
  id_Articulo: string;
  nombre: string;
  cantidadSeleccionar: number;
  cantidad: number;
  lote: Lote[];
};

type Props = {
  articulos: Articulo[];
};

export const PackageReport = ({ articulos }: Props) => {
  console.log(articulos);
  if (articulos == null) {
    return <></>;
  } else {
    return (
      <>
        <Document>
          <Page style={styles.page}>
            <View style={styles.table}>
              {/* Cabecera de la tabla */}
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.header]}>Nombre</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.header]}>Cantidad</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.header]}>Lote</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.header]}>Solicito</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.header]}>Recibo</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.header]}>Cargo</Text>
                </View>
              </View>
              {/* Cuerpo de la tabla */}
              {articulos.map((articulo) =>
                articulo.lote.map((lote, index) => (
                  <View style={styles.tableRow} key={`${articulo.id_Articulo}-${index}`}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{articulo.nombre}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{lote.cantidad}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {lote.fechaCaducidad === '01/01/4000' ? 'Sin Caducidad' : lote.fechaCaducidad}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}></Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}></Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}></Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </Page>
        </Document>
      </>
    );
  }
};
