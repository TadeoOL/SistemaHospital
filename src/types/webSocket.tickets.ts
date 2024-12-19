export interface WebSocketSellTicket {
  tipoMensaje: number;
  venta: {
    folio: string;
    subTotal: number;
    iva: number;
    totalVenta: number;
    usuarioVenta: string;
    articulos: WebSocketSellTicketArticle[];
  };
}

export interface WebSocketSellTicketArticle {
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface WebSocketRequestArticles {
  tipoMensaje: 2;
  solicitudEnfermero: {
    nombreEnfermero: string;
    nombrePaciente: string;
    cuarto: string;
    folio: string;
    entregadoPor: string;
    tipoSolicitud: string;
    fechaSolicitud: string;
    articulos: Omit<WebSocketSellTicketArticle, 'precio'>[];
  };
}
