import axios from '../../libs/axios';
import { ISurgicalPackage } from '../../types/operatingRoom/surgicalPackageTypes';
const apiUrl = '/api/Quirofano/Catalogo/PaqueteQuirurgico';

export const getAllSurgicalPackages = async (): Promise<ISurgicalPackage[]> => {
  const res = await axios.get(apiUrl);
  return res.data;
};

export const getSurgicalPackageById = async (id: string): Promise<ISurgicalPackage> => {
  const res = await axios.get(`${apiUrl}/${id}`);
  return res.data;
};

export const getSurgicalPackagesPagination = async (paramUrl: string) => {
  const res = await axios.get(`${apiUrl}/paginacion-paquete-quirurgico?&${paramUrl}`);
  return res.data;
};
