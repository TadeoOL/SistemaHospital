import axios from '../../libs/axios';
import { Paciente, PacienteInfo } from '../../types/admissionTypes';
import { IPatient, IPatientFromSearch } from '../../types/types';
const apiPatient = '/api/Paciente';

export const createPatient = async (data: IPatient) => {
  const res = await axios.post(`${apiPatient}/registrar-paciente`, {
    nombre: data.name,
    apellidoPaterno: data.lastName,
    apellidoMaterno: data.secondLastName,
    genero: data.genere,
    fechaNacimiento: data.birthDate,
    estadoCivil: data.civilStatus,
    telefono: data.phoneNumber,
    ocupacion: data.occupation,
    codigoPostal: data.zipCode,
    colonia: data.neighborhood,
    direccion: data.address,
    NombreResponsable: data.personInCharge,
    parentesco: data.relationship,
    domicilioResponsable: data.personInChargeAddress,
    codigoPostalResponsable: data.personInChargeZipCode,
    coloniaResponsable: data.personInChargeNeighborhood,
    telefonoResponsable: data.personInChargePhoneNumber,
    ciudad: data.city,
    estado: data.state,
  });
  return res.data;
};

export const getPatientById = async (patientId: string) => {
  const res = await axios.get(`${apiPatient}/obtener-paciente`, {
    params: {
      id_Paciente: patientId,
    },
  });
  return res.data as Paciente;
};

export const modifyPatient = async (data: { id: string } & IPatient) => {
  const res = await axios.put(`${apiPatient}/modificar-paciente`, {
    id: data.id,
    nombre: data.name,
    apellidoPaterno: data.lastName,
    apellidoMaterno: data.secondLastName,
    genero: data.genere,
    estadoCivil: data.civilStatus,
    fechaNacimiento: data.birthDate,
    telefono: data.phoneNumber,
    ocupacion: data.occupation,
    codigoPostal: data.zipCode,
    colonia: data.neighborhood,
    direccion: data.address,
    NombreResponsable: data.personInCharge,
    parentesco: data.relationship,
    domicilioResponsable: data.personInChargeAddress,
    codigoPostalResponsable: data.personInChargeZipCode,
    coloniaResponsable: data.personInChargeNeighborhood,
    telefonoResponsable: data.personInChargePhoneNumber,
    estado: data.state,
    ciudad: data.city,
  });
  return res.data;
};

export const getPatientsWithAccount = async (url: string) => {
  const res = await axios.get(`${apiPatient}/obtener-paciente-activo?${url}`);
  return res.data as IPatientFromSearch[];
};

export const getPatientsWithAccountPagination = async (url: string) => {
  const res = await axios.get(`${apiPatient}/obtener-cuentas?${url}`);
  return res.data;
};

export const getPatientInfoById = async (patientId: string) => {
  const res = await axios.get(`${apiPatient}/obtener-paciente-info`, {
    params: {
      id_Paciente: patientId,
    },
  });
  return res.data as PacienteInfo;
};

export const getOutstandingBillsPagination = async (url: string) => {
  const res = await axios.get(`${apiPatient}/obtener-cuentas-cerradas-por-pagar?${url}`);
  return res.data;
};
