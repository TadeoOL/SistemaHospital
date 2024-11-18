export interface IPatientVitalSigns {
  id: string;
  fechaSignosPaciente: string; 
  tensionArterial?: number;     
  frecuenciaRespiratoriaFrecuenciaCardiaca?: number;
  temperaturaCorporal?: number;
  saturacionOxigeno?: number;
  glicemia?: number;
  estadoConciencia?: string;
  escalaDolor?: number;
}
