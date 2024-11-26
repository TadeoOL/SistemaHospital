import axios from '../../libs/axios';
import { IHospitalRoomReservation, ISurgeryRoomReservation } from '../../types/programming/hospitalSpacesTypes';

const apiHospitalSpace = '/api/Programacion/EspacioHospitalario';

export const getSurgeryRoomsReservations = async ({
  endDate,
  initialDate,
  surgeryRoomId,
}: {
  endDate?: string;
  initialDate?: string;
  surgeryRoomId?: string;
}): Promise<ISurgeryRoomReservation[]> => {
  const res = await axios.get(`${apiHospitalSpace}/obtener-reservacion-quirofanos`, {
    params: {
      fechaInicial: initialDate,
      fechaFinal: endDate,
      id_Quirofano: surgeryRoomId,
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
