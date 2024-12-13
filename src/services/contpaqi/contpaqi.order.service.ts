const baseUrl = '/api/pedidos';
import axios from '@/libs/axiosContpaqi';
import { IInvoiceItem } from '@/types/hospitalizationTypes';

export interface objOrderRequest {
    tipoPedido: number;
    subTotal: number;
    iva: number;
    total: number;
    nombrePaciente: string;
    productosFactura: IInvoiceItem[];
}

export namespace ContpaqiOrderService {
    export const requestOrder = async (data: objOrderRequest) => {
        const res = await axios.post(`${baseUrl}/generar-pedido`, data);
        return res.data;
    };
}