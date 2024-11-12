const apiUrl = '/api/Configuracion';
import axios from '../../libs/axios';
import { IConfigEmitterUsers } from '../../types/types';

export const getEmitterUsersConfig = async (): Promise<IConfigEmitterUsers[]> => {
  const res = await axios.get(`${apiUrl}/configuracion-usuarios-emisores`);
  return res.data
};
