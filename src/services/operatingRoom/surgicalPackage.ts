import { getDefaultPaginationParams, IPaginationResponse, IPaginationParams } from '@/types/paginationType';
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

export const getSurgicalPackagesPagination = async (
  params?: IPaginationParams
): Promise<IPaginationResponse<ISurgicalPackage>> => {
  const defaultParams = getDefaultPaginationParams(params);
  const res = await axios.get(`${apiUrl}/paginacion-paquete-quirurgico`, { params: defaultParams });
  return res.data;
};
