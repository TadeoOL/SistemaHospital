import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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

type Cuarto = {
  id_RegistroCuarto: string;
  nombre: string;
  cantidadDias: string;
  precioDia: number;
  precioTotal: number;
};

type Quirofano = {
  id_RegistroCuarto: string;
  nombre: string;
  tiempoCirugia: string;
  precioHora: number;
  precioTotal: number;
};

type Procedimiento = {
  id: string;
  nombre: string;
  duracionCirujia: string;
  duracionHospitalizacion: number;
  precio: number;
};

type EquipoBiomedico = {
  id_RegistroEquipoBiomedico: string;
  nombre: string;
  precio: number;
};

type Articulo = {
  id: string;
  nombre: string;
  cantidad: number;
  precioVenta: number;
};

type Pago = {
  id: string;
  folio: string;
  pagado: boolean;
  total: number;
};

type EstudiosDeGabinete = {
  id_RegistroRadiografia: string;
  folio: string;
  nombreSolicitante: string;
  nombre: string;
  pagado: boolean;
  precio: number;
  estatus: number;
};

type Paciente = {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  genero: string;
  estadoCivil: string | null;
  telefono: string | null;
  ocupacion: string | null;
  codigoPostal: string | null;
  colonia: string | null;
  direccion: string | null;
  nombreResponsable: string | null;
  parentesco: string | null;
  domicilioResponsable: string | null;
  coloniaResponsable: string | null;
  codigoPostalResponsable: string | null;
  telefonoResponsable: string | null;
  id: string;
};

type CierreCuenta = {
  id: string;
  cuartos: Cuarto[];
  quirofanos: Quirofano[];
  procedimientos: Procedimiento[];
  registrosRadiografias: EstudiosDeGabinete[];
  registrosEquiposBiomedicos: EquipoBiomedico[];
  registrosEquiposBiomedicosHonorario: any[];
  paciente: Paciente;
  articulos: Articulo[];
  pagosCuenta: Pago[];
  subtotalPagoCuenta: number;
  totalPagoCuenta: number;
  totalPagoCuentaAbonos: number;
  totalPagoCuentaRestante: number;
  subtotalPagoCuentaRestante: number;
};

type Props = {
  cierreCuenta: CierreCuenta;
  descuento?: string;
  total: number | string;
  notas?: string;
};

export const BillCloseReport = ({ cierreCuenta, descuento, total, notas }: Props) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Información del Paciente</Text>
        <Text>
          Nombre: {cierreCuenta.paciente.nombre} {cierreCuenta.paciente.apellidoPaterno}{' '}
          {cierreCuenta.paciente.apellidoMaterno}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Detalles de la Cuenta</Text>
        <Text style={styles.header}>Cuartos</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Nombre</Text>
            <Text style={styles.tableCol}>Cantidad Días</Text>
            <Text style={styles.tableCol}>Precio por Día</Text>
            <Text style={styles.tableCol}>Precio Total</Text>
          </View>
          {cierreCuenta.cuartos.map((cuarto, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{cuarto.nombre}</Text>
              <Text style={styles.tableCell}>{cuarto.cantidadDias}</Text>
              <Text style={styles.tableCell}>$ {cuarto.precioDia}</Text>
              <Text style={styles.tableCell}>$ {cuarto.precioTotal}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.header}>Quirófanos</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Nombre</Text>
            <Text style={styles.tableCol}>Tiempo Cirugía</Text>
            <Text style={styles.tableCol}>Precio por Hora</Text>
            <Text style={styles.tableCol}>Precio Total</Text>
          </View>
          {cierreCuenta.quirofanos.map((quirofano, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{quirofano.nombre}</Text>
              <Text style={styles.tableCell}>{quirofano.tiempoCirugia}</Text>
              <Text style={styles.tableCell}>{quirofano.precioHora}</Text>
              <Text style={styles.tableCell}>$ {quirofano.precioTotal}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.header}>Procedimientos</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Nombre</Text>
            <Text style={styles.tableCol}>Duración Cirugía</Text>
            <Text style={styles.tableCol}>Duración Hospitalización</Text>
            <Text style={styles.tableCol}>Precio</Text>
          </View>
          {cierreCuenta.procedimientos.map((procedimiento, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{procedimiento.nombre}</Text>
              <Text style={styles.tableCell}>{procedimiento.duracionCirujia}</Text>
              <Text style={styles.tableCell}>{procedimiento.duracionHospitalizacion}</Text>
              <Text style={styles.tableCell}>$ {procedimiento.precio}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.header}>Estudios de Gabinete</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Folio</Text>
            <Text style={styles.tableCol}>Nombre</Text>
            <Text style={styles.tableCol}>Precio</Text>
          </View>
          {cierreCuenta.registrosRadiografias.map((estudio, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{estudio.folio}</Text>
              <Text style={styles.tableCell}>{estudio.nombre}</Text>
              <Text style={styles.tableCell}>$ {estudio.precio}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.header}>Equipos Biomédicos</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Nombre</Text>
            <Text style={styles.tableCol}>Precio</Text>
          </View>
          {cierreCuenta.registrosEquiposBiomedicos.map((equipo, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{equipo.nombre}</Text>
              <Text style={styles.tableCell}>$ {equipo.precio}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.header}>Artículos</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Nombre</Text>
            <Text style={styles.tableCol}>Cantidad</Text>
            <Text style={styles.tableCol}>Precio Venta</Text>
          </View>
          {cierreCuenta.articulos.map((articulo, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{articulo.nombre}</Text>
              <Text style={styles.tableCell}>{articulo.cantidad}</Text>
              <Text style={styles.tableCell}>$ {articulo.precioVenta}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.header}>Pagos</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Folio</Text>
            <Text style={styles.tableCol}>Pagado</Text>
            <Text style={styles.tableCol}>Total</Text>
          </View>
          {cierreCuenta.pagosCuenta.map((pago, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{pago.folio}</Text>
              <Text style={styles.tableCell}>{pago.pagado ? 'Sí' : 'No'}</Text>
              <Text style={styles.tableCell}>$ {pago.total}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.header}>Totales</Text>
        <Text>SubTotal: {cierreCuenta.subtotalPagoCuenta}</Text>
        <Text>Impuesto: {(cierreCuenta.totalPagoCuenta - cierreCuenta.subtotalPagoCuenta).toFixed(2)}   IVA: 16%</Text>
        <Text>Total Pago Cuenta: $ {cierreCuenta.totalPagoCuenta}</Text>
        <Text>Total Abonos: $ {cierreCuenta.totalPagoCuentaAbonos}</Text>
        {descuento && <Text>Descuento: {descuento}%</Text>}
        <Text>Total Restante: $ {total}</Text>
        <Text>Notas: {notas}</Text>
      </View>
    </Page>
  </Document>
);