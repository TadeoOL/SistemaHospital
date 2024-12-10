export interface IHospitalService {
  id_Servicio: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tipoServicio: number;
  requiereAutorizacion: boolean;
}

export enum ServiceType {
  Laboratorio = 1,
  Radiografia = 2,
  Ultrasonido = 3,
  Electrocardiograma = 5,
  Cuidado_Neonatal = 6,
  Consulta_Medica = 7,
  Otros = 8,
}

export const ServiceTypeLabels: Record<ServiceType, string> = {
  [ServiceType.Laboratorio]: 'Laboratorio',
  [ServiceType.Radiografia]: 'Radiografía',
  [ServiceType.Ultrasonido]: 'Ultrasonido',
  [ServiceType.Electrocardiograma]: 'Electrocardiograma',
  [ServiceType.Cuidado_Neonatal]: 'Cuidado Neonatal',
  [ServiceType.Consulta_Medica]: 'Consulta Medica',
  [ServiceType.Otros]: 'Otros',
};
