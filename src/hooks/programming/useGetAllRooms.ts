import { useQuery } from '@tanstack/react-query';
import { getAllHospitalRooms } from '../../services/programming/roomsService';
import { getAllOperatingRooms } from '../../services/operatingRoom/dailyOperatingRoomService';
import { IHospitalRoom } from '../../types/programming/hospitalRoomTypes';
import { ISurgeryRoom } from '../../types/programming/surgeryRoomTypes';
import { HospitalSpaceType } from '@/types/admission/admissionTypes';

type RoomType = HospitalSpaceType | string;

type RoomTypeReturn<T extends RoomType> = T extends HospitalSpaceType.Room ? IHospitalRoom[] : ISurgeryRoom[];

export const useGetAllRooms = <T extends RoomType>(tipoCuarto?: T) => {
  return useQuery({
    queryKey: ['allRooms', tipoCuarto],
    queryFn: async () => {
      if (tipoCuarto === HospitalSpaceType.Room) {
        const response = await getAllHospitalRooms();
        return response as unknown as RoomTypeReturn<T>;
      } else {
        const response = await getAllOperatingRooms();
        return response as unknown as RoomTypeReturn<T>;
      }
    },
  });
};
