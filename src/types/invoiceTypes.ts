export interface InvoicePatientBillPagination {
  id_CuentaPaciente: string;
  id_Paciente: string;
  clavePaciente: string;
  nombrePaciente: string;
  nombreMedico: string;
  procedimientos: string[];
  yaFacturo: boolean;
}
