import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { InurseRequest } from '../../../types/types';

// Estilos para el documento PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 12,
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
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#E4E4E4',
    padding: 5,
  },
  tableCol: {
    width: '50%',
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
    width: '50%',
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
    fontSize: 12,
    fontWeight: 'bold',
    paddingRight: 10,
  },
});

type Props = {
  request: InurseRequest;
};

export const NurseRequestReport = ({ request }: Props) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Solicitud de enfermero</Text>
        <Text>
          Nombre del Paciente: {request.pacienteNombre} Cuarto: {request.cuarto}
        </Text>
        <Text>Solicitado por: {request.usuarioEmisorNombre}</Text>
        {request.usuarioEntregoNombre !== '' && <Text>Armado por: {request.usuarioEntregoNombre}</Text>}
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Articulos</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Nombre</Text>
            <Text style={styles.tableCol}>Cantidad</Text>
          </View>
          {request.articulos !== null &&
            request.articulos.map((cuarto, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{cuarto.nombre}</Text>
                <Text style={styles.tableCell}>{cuarto.cantidad}</Text>
              </View>
            ))}
        </View>
        <Text>folio: {request.folio}</Text>
        <Text>fecha de solicitud: {request.fechaSolicitud}</Text>
      </View>
    </Page>
  </Document>
);
