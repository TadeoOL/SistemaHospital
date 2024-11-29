import axios from '../../libs/axios';
import { ArticlesFromRoom } from '../../types/hospitalization/articleRequestTypes';
import { IHospitalRoomInformation } from '../../types/hospitalization/hospitalRoomTypes';
import { IHospitalRoomReservation, ISurgeryRoomReservation } from '../../types/programming/hospitalSpacesTypes';

const apiHospitalSpace = '/api/Programacion/EspacioHospitalario';

export const getSurgeryRoomsReservations = async ({
  endDate,
  initialDate,
  surgeryRoomId,
  hospitalizationSpaceId,
}: {
  endDate?: string;
  initialDate?: string;
  surgeryRoomId?: string;
  hospitalizationSpaceId?: string;
}): Promise<ISurgeryRoomReservation[]> => {
  const res = await axios.get(`${apiHospitalSpace}/obtener-reservacion-quirofanos`, {
    params: {
      fechaInicial: initialDate,
      fechaFinal: endDate,
      id_Quirofano: surgeryRoomId,
      id_CuentaEspacioHospitalario: hospitalizationSpaceId,
    },
  });
  return res.data;
};

export const getHospitalRoomReservations = async ({
  endDate,
  initialDate,
  roomId,
  hospitalizationSpaceId,
}: {
  endDate?: string;
  initialDate?: string;
  roomId?: string;
  hospitalizationSpaceId?: string;
}): Promise<IHospitalRoomReservation[]> => {
  const res = await axios.get(`${apiHospitalSpace}/obtener-reservacion-cuartos`, {
    params: {
      fechaInicial: initialDate,
      fechaFinal: endDate,
      id_Cuarto: roomId,
      id_CuentaEspacioHospitalario: hospitalizationSpaceId,
    },
  });
  return res.data;
};

export const deleteHospitalRoomReservation = async (hospitalizationSpaceId: string) => {
  const res = await axios.delete(
    `${apiHospitalSpace}/eliminar-espacio-hospitalario-reservado/${hospitalizationSpaceId}`
  );
  return res.data;
};

export const getHospitalRoomInformation = async (id: string): Promise<IHospitalRoomInformation> => {
  const res = await axios.get(`${apiHospitalSpace}/obtener-espacio-hospitalario/${id}`);
  return res.data;
};

export const getHospitalRoomArticles = async (id: string): Promise<ArticlesFromRoom[]> => {
  const res = await axios.get(`${apiHospitalSpace}/obtener-articulos-espacio-hospitalario/${id}`);
  return res.data;
};
