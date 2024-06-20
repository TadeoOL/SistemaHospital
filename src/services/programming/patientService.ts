import axios from '../../libs/axios';
import { Paciente } from '../../types/admissionTypes';
import { IPatient, IPatientFromSearch } from '../../types/types';
const apiPatient = '/api/Paciente';

export const createPatient = async (data: IPatient) => {
  const res = await axios.post(`${apiPatient}/registrar-paciente`, {
    nombre: data.name,
    apellidoPaterno: data.lastName,
    apellidoMaterno: data.secondLastName,
    edad: data.age,
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
  });
  return res.data;
};

export const getPatientsWithAccount = async (url: string) => {
  const res = await axios.get(`${apiPatient}/obtener-paciente-activo?${url}`);
  /*const res = [
    {
        "Id_paciente": "P001",
        "nombrePaciente": "Juan Perez",
        "Id_CuentaPaciente": "C001"
    },
    {
        "Id_paciente": "P002",
        "nombrePaciente": "Maria Gomez",
        "Id_CuentaPaciente": "C002"
    },
    {
        "Id_paciente": "P003",
        "nombrePaciente": "Carlos Lopez",
        "Id_CuentaPaciente": "C003"
    },
    {
        "Id_paciente": "P004",
        "nombrePaciente": "Ana Martinez",
        "Id_CuentaPaciente": "C004"
    },
    {
        "Id_paciente": "P005",
        "nombrePaciente": "Luis Rodriguez",
        "Id_CuentaPaciente": "C005"
    }
]+*/
  return res.data as IPatientFromSearch[] ;
}
