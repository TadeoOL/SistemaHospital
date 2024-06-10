import { Outlet } from 'react-router-dom';
import LoadingView from '../views/LoadingView/LoadingView';
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import { API_ENV } from '../libs/axios';
import { useConnectionSocket } from '../store/checkout/connectionSocket';
import { useCheckoutPaginationStore } from '../store/checkout/checkoutPagination';
import { useAuthStore } from '../store/auth';
import { ICheckoutSell } from '../types/types';
import { useCheckoutUserEmitterPaginationStore } from '../store/checkout/checkoutUserEmitterPagination';

interface CheckoutRouteProps {
  redirectTo?: string;
  children?: React.ReactNode;
}

const useJoinRoom = (
  conn: HubConnection | null,
  setConn: Function,
  updateData: Function,
  updateDataEmitter: Function
) => {
  const profile = useAuthStore((state) => state.profile);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    const connect = async (userId: string, chatRoom: string) => {
      try {
        const conn = new HubConnectionBuilder()
          .withUrl(`${API_ENV}/Chat`, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
          })
          .configureLogging(LogLevel.Information)
          .withAutomaticReconnect()
          .build();

        conn.on('JoinSpecificChatRoom', () => {});

        conn.on('ReceiveSpecificSell', (sell: ICheckoutSell) => {
          const sellObject = {
            estatus: sell.estatus,
            folio: sell.folio,
            id_VentaPrincipal: sell.id_VentaPrincipal,
            moduloProveniente: sell.moduloProveniente,
            paciente: sell.paciente,
            totalVenta: sell.totalVenta,
            tipoPago: sell.tipoPago,
            id_UsuarioPase: sell.id_UsuarioPase,
            nombreUsuario: sell.nombreUsuario,
          };
          updateData(sellObject);
        });

        conn.on('ReceiveSellUpdated', (sell: ICheckoutSell) => {
          const sellObject = {
            estatus: sell.estatus,
            folio: sell.folio,
            id_VentaPrincipal: sell.id_VentaPrincipal,
            moduloProveniente: sell.moduloProveniente,
            paciente: sell.paciente,
            totalVenta: sell.totalVenta,
            tipoPago: sell.tipoPago,
            id_UsuarioPase: sell.id_UsuarioPase,
          };
          updateDataEmitter(sellObject);
        });

        conn.onclose(async () => {
          if (reconnectAttempts < 5) {
            console.log('Connection lost, attempting to reconnect...');
            setReconnectAttempts((prev) => prev + 1);
            await new Promise((res) => setTimeout(res, 2000));
            connect(userId, chatRoom);
          } else {
            console.log('Could not reconnect after several attempts.');
          }
        });

        await conn.start();
        await conn.invoke('JoinSpecificChatRoom', { userId, chatRoom });
        setConn(conn);
        setReconnectAttempts(0);
      } catch (error) {
        console.log(error);
      }
    };

    connect(profile?.id as string, 'Ventas');

    return () => {
      conn?.invoke('Disconnect', profile?.id);
      conn?.stop();
    };
  }, [profile?.id, setConn, updateData, updateDataEmitter]);

  return conn;
};

export const CheckoutRoute = (props: CheckoutRouteProps) => {
  const { children } = props;
  const setConn = useConnectionSocket((state) => state.setConn);
  const conn = useConnectionSocket((state) => state.conn);
  const updateData = useCheckoutPaginationStore((state) => state.setData);
  const updateDataEmitter = useCheckoutUserEmitterPaginationStore((state) => state.setUpdateData);
  useJoinRoom(conn, setConn, updateData, updateDataEmitter);

  if (!conn) return <LoadingView />;

  return children ? <>{children}</> : <Outlet />;
};
