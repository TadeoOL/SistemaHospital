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
    fontSize: 12,
  },
  header: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

type Articulo = {
  id_Articulo: string;
  nombre: string;
  cantidadSeleccionar: number;
  cantidad: number;
};

type Props = {
  articulos: Articulo[];
  //recibio: any;
  //cargo: any;
};

export const PackageReport = ({ articulos }: Props) => {
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
              {articulos.map((articulo, index) =>
                  <View style={styles.tableRow} key={`${articulo.id_Articulo}-${index}`}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{articulo.nombre}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{articulo.cantidad}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell/*Solicito */}></Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell/*Recibo*/}></Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell/*Cargo*/}></Text>
                    </View>
                  </View>
              )}
            </View>
          </Page>
        </Document>
      </>
    );
  }
};
