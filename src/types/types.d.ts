export interface IChildrenItems {
  title: string;
  path: string;
  icon: React.ReactElement;
}

export interface IModuleItems {
  title: string;
  path: string;
  childrenItems: IChildrenItems[] | [];
  icon: React.ReactElement;
}

export interface IUser {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  imagenURL: string;
  nombreUsuario: string;
  roles: IRol[];
}

export interface IRol {
  id: string;
  name: string;
}
