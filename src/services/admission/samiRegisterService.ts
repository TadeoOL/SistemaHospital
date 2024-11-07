import axios from '../../libs/axios';
const apiSamiRegister = '/api/Admision/ConsultaMedica';

export const registerSamiPatient = async (data: {
  paciente:{nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Date;
  genero: string;
  telefono: string;
  direccion: string;
  colonia: string;
  codigoPostal: string;
  estadoCivil: string;
  nombreResponsable: string;},
  id_Medico:string
}) => {
  const res = await axios.post(`${apiSamiRegister}/registrar-paciente-consulta-medica`, data);
  return res.data;
};

export const getSamiRegistersPagination = async (params: string) => {
  const res = await axios.get(`${apiSamiRegister}/paginacion-pacientes-consulta-medica?${params}`);
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
