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
