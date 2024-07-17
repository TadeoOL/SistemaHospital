import axios from '../../libs/axios';
const apiAnesthesiologistShift = '/api/GuardiaAnestesiologo';

export const getAnesthesiologistShifts = async (start: Date, end: Date) => {
  const res = await axios.get(`${apiAnesthesiologistShift}/obtener-guardias-anestesiologos`, {
    params: {
      fechaInicio: start,
      fechaFin: end,
    },
  });
  return res.data;
};

export const registerAnesthesiologistShift = async (data: {
  id_Anestesiologo: string;
  inicioGuardia: Date;
  finGuardia: Date;
}) => {
  const res = await axios.post(`${apiAnesthesiologistShift}/registrar-guardia-anestesiologo`, data);
  return res.data;
};

export const getRegisteredAnesthesiologistShifts = async (date: Date) => {
  const res = await axios.get(`${apiAnesthesiologistShift}/obtener-registros-guardias-anestesiologos`, {
    params: {
      fecha: date,
    },
  });
  return res.data;
};

export const getAnesthesiologistShiftsByDate = async (date: Date) => {
  const res = await axios.get(`${apiAnesthesiologistShift}/obtener-guardias-anestesiologos`, {
    params: {
      fechaInicio: date,
    },
  });
  return res.data;
};

export const modifyAnesthesiologistShifts = async (data: {
  id: string;
  id_Anestesiologo: string;
  fechaInicio: Date;
  fechaFin: Date;
}) => {
  const res = await axios.put(`${apiAnesthesiologistShift}/modificar-guardia-anestesiologo`, data);
  return res.data;
};
