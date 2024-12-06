export interface InvoicePatientBillPagination {
  id_CuentaPaciente: string;
  //id_Paciente: string;
  clavePaciente: string;
  paciente: string;
  medico: string;
  cirugias: string[];
  facturada: boolean;
}
