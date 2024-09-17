import axios from '../../libs/axios';
const apiRegister = '/api/ArticulosCuenta';

export const getArticlesFromAcountId = async (Id_CuentaPaciente: string, solo_nombre?: boolean, id_Almacen?: string,solo_Farmacia?: boolean,solo_Quirurgico?: boolean,) => {
  const url = `${apiRegister}/obtener-articulos-cuenta?Id_CuentaPaciente=${Id_CuentaPaciente}&Id_Almacen=${id_Almacen}&Solo_Farmacia=${solo_Farmacia? true : false}&Solo_Quirurgico=${solo_Quirurgico? true: false}`+`${solo_nombre? '&Solo_Nombre=true' : ''}` ;
  const res = await axios.get(url);
  console.log(res.data.length);
  return res.data;
};
