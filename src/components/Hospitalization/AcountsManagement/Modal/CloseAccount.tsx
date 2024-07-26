import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import {
  IAcountAllInformation,
  IPatientInAccount,
  IOperatingRoomsAccount,
} from '../../../../types/hospitalizationTypes';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import { useBiomedicalEquipmentPaginationStore } from '../../../../store/hospitalization/biomedicalEquipmentPagination';
import {
  closeRegisterAndAccount,
  getAccountFullInformation,
} from '../../../../services/programming/admissionRegisterService';
import { registerSell } from '../../../../services/checkout/checkoutService';
import { useConnectionSocket } from '../../../../store/checkout/connectionSocket';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { BillCloseReport } from '../../../Export/Account/BillCloseReport';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 650 },
};
const style2 = {
  bgcolor: 'background.paper',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey',
  },
};
interface CloseAccountModalProps {
  setOpen: Function;
  id_Cuenta: string;
  id_Paciente: string;
}

export const CloseAccountModal = (props: CloseAccountModalProps) => {
  const conn = useConnectionSocket((state) => state.conn);
  const [isLoading, setIsLoading] = useState(false);
  const [accountInfo, setAccountInfo] = useState<IAcountAllInformation | null>(null);
  const refetch = useBiomedicalEquipmentPaginationStore((state) => state.fetchData);
  const inputRefDiscount = useRef<HTMLInputElement>(null);
  const inputRefSurgeryDiscount = useRef<HTMLInputElement>(null);

  const [discountflag, setDiscountflag] = useState(false);
  const [discount, setDiscount] = useState('');
  const [discountSurgeryRoomFlag, setDiscountSurgeryRoomFlag] = useState(false);
  const [surgeryPrice, setSurgeryPrice] = useState('');
  const [initialSurgeryPrice, setInitialSurgeryPrice] = useState(0);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      setIsLoading(true);
      try {
        const paramURL = `Id_Paciente=${props.id_Paciente}&Id_CuentaPaciente=${props.id_Cuenta}`;
        const accountRes = await getAccountFullInformation(paramURL);
        setAccountInfo(accountRes);
        let totalQuirofanos = 0;
        accountRes.quirofanos.forEach((quirofano: IOperatingRoomsAccount) => {
          totalQuirofanos += quirofano.precioTotal;
        });
        setInitialSurgeryPrice(totalQuirofanos);
      } catch (error) {
        console.log(error);
        console.log('La cuenta aun no se puede cerrar');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountInfo();
  }, []);

  const handleSubmit = async (totalVentaV: number) => {
    if (!accountInfo) {
      toast.error('No se encontro la cuenta');
      return;
    }
    if (
      discountflag &&
      (inputRefDiscount.current === null ||
        inputRefDiscount.current.value === undefined ||
        isNaN(Number(inputRefDiscount.current.value)) ||
        inputRefDiscount.current.value === '')
    ) {
      toast.error('Ingresa un monto valido parar el descuento');
      return;
    }
    if (conn === null) {
      toast.error('Error, sin conexión al websocket');
      return;
    }
    try {
      await closeRegisterAndAccount({
        Id_Registro: accountInfo.id,
        Id_Paciente: props.id_Paciente,
        Id_CuentaPaciente: props.id_Cuenta,
        TotalCuenta: accountInfo.totalPagoCuenta,
        Descuento: discountflag && inputRefDiscount.current ? Number(inputRefDiscount.current.value) : undefined,
      });
      const object = {
        paciente: `${accountInfo.paciente.nombre || ''} ${accountInfo.paciente.apellidoPaterno || ''} ${accountInfo.paciente.apellidoPaterno || ''}`,
        totalVenta: totalVentaV,
        moduloProveniente: 'Cierre de cuenta',
        id_CuentaPaciente: props.id_Cuenta,
      };
      const res = await registerSell(object);
      const resObj = {
        estatus: res.estadoVenta,
        folio: res.folio,
        id_VentaPrincipal: res.id,
        moduloProveniente: res.moduloProveniente,
        paciente: res.paciente,
        totalVenta: res.totalVenta,
        tipoPago: res.tipoPago,
        id_UsuarioPase: res.id_UsuarioPase,
        nombreUsuario: res.nombreUsuario,
      };
      conn.invoke('SendSell', resObj);

      refetch();
      toast.success('Cierre de cuenta y Pase a caja generado correctamente');
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Error al cerrar la cuenta');
    }
  };

  const acceptRequest = () => {
    let totalVentaV = 0;
    if (discountflag) {
      totalVentaV = parseFloat(discount);
    } else if (discountSurgeryRoomFlag) {
      totalVentaV = parseFloat(
        (
          (accountInfo ? accountInfo.totalPagoCuentaRestante : 0) -
          (initialSurgeryPrice - Number(surgeryPrice))
        ).toFixed(2)
      );
    } else {
      totalVentaV = accountInfo ? accountInfo.totalPagoCuentaRestante : 0;
    }
    withReactContent(Swal).fire({
      title: 'Confirmación',
      text: `¿Estás seguro de CERRAR la cuenta por la cantidad de ${totalVentaV}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        handleSubmit(totalVentaV);
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const handleKeyDownDiscount = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    const regex = /^[0-9.]$/;
    if (
      (!regex.test(key) && event.key !== 'Backspace') || //no numerico y que no sea backspace
      (event.key === '.' && inputRefDiscount.current && inputRefDiscount.current.value.includes('.')) || //punto y ya incluye punto
      (inputRefDiscount.current && Number(inputRefDiscount.current.value + event.key) > 100)
    ) {
      event.preventDefault(); // Evitar la entrada si no es válida
    } else if (
      inputRefDiscount.current &&
      !isNaN(Number(inputRefDiscount.current.value + event.key)) /* && (inputRefDiscount.current.value ! || event.key)*/
    ) {
      setDiscount(
        discountSurgeryRoomFlag
          ? (
              (accountInfo?.totalPagoCuentaRestante || 0) -
              (initialSurgeryPrice - Number(surgeryPrice)) -
              ((accountInfo?.totalPagoCuentaRestante || 0) - (initialSurgeryPrice - Number(surgeryPrice))) *
                (Number(inputRefDiscount.current.value + event.key) / 100)
            ).toFixed(2)
          : (
              (accountInfo?.totalPagoCuentaRestante || 0) -
              (accountInfo?.totalPagoCuentaRestante || 0) * (Number(inputRefDiscount.current.value + event.key) / 100)
            ).toFixed(2)
      );
    }
  };

  const handleKeyDownSurgery = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    const regex = /^[0-9.]$/;
    if (
      (!regex.test(key) && event.key !== 'Backspace') || //no numerico y que no sea backspace
      (inputRefSurgeryDiscount.current &&
        Number(inputRefSurgeryDiscount.current.value + event.key) > initialSurgeryPrice) || // Mayor que el coste de quirofano
      (event.key === '.' && inputRefSurgeryDiscount.current && inputRefSurgeryDiscount.current.value.includes('.')) //punto y ya incluye punto
    ) {
      event.preventDefault(); // Evitar la entrada si no es válida
    } else if (
      (inputRefSurgeryDiscount.current && !isNaN(Number(inputRefSurgeryDiscount.current.value + event.key))) ||
      (inputRefSurgeryDiscount.current && (event.key === 'Backspace' || event.key === '0'))
    ) {
      setSurgeryPrice(inputRefSurgeryDiscount.current.value + event.key);
    }
  };

  const cierreCuenta = {
    "id": "4edbcd31-6944-4f7a-8da8-8551067c9739",
   "cuartos": [
        {
            "id_RegistroCuarto": "69e8673a-2ea7-4e81-9bf2-787dc4250839",
            "nombre": "noombre cuarto",
            "cantidadDias": "1 Dia",
            "precioDia": 120,
            "precioTotal": 120
        }
    ],
    "quirofanos": [
        {
            "id_RegistroCuarto": "69e8673a-2ea7-4e81-9bf2-787dc4250839",
            "nombre": "Quirofano 1",
            "tiempoCirugia": "1 Horas",
            "precioHora": 120,
            "precioTotal": 120
        }
    ],
    "procedimientos": [
        {
            "id": "bf393348-9e0d-45a5-87a0-56951444b88f",
            "nombre": "operacion x",
            "duracionCirujia": "00:20:00",
            "duracionHospitalizacion": 2,
            "precio": 8000.00
        }
    ],
    "registrosRadiografias": [],
    "registrosEquiposBiomedicos": [
        {
            "id_RegistroEquipoBiomedico": "b3efd7ba-b0f4-4497-9d63-5ebf78410659",
            "nombre": "pinzas",
            "precio": 80.00
        }
    ],
    "registrosEquiposBiomedicosHonorario": [],
    "paciente": {
        "nombre": "nnnn",
        "apellidoPaterno": "ppp",
        "apellidoMaterno": "mmm",
        "genero": "Hombre",
        "estadoCivil": null,
        "telefono": null,
        "ocupacion": null,
        "codigoPostal": null,
        "colonia": null,
        "direccion": null,
        "nombreResponsable": null,
        "parentesco": null,
        "domicilioResponsable": null,
        "coloniaResponsable": null,
        "codigoPostalResponsable": null,
        "telefonoResponsable": null,
        "id": "24ce1ba6-9c4a-4419-a8aa-7c8f907a40b9"
    },
    "articulos": [
        {
            "id": "12504c23-c32c-462a-b74c-c00e22932dcf",
            "nombre": "CUBREBOCAS 3 PLIEGUES",
            "cantidad": 1,
            "precioVenta": 54.00
        },
        {
            "id": "8ebbb072-13b1-456f-ad09-3e3b79950201",
            "nombre": "IBUPROFENO ",
            "cantidad": 1,
            "precioVenta": 25.91
        },
        {
            "id": "c078ef20-c140-4879-94ef-6d13bdd65ed8",
            "nombre": "MEDIA ANTIEMBOLICA",
            "cantidad": 1,
            "precioVenta": 891.71
        },
        {
            "id": "c4370a0b-1c04-467f-9193-d9f9e4dd168b",
            "nombre": "FUNDA ",
            "cantidad": 1,
            "precioVenta": 165.60
        }
    ],
    "pagosCuenta": [
        {
            "id": "a13d1a81-06b4-4d57-9bf1-78ff1a917d91",
            "folio": "SCP000109",
            "pagado": true,
            "total": 1900.00
        }
    ],
    "totalPagoCuenta": 10137.22,
    "totalPagoCuentaAbonos": 1900.00,
    "totalPagoCuentaRestante": 8237.22
};

  return (
    <Box sx={style}>
      <HeaderModal
        setOpen={props.setOpen}
        title={`Cierre de cuenta ${
          accountInfo ? ` - Paciente: ${accountInfo.paciente.nombre} ${accountInfo.paciente.apellidoPaterno}` : ''
        }`}
      />
      <Box sx={style2}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={35} />
          </Box>
        ) : (
          accountInfo && (
            <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <PatientInformation patient={accountInfo.paciente} />
              <DataTable
                title="Cuartos"
                data={accountInfo.cuartos}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'cantidadDias', header: 'Cantidad de Dias' },
                  { key: 'precioDia', header: 'Precio por Dia' },
                  { key: 'precioTotal', header: 'Precio Total' },
                ]}
              />
              <DataTable
                title="Quirofanos"
                data={accountInfo.quirofanos}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'tiempoCirugia', header: 'Tiempo de Cirujía' },
                  { key: 'precioHora', header: 'Precio por Hora' },
                  { key: 'precioTotal', header: 'Precio Total' },
                ]}
              />
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <FormControlLabel
                  required
                  control={
                    <Checkbox
                      onChange={() => {
                        setDiscountSurgeryRoomFlag(!discountSurgeryRoomFlag);
                      }}
                    />
                  }
                  label="Cambiar precio de quirofano"
                />
                {discountSurgeryRoomFlag && (
                  <Box>
                    <Typography>Precio de quirofano en total:</Typography>
                    <TextField
                      variant="outlined"
                      inputRef={inputRefSurgeryDiscount}
                      onKeyDown={handleKeyDownSurgery}
                      inputProps={{
                        inputMode: 'decimal',
                        pattern: '[0-9]*',
                      }}
                      size="small"
                      placeholder="Monto"
                    />
                  </Box>
                )}
              </Box>
              <DataTable
                title="Procedimientos"
                data={accountInfo.procedimientos}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'duracionCirujia', header: 'Duración de Cirugía' },
                  { key: 'duracionHospitalizacion', header: 'Duración de la Hospitalización' },
                  { key: 'precio', header: 'Precio Total' },
                ]}
              />
              <DataTable
                title="Estudios de Gabinete"
                data={accountInfo.registrosRadiografias}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'nombreSolicitante', header: 'Nombre del Solicitante' },
                  { key: 'precio', header: 'Precio' },
                  { key: 'estatus', header: 'Estatus' },
                  { key: 'folio', header: 'Folio' },
                ]}
              />
              <DataTable
                title="Equipos Biomédicos"
                data={accountInfo.registrosEquiposBiomedicos}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'precio', header: 'Precio' },
                ]}
              />
              <DataTable
                title="Equipos Biomédicos Externos"
                data={accountInfo.registrosEquiposBiomedicosHonorario}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'precio', header: 'Precio' },
                ]}
              />
              <DataTable
                title="Artículos"
                data={accountInfo.articulos}
                columns={[
                  { key: 'nombre', header: 'Nombre' },
                  { key: 'cantidad', header: 'Cantidad' },
                  { key: 'precioVenta', header: 'Precio de Venta' },
                ]}
              />
              <DataTable
                title="Pagos de la Cuenta"
                data={accountInfo.pagosCuenta}
                columns={[
                  { key: 'folio', header: 'Folio' },
                  { key: 'total', header: 'Monto' },
                ]}
              />
              <Typography textAlign={'center'} variant="h4">
                <b>Cuenta Actual:</b> {accountInfo?.totalPagoCuenta}
              </Typography>
              <Typography textAlign={'center'} variant="h4">
                <b>Abonos:</b> {accountInfo?.totalPagoCuentaAbonos}
              </Typography>
            </Box>
          )
        )}
      </Box>
      <Typography sx={{ bgcolor: 'background.paper', py: 2 }} textAlign={'center'} variant="h4">
        <b>Total Restante:</b> {accountInfo?.totalPagoCuentaRestante}
        {discountSurgeryRoomFlag ? ` - ${(initialSurgeryPrice - Number(surgeryPrice)).toFixed(2)}` : ``}
      </Typography>
      <Box sx={{ bgcolor: 'background.paper', py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
          <FormControlLabel
            required
            control={
              <Checkbox
                onChange={() => {
                  setDiscountflag(!discountflag);
                }}
              />
            }
            label="Aplicar descuento"
          />
          {discountflag && (
            <Box>
              <Typography>Descuento en porcentaje</Typography>
              <TextField
                variant="outlined"
                inputRef={inputRefDiscount}
                onKeyDown={handleKeyDownDiscount}
                inputProps={{
                  inputMode: 'decimal',
                  pattern: '[0-9]*',
                }}
                size="small"
                placeholder="Descuento"
              />
            </Box>
          )}
        </Box>

        {discountflag && (
          <Box sx={{ my: 1 }}>
            <Typography textAlign={'center'} variant="h5">
              Total con descuento:
              {discount}
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          bgcolor: 'background.paper',
          display: 'flex',
          justifyContent: 'space-between',
          p: 1,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <Button variant="outlined" color="error" onClick={() => props.setOpen(false)}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          type="submit"
          disabled={isLoading}
          onClick={() => {
            acceptRequest();
          }}
        >
          {isLoading ? <CircularProgress size={25} /> : 'Cerrar Cuenta'}
        </Button>
        <PDFDownloadLink
              document={<BillCloseReport cierreCuenta={cierreCuenta as any} />}
              fileName={`${Date.now()}.pdf`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {({ loading }) => <Button variant="contained">{loading ? 'Generando PDF...' : 'Descargar PDF'}</Button>}
            </PDFDownloadLink>
      </Box>
    </Box>
  );
};

interface PatientInformationProps {
  patient: IPatientInAccount;
}

export const PatientInformation: React.FC<PatientInformationProps> = ({ patient }) => (
  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mx: 4, mt: 2.5 }}>
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6">
        <b>Información del Paciente</b>
      </Typography>
      <Typography>
        <b>Nombre:</b> {`${patient.nombre} ${patient.apellidoPaterno} ${patient.apellidoMaterno}`}
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography>
        <b>Género:</b> {patient.genero}
      </Typography>
    </Box>
  </Box>
);

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
}
interface Column<T> {
  key: keyof T;
  header: string;
}

export const DataTable = <T,>({ title, data, columns }: DataTableProps<T>) => (
  <Box sx={{ p: 1, width: '100%', margin: 'auto', fontSize: '0.875rem' }}>
    <Typography variant="h6" sx={{ mb: 2, fontSize: '1.1rem' }}>
      {title}
    </Typography>
    <TableContainer sx={{ border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.875rem' }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={String(col.key)} sx={{ p: 1, fontSize: '0.875rem' }}>
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((col) => (
                  <TableCell key={String(col.key)} sx={{ p: 1, fontSize: '0.875rem' }}>
                    {String(row[col.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ p: 1, fontSize: '0.875rem', textAlign: 'center' }}>
                No hay datos disponibles
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);
