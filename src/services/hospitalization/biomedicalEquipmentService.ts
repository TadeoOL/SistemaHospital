import axios from '../../libs/axios';
const apiBiomedicalEquipment = '/api/EquipoBiomedico';

export const createBiomedicalEquipment = async (data: {
  nombre: string;
  descripcion?: string;
  precio: number;
  codigoContpaqi?: string;
  codigoSAT?: string;
  codigoUnidadMedida?: string;
}) => {
  const res = await axios.post(`${apiBiomedicalEquipment}/crear-equipo-biomedico`, data);
  return res.data;
};

export const modifyBiomedicalEquipment = async (data: {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  codigoContpaqi?: string;
  codigoSAT?: string;
  codigoUnidadMedida?: string;
}) => {
  const res = await axios.put(`${apiBiomedicalEquipment}/modificar-equipo-biomedico`, data);
  return res.data;
};

export const getBiomedicalEquipmentPagination = async (params: string) => {
  const res = await axios.get(`${apiBiomedicalEquipment}/paginacion-equipo-biomedico?${params}`);
  return res.data;
};

export const disableBiomedicalEquipment = async (id: string) => {
  const res = await axios.put(`${apiBiomedicalEquipment}/deshabilitar-equipo-biomedico/`, { id: id });
  return res.data;
};

export const getAllBiomedicalEquipment = async () => {
  const res = await axios.get(`${apiBiomedicalEquipment}/lista-equipo-biomedico`);
  return res.data;
};
