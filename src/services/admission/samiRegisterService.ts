import axios from '../../libs/axios';
const apiSamiRegister = '/api/RegistroSami';

export const registerSamiPatient = async (data: {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Date;
  genero: string;
  telefono: string;
  direccion: string;
  colonia: string;
  codigoPostal: string;
  estadoCivil: string;
  nombreResponsable: string;
}) => {
  const res = await axios.post(`${apiSamiRegister}/registrar-paciente-sami`, data);
  return res.data;
};

export const getSamiRegistersPagination = async (params: string) => {
  const res = await axios.get(`${apiSamiRegister}/paginacion-registros-sami?${params}`);
  return res.data;
};

export const modifySamiPatient = async (data: {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Date;
  genero: string;
  telefono: string;
  direccion: string;
  colonia: string;
  codigoPostal: string;
  estadoCivil: string;
  nombreResponsable: string;
  id_Paciente: string;
}) => {
  const res = await axios.post(`${apiSamiRegister}/modificar-paciente-sami`, data);
  return res.data;
};
