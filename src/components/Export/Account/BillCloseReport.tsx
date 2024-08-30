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

type Cuarto = {
  id_RegistroCuarto: string;
  nombre: string;
  cantidadDias: string;
  precioDia: number;
  precioTotal: number;
  precioNeto: number;
  precioIVA: number;
};

type Quirofano = {
  id_RegistroCuarto: string;
  nombre: string;
  tiempoCirugia: string;
  precioHora: number;
  precioTotal: number;
  precioNeto: number;
  precioIVA: number;
};

type Procedimiento = {
  id: string;
  nombre: string;
  duracionCirujia: string;
  duracionHospitalizacion: number;
  precio: number;
  precioNeto: number;
  precioIVA: number;
};

type EquipoBiomedico = {
  id_RegistroEquipoBiomedico: string;
  nombre: string;
  precio: number;
  precioNeto: number;
  precioIVA: number;
};

type Articulo = {
  id: string;
  nombre: string;
  cantidad: number;
  precioVenta: number;
  precioNeto: number;
  precioIVA: number;
  precioTotal: number;
  solicitud: string;
  fechaSolicitado: string;
};

type Pago = {
  id: string;
  folio: string;
  pagado: boolean;
  fechaPago: string;
  total: number;
};

type EstudiosDeGabinete = {
  id_RegistroRadiografia: string;
  folio: string;
  nombreSolicitante: string;
  nombre: string;
  pagado: boolean;
  precio: number;
  precioNeto: number;
  precioIVA: number;
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
  medico: string;
  tipoOperacion: string;
  esHospitalizacion: string;
  notas: string;
  iva: number;
  subTotal: number;
};

type Props = {
  cierreCuenta: CierreCuenta;
  descuento?: string;
  total?: number | string;
  notas?: string;
};

export const BillCloseReport = ({ cierreCuenta, descuento, total, notas }: Props) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Información del Paciente</Text>
        <View style={{ display: 'flex', justifyContent: 'space-between', flex: 1, flexDirection: 'row' }}>
          <Text>
            Nombre: {cierreCuenta.paciente.nombre} {cierreCuenta.paciente.apellidoPaterno}{' '}
            {cierreCuenta.paciente.apellidoMaterno}
          </Text>
          <Text>Fecha: {dayjs().format('DD/MM/YYYY - HH:mm')}</Text>
        </View>
        <Text style={{ marginTop: 10 }}>Nombre Doctor: {cierreCuenta.medico}</Text>
        <Text style={{ marginTop: 10 }}>
          Tipo: {cierreCuenta.esHospitalizacion ? 'Hospitalización' : 'Ambulatoria o Endopro'}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Detalles de la Cuenta</Text>
        {cierreCuenta.cuartos && cierreCuenta.cuartos.length > 0 && (
          <>
            <Text style={styles.header}>Cuartos</Text>
            <View style={styles.table}>
              <View>
                <Text style={styles.tableCol}>Nombre</Text>
                <Text style={styles.tableCol}>Cantidad Días</Text>
                <Text style={styles.tableCol}>Precio por Día</Text>
                <Text style={styles.tableCol}>Precio Neto</Text>
                <Text style={styles.tableCol}>IVA</Text>
                <Text style={styles.tableCol}>Precio Total</Text>
              </View>
              {cierreCuenta.cuartos.map((cuarto, index) => (
                <View key={index}>
                  <Text style={styles.tableCell}>{cuarto.nombre}</Text>
                  <Text style={styles.tableCell}>{cuarto.cantidadDias}</Text>
                  <Text style={styles.tableCell}>${cuarto.precioDia}</Text>
                  <Text style={styles.tableCell}>${cuarto.precioNeto}</Text>
                  <Text style={styles.tableCell}>${cuarto.precioIVA}</Text>
                  <Text style={styles.tableCell}>${cuarto.precioTotal}</Text>
                </View>
              ))}
            </View>
            <View style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Text style={{ textAlign: 'right' }}>
                Total: ${CalculateTotal(cierreCuenta.cuartos.flatMap((x) => x.precioTotal))}
              </Text>
            </View>
          </>
        )}
        {cierreCuenta.quirofanos && cierreCuenta.quirofanos.length > 0 && (
          <>
            <Text style={styles.header}>Quirófanos</Text>
            <View style={styles.table}>
              <View>
                <Text style={styles.tableCol}>Nombre</Text>
                <Text style={styles.tableCol}>Tiempo Cirugía</Text>
                {/* <Text style={styles.tableCol}>Precio por Hora</Text> */}
                <Text style={styles.tableCol}>Precio Neto</Text>
                <Text style={styles.tableCol}>IVA</Text>
                <Text style={styles.tableCol}>Precio Total</Text>
              </View>
              {cierreCuenta.quirofanos.map((quirofano, index) => (
                <View key={index}>
                  <Text style={styles.tableCell}>{quirofano.nombre}</Text>
                  <Text style={styles.tableCell}>{quirofano.tiempoCirugia}</Text>
                  {/* <Text style={styles.tableCell}>${quirofano.precioHora}</Text> */}
                  <Text style={styles.tableCell}>${quirofano.precioNeto}</Text>
                  <Text style={styles.tableCell}>${quirofano.precioIVA}</Text>
                  <Text style={styles.tableCell}>$ {quirofano.precioTotal}</Text>
                </View>
              ))}
            </View>
            <View style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Text style={{ textAlign: 'right' }}>
                Total: ${CalculateTotal(cierreCuenta.quirofanos.flatMap((x) => x.precioTotal))}
              </Text>
            </View>
          </>
        )}
        {cierreCuenta.procedimientos && cierreCuenta.procedimientos.length > 0 && (
          <>
            <Text style={styles.header}>Procedimientos</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCol}>Nombre</Text>
                <Text style={styles.tableCol}>Precio Neto</Text>
                <Text style={styles.tableCol}>IVA</Text>
                <Text style={styles.tableCol}>Precio Total</Text>
              </View>
              {cierreCuenta.procedimientos.map((procedimiento, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{procedimiento.nombre}</Text>
                  <Text style={styles.tableCell}>${procedimiento.precioNeto}</Text>
                  <Text style={styles.tableCell}>${procedimiento.precioIVA}</Text>
                  <Text style={styles.tableCell}>${procedimiento.precio}</Text>
                </View>
              ))}
            </View>
            <View style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Text style={{ textAlign: 'right' }}>
                Total: ${CalculateTotal(cierreCuenta.procedimientos.flatMap((x) => x.precio))}
              </Text>
            </View>
          </>
        )}
        {((cierreCuenta.registrosRadiografias && cierreCuenta.registrosRadiografias.length > 0) ||
          (cierreCuenta.registrosEquiposBiomedicosHonorario &&
            cierreCuenta.registrosEquiposBiomedicosHonorario.length > 0)) && (
          <>
            <Text style={styles.header}>Estudios de Gabinete y/o Equipo Honorario</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCol}>Nombre</Text>
                <Text style={styles.tableCol}>Precio Neto</Text>
                <Text style={styles.tableCol}>IVA</Text>
                <Text style={styles.tableCol}>Precio Total</Text>
              </View>
              {cierreCuenta.registrosRadiografias.map((estudio, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{estudio.nombre}</Text>
                  <Text style={styles.tableCell}>${estudio.precioNeto}</Text>
                  <Text style={styles.tableCell}>${estudio.precioIVA}</Text>
                  <Text style={styles.tableCell}>${estudio.precio}</Text>
                </View>
              ))}
              {cierreCuenta.registrosEquiposBiomedicosHonorario.map((equipo, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{equipo.nombre}</Text>
                  <Text style={styles.tableCell}>${equipo.precioNeto}</Text>
                  <Text style={styles.tableCell}>${equipo.precioIVA}</Text>
                  <Text style={styles.tableCell}>${equipo.precio}</Text>
                </View>
              ))}
            </View>
            <View style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Text style={{ textAlign: 'right' }}>
                Total: $
                {CalculateTotal(
                  cierreCuenta.registrosEquiposBiomedicosHonorario
                    .flatMap((x) => x.precio)
                    .concat(cierreCuenta.registrosRadiografias.flatMap((x) => x.precio))
                )}
              </Text>
            </View>
          </>
        )}
        {cierreCuenta.registrosEquiposBiomedicos && cierreCuenta.registrosEquiposBiomedicos.length > 0 && (
          <>
            <Text style={styles.header}>Equipos Biomédicos</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCol}>Nombre</Text>
                <Text style={styles.tableCol}>Precio Neto</Text>
                <Text style={styles.tableCol}>IVA</Text>
                <Text style={styles.tableCol}>Precio Total</Text>
              </View>
              {cierreCuenta.registrosEquiposBiomedicos.map((equipo, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{equipo.nombre}</Text>
                  <Text style={styles.tableCell}>${equipo.precioNeto}</Text>
                  <Text style={styles.tableCell}>${equipo.precioIVA}</Text>
                  <Text style={styles.tableCell}>${equipo.precio}</Text>
                </View>
              ))}
            </View>
            <View style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Text style={{ textAlign: 'right' }}>
                Total: ${CalculateTotal(cierreCuenta.registrosEquiposBiomedicos.flatMap((x) => x.precio))}
              </Text>
            </View>
          </>
        )}
        {cierreCuenta.articulos && cierreCuenta.articulos.length > 0 && (
          <>
            <Text style={styles.header}>Artículos</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCol}>Nombre</Text>
                <Text style={styles.tableCol}>Cantidad</Text>
                <Text style={styles.tableCol}>Solicitud</Text>
                <Text style={styles.tableCol}>Fecha Solicitado</Text>
                <Text style={styles.tableCol}>Precio Unitario</Text>
                <Text style={styles.tableCol}>Precio Neto</Text>
                <Text style={styles.tableCol}>IVA</Text>
                <Text style={styles.tableCol}>Precio Total</Text>
              </View>
              {cierreCuenta.articulos.map((articulo, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{articulo.nombre}</Text>
                  <Text style={styles.tableCell}>{articulo.cantidad}</Text>
                  <Text style={styles.tableCell}>{articulo.solicitud}</Text>
                  <Text style={styles.tableCell}>{articulo.fechaSolicitado}</Text>
                  <Text style={styles.tableCell}>${articulo.precioVenta}</Text>
                  <Text style={styles.tableCell}>${articulo.precioNeto}</Text>
                  <Text style={styles.tableCell}>${articulo.precioIVA}</Text>
                  <Text style={styles.tableCell}>${articulo.precioTotal}</Text>
                </View>
              ))}
            </View>
            <View style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Text style={{ textAlign: 'right' }}>
                Total: ${CalculateTotal(cierreCuenta.articulos.flatMap((x) => x.precioTotal))}
              </Text>
            </View>
          </>
        )}
        {cierreCuenta.pagosCuenta && cierreCuenta.pagosCuenta.length > 0 && (
          <>
            <Text style={styles.header}>Pagos</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCol}>Folio</Text>
                <Text style={styles.tableCol}>Pagado</Text>
                <Text style={styles.tableCol}>Fecha de Pago</Text>
                <Text style={styles.tableCol}>Importe</Text>
              </View>
              {cierreCuenta.pagosCuenta.map((pago, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{pago.folio}</Text>
                  <Text style={styles.tableCell}>{pago.pagado ? 'Sí' : 'No'}</Text>
                  <Text style={styles.tableCell}>{pago.fechaPago}</Text>
                  <Text style={styles.tableCell}>$ {pago.total}</Text>
                </View>
              ))}
            </View>
            <View style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <Text style={{ textAlign: 'right' }}>
                Total: ${CalculateTotal(cierreCuenta.pagosCuenta.flatMap((x) => x.total))}
              </Text>
            </View>
          </>
        )}
        <Text style={styles.header}>Totales</Text>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
          <View style={{ border: 1, borderRadius: 5, padding: 5, width: 'auto', minWidth: 150 }}>
            <Text>SubTotal: ${cierreCuenta.subTotal}</Text>
            <Text>IVA: ${cierreCuenta.iva}</Text>
            <Text>Total Pago Cuenta: ${cierreCuenta.totalPagoCuenta}</Text>
          </View>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
          <View style={{ border: 1, borderRadius: 5, padding: 5, width: 'auto', minWidth: 150 }}>
            <Text>Total Abonos: ${cierreCuenta.totalPagoCuentaAbonos}</Text>
            {descuento && <Text>Descuento: {descuento}%</Text>}
            <Text>Total Restante: ${total}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          display: 'flex',
          flex: 1,
          border: 1,
          borderRadius: 5,
        }}
      >
        <Text style={{ padding: 2 }}>Notas: {notas + ' ' + cierreCuenta.notas}</Text>
      </View>
    </Page>
  </Document>
);

function CalculateTotal(data: any[]) {
  return data.reduce((arg, sum) => arg + sum, 0);
}
