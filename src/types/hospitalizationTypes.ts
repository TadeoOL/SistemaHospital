export interface IBiomedicalEquipment {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
}

export interface IAnesthesiologist {
  id: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  edad: number;
  fechaNacimiento: Date;
}

export interface IXRay {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
}

export interface IMedic {
  id: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  edad: number;
  fechaNacimiento: Date;
}
