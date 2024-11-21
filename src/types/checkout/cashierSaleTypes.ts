import { IBasicUserInformation } from "../userType";

export interface ICashierSale {
    id:string;
    id_CajaUsuario?: string;
    id_UsuarioVenta: string;
    folio: string;
    conceptoVenta: number;
    estadoVenta: number;
    subTotal: number;
    iva: number;
    totalVenta: number;
    tipoPago?: number;
    montoPago?: number;
    notas?: string;
    usuarioVenta?: IBasicUserInformation;
}
