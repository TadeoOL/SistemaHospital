import axios from '../../libs/axios';
const apiMedicalShift = '/api/GuardiaMedico';

export const getMedicalShifts = async (start: Date, end: Date) => {
  const res = await axios.get(`${apiMedicalShift}/obtener-guardias-medicas`, {
    params: {
      fechaInicio: start,
      fechaFin: end,
    },
  });
  return res.data;
};

export const registerMedicalShift = async (data: { id_Medico: string; inicioGuardia: Date; finGuardia: Date }) => {
  const res = await axios.post(`${apiMedicalShift}/registrar-guardia-medico`, data);
  return res.data;
};

export const getRegisteredMedicalShifts = async (date: Date) => {
  const res = await axios.get(`${apiMedicalShift}/obtener-registros-guardias-medicos`, {
    params: {
      fecha: date,
    },
  });
  return res.data;
};

export const getMedicalShiftsByDate = async (date: Date) => {
  const res = await axios.get(`${apiMedicalShift}/obtener-guardias-medicos`, {
    params: {
      fechaInicio: date,
    },
  });
  return res.data;
};

export const modifyMedicalShifts = async (data: {
  id: string;
  id_Medico: string;
  fechaInicio: Date;
  fechaFin: Date;
}) => {
  const res = await axios.put(`${apiMedicalShift}/modificar-guardia-medico`, data);
  return res.data;
};
