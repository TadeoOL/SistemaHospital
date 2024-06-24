import axios from '../../libs/axios';
const apiXRay = '/api/Radiografia';

export const createXRay = async (data: { nombre: string; descripcion: string; precio: number }) => {
  const res = await axios.post(`${apiXRay}/crear-radiografia`, data);
  return res.data;
};

export const modifyXRay = async (data: { id: string; nombre: string; descripcion: string; precio: number }) => {
  const res = await axios.post(`${apiXRay}/modificar-radiografia`, data);
  return res.data;
};

export const disableXRay = async (data: any) => {
  const res = await axios.post(`${apiXRay}/deshabilitar-radiografia`, data);
  return res.data;
};

export const getXRayPagination = async (params: string) => {
  const res = await axios.get(`${apiXRay}/paginacion-radiografia?${params}`);
  return res.data;
};

export const getAllXRay = async () => {
  const res = await axios.get(`${apiXRay}/obtener-radiografias`);
  return res.data;
};
