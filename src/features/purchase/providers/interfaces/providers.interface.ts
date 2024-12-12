export interface IProvider {
  id?: string;
  nombreCompania: string;
  nombreContacto: string;
  puesto: string;
  direccion: string;
  telefono: string;
  correoElectronico: string;
  rfc: string;
  giroEmpresa: string;
  direccionFiscal: string;
  tipoContribuyente: number;
  urlCertificadoBP: string | null ;
  urlCertificadoCR: string | null ;
  urlCertificadoISO9001: string | null ;
}
