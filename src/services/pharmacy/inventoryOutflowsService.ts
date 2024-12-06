import axios from '../../libs/axios';
const API = '/api/SalidasExistencias';

interface IChargeArticlesToPatientDirectlyData {
  Id_CuentaEspacioHospitalario: string;
  Id_Almacen: string;
  Id_Enfermero: string;
  Articulos: {
    Id_Articulo: string;
    Cantidad: number;
  }[]
}

export const getWaitingPackagesByWarehouse = async (paramUrl: string) => {
  const res = await axios.get(`${API}/paginacion-paquetes-espera?${paramUrl}`);
  return res.data;
};

export const getNurseRequestPending = async (paramUrl: string) => {
  const res = await axios.get(`${API}/paginacion-solicitud-enfermero?${paramUrl}`);
  return res.data;
};

export const chargeArticlesToPatientDirectly = async (data: IChargeArticlesToPatientDirectlyData) => {
  const res = await axios.post(`${API}/registrar-solicitud-directa-paciente`,data);
  return res.data;
};