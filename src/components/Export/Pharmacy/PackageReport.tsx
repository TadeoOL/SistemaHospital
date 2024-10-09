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

type Articulo = {
  nombre: string;
  cantidad: number;
};

type BillCloseReportprops = {
  cuartos: string;
  horaCirugia: string;
  nombreDoctor: string;
  edadPaciente: string;
  articulos: Articulo[];
  notas?: string;
};

export const PackageReport = (  props: BillCloseReportprops) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Información de la cirugía</Text>
        <Text>
          Nombre del doctor: {props.nombreDoctor}
        </Text>
        <Text>
          Edad del paciente: {props.edadPaciente}
        </Text>
        <Text>
          Hora cirugia: {props.horaCirugia}
        </Text>
        <Text>
          Cuarto: {props.cuartos}
        </Text>
        <Text>Fecha: {dayjs().format('DD/MM/YYYY - HH:mm')}</Text>
        {/*<Text>Nombre Doctor: {props.medico}</Text>*/}
      </View>
      <View style={styles.section}>
        {props.articulos && props.articulos.length > 0 && (
          <>
            <Text style={styles.header}>Artículos</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCol}>Nombre</Text>
                <Text style={styles.tableCol}>Cantidad</Text>
              </View>
              {props.articulos.map((articulo, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{articulo.nombre}</Text>
                  <Text style={styles.tableCell}>{articulo.cantidad}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </Page>
  </Document>
);
