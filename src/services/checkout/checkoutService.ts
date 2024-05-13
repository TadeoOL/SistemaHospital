import axios from '../../libs/axios';
import { IConfigEmitterUsers } from '../../types/types';
const apiCheckout = '/api/CorteCaja';

export interface CheckoutResume {
  efectivo: number;
  tarjeta: number;
  transferencia: number;
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

export const registerSell = async (data: { paciente: string; totalVenta: number; moduloProveniente: string }) => {
  const res = await axios.post(`${apiCheckout}/registrar-venta`, data);
  return res.data;
};

export const changePrincipalSellStatus = async (data: {
  id_VentaPrincipal: string;
  estatus: number;
  id_CajaPrincipal: string;
  tieneIva: boolean;
  tipoPago: number;
  montoPago: number;
}) => {
  const res = await axios.put(`${apiCheckout}/estatus-venta`, data);
  return res.data;
};

export const getCheckout = async () => {
  const res = await axios.get(`${apiCheckout}/obtener-caja-principal`);
  return res.data;
};

export const openCheckout = async (initialValue: number) => {
  const res = await axios.post(`${apiCheckout}/abrir-caja`, { dineroInicial: initialValue });
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
  const res = await axios.get(`${apiCheckout}/resumen-corte-caja/${checkoutId}`);
  return res.data as CheckoutResume;
};
