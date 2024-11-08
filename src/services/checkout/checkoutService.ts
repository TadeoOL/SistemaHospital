import axios from '../../libs/axios';
import { IConfigEmitterUsers } from '../../types/types';
const apiCheckout = '/api/Caja';

export interface CheckoutResume {
  efectivo: number;
  transferencia: number;
  credito: number;
  debito: number;
  dineroInicial: number;
  resumenVenta: SaleResume[];
}

export interface SaleResume {
  moduloProveniente: string;
  paciente: string;
  folio: string;
  tipoPago: number;
  tieneIVA: boolean;
  totalVenta: number;
  montoPago: number;
}

export const getSells = async (param: string) => {
  const res = await axios.get(`${apiCheckout}/paginacion-ventas?${param}`);
  return res.data;
};

export const registerSell = async (data: {
  paciente: string;
  totalVenta: number;
  moduloProveniente: string;
  notas?: string;
  pdfCadena?: string;
  id_CuentaPaciente?: string;
}) => {
  const res = await axios.post(`${apiCheckout}/registrar-venta`, data);
  return res.data;
};

export const changePrincipalSellStatus = async (data: {
  id_VentaCaja: string;
  estatus: number;
  id_CajaUsuario: string;
  pago: {
    tipoPago: number;
    montoPago: number;
  }[];
  notas?: string;
  factura?: string;
}) => {
  const res = await axios.put(`${apiCheckout}/estatus-venta`, data);
  return res.data;
};

export const getCheckout = async () => {
  const res = await axios.get(`${apiCheckout}/obtener-caja-usuario`);
  return res.data;
};

export const getCheckoutCloses = async (param: string) => {
  const res = await axios.get(`${apiCheckout}/paginacion-cajas?${param}`);
  return res.data;
};

export const openCheckout = async (initialValue: number) => {
  const res = await axios.post(`${apiCheckout}/registrar-caja-usuario`, { dineroInicial: initialValue });
  return res.data;
};

export const getCheckoutConfig = async () => {
  const res = await axios.get(`${apiCheckout}/obtener-configuracion`);
  return res.data as IConfigEmitterUsers[];
};

export const getCheckoutUsers = async () => {
  const res = await axios.get(`${apiCheckout}/obtener-usuarios-emisores`);
  return res.data as { id: string; nombre: string }[];
};

export const getCheckoutResume = async (checkoutId: string) => {
  const res = await axios.get(`${apiCheckout}/resumen-caja/${checkoutId}`);
  return res.data as CheckoutResume;
};

export const closePrincipalCheckout = async (data: { dineroAlCorte: number }) => {
  const res = await axios.put(`${apiCheckout}/cerrar-caja-usuario`, data);
  return res.data;
};

export const getUserEmitterSells = async (param: string) => {
  const res = await axios.get(`${apiCheckout}/paginacion-ventas-emisor?${param}`);
  return res.data;
};

export const changeSellNote = async (data: { id_VentaPrincipal: string; Notas: string }) => {
  const res = await axios.put(`${apiCheckout}/editar-venta-principal`, data);
  return res.data;
};
