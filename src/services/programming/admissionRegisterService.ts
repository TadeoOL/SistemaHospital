import axios from '../../libs/axios';
import { IEventDetails } from '../../types/admission/admissionTypes';
import { IRegisterPatientCommand } from '../../types/programming/registerTypes';
const apiRegister = '/api/Programacion/Registro';

export const registerPatient = async (data: IRegisterPatientCommand) => {
  const res = await axios.post(`${apiRegister}/registrar-paciente`, data);
  return res.data;
};

export const getEventDetails = async (eventId: string) => {
  const res = await axios.get(`${apiRegister}/informacion-registro-cuarto`, {
    params: {
      id_RegistroCuarto: eventId,
    },
  });
  return res.data as IEventDetails;
};

export const getPatientRegisterPagination = async (params: string) => {
  const res = await axios.get(`${apiRegister}/paginacion-registros?${params}`);
  return res.data;
};

export const getRegisterRoomsByRegisterId = async (registerId: string) => {
  const res = await axios.get(`${apiRegister}/registros-cuartos`, {
    params: {
      id_Registro: registerId,
    },
  });
  return res.data;
};

export const modifyEventRoom = async (data: {
  id_RegistroCuarto: string;
  id_Cuarto: string;
  horaInicio: Date;
  horaFin: Date;
}) => {
  const res = await axios.put(`${apiRegister}/modificar-registro-cuarto`, data);
  return res.data;
};

export const deleteRegister = async (registerId: string) => {
  const res = await axios.delete(`${apiRegister}/eliminar-registro`, {
    params: {
      Id_Registro: registerId,
    },
  });
  return res.data;
};

export const getAccountFullInformation = async (params: string) => {
  const res = await axios.get(`${apiRegister}/obtener-informacion-completa-registro?${params}`);
  return res.data;
};

export const getAccountAdmissionInformation = async (params: string) => {
  const res = await axios.get(`${apiRegister}/obtener-informacion-admision?${params}`);
  return res.data;
};

export const admitRegister = async (data: { Id_Registro: string }) => {
  const res = await axios.put(`${apiRegister}/admitir-registro`, data);
  return res.data;
};

export const getDocumentData = async (registerId: string) => {
  const res = await axios.get(`${apiRegister}/obtener-informacion-documentos`, {
    params: {
      id_Registro: registerId,
    },
  });
  return res.data;
};

export const getRegisterValidation = async (registerId: string) => {
  const res = await axios.get(`${apiRegister}/validar-registro`, {
    params: {
      id_Registro: registerId,
    },
  });
  return res.data as boolean;
};
