import axios from '../../libs/axios';
import { Paciente } from '../../types/admissionTypes';
import { IPatient } from '../../types/types';
const apiPatient = '/api/Paciente';

export const createPatient = async (data: IPatient) => {
  const res = await axios.post(`${apiPatient}/registrar-paciente`, {
    nombre: data.name,
    apellidoPaterno: data.lastName,
    apellidoMaterno: data.secondLastName,
    edad: data.age,
    genero: data.genere,
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
    edad: data.age,
    genero: data.genere,
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
  });
  return res.data;
};
