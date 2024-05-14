import { Outlet } from 'react-router-dom';
import LoadingView from '../views/LoadingView/LoadingView';
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useEffect } from 'react';
import { API_ENV } from '../libs/axios';
import { useConnectionSocket } from '../store/checkout/connectionSocket';
import { useCheckoutPaginationStore } from '../store/checkout/checkoutPagination';

interface CheckoutRouteProps {
  redirectTo?: string;
  children?: React.ReactNode;
}

const useJoinRoom = (conn: HubConnection | null, setConn: Function, updateData: Function) => {
  useEffect(() => {
    const connect = async (userName: string, chatRoom: string) => {
      try {
        const conn = new HubConnectionBuilder()
          .withUrl(`${API_ENV}/Chat`, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
          })
          .configureLogging(LogLevel.Information)
          .build();
        conn.on('JoinSpecificChatRoom', () => {});

        conn.on('ReceiveSpecificSell', (sell: any) => {
          const sellObject = {
            estatus: sell.estadoVenta,
            folio: sell.folio,
            id_VentaPrincipal: sell.id,
            moduloProveniente: sell.moduloProveniente,
            paciente: sell.paciente,
            totalVenta: sell.totalVenta,
            tipoPago: sell.tipoPago,
          };
          updateData(sellObject);
        });

        await conn.start();
        await conn.invoke('JoinSpecificChatRoom', { userName, chatRoom });

        setConn(conn);
      } catch (error) {
        console.log(error);
      }
    };
    connect('Tadeo', 'Ventas');

    return () => {
      conn?.stop();
    };
  }, []);

  return conn;
};

export const CheckoutRoute = (props: CheckoutRouteProps) => {
  const { children } = props;
  const setConn = useConnectionSocket((state) => state.setConn);
  const conn = useConnectionSocket((state) => state.conn);
  const updateData = useCheckoutPaginationStore((state) => state.setData);
  useJoinRoom(conn, setConn, updateData);

  if (!conn) return <LoadingView />;

  return children ? <>{children}</> : <Outlet />;
};
