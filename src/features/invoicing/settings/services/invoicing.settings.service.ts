import axios from '@/libs/axios';
import { InvoiceSettings } from '../types/invoicing.settings.types';
const baseUrl = '/api/Sistema';

export const getInvoicingSettings = async (): Promise<InvoiceSettings> => {
  const response = await axios.get(`${baseUrl}/obtener-configuracion/Facturacion`);
  return response.data;
};
