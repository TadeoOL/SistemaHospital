import { useEffect } from 'react';
import { IPatientReentryInfo } from '@/types/admission/admissionTypes';
import { usePatientEntryRegisterStepsStore } from '@/store/admission/usePatientEntryRegisterSteps';
import { IPatient, IClinicalData } from '@/types/types';
import { IBiomedicalEquipment } from '@/types/hospitalizationTypes';

export const useSetPatientReentryInfo = (patientReentryInfo: IPatientReentryInfo | undefined) => {
  const setPatient = usePatientEntryRegisterStepsStore((state) => state.setPatient);
  const setClinicalData = usePatientEntryRegisterStepsStore((state) => state.setClinicalData);
  const setMedicId = usePatientEntryRegisterStepsStore((state) => state.setMedicId);
  const setProcedures = usePatientEntryRegisterStepsStore((state) => state.setProcedures);
  const setMedicPersonalBiomedicalEquipment = usePatientEntryRegisterStepsStore(
    (state) => state.setMedicPersonalBiomedicalEquipment
  );

  useEffect(() => {
    if (!patientReentryInfo) return;

    const patientData: IPatient = {
      name: patientReentryInfo.paciente?.nombre || '',
      lastName: patientReentryInfo.paciente?.apellidoPaterno || '',
      secondLastName: patientReentryInfo.paciente?.apellidoMaterno || '',
      genere: patientReentryInfo.paciente?.genero || '',
      civilStatus: patientReentryInfo.paciente?.estadoCivil || '',
      birthDate: patientReentryInfo.paciente?.fechaNacimiento || new Date(),
      phoneNumber: patientReentryInfo.paciente?.telefono || '',
      occupation: patientReentryInfo.paciente?.ocupacion || '',
      zipCode: patientReentryInfo.paciente?.codigoPostal || '0',
      neighborhood: patientReentryInfo.paciente?.colonia || '',
      address: patientReentryInfo.paciente?.direccion || '',
      curp: patientReentryInfo.paciente?.curp || '',

      personInCharge: patientReentryInfo.ingresoPaciente?.nombreResponsable || '',
      relationship: patientReentryInfo.ingresoPaciente?.parentesco || '',
      personInChargeZipCode: patientReentryInfo.ingresoPaciente?.codigoPostalResponsable || '0',
      personInChargeNeighborhood: patientReentryInfo.ingresoPaciente?.coloniaResponsable || '',
      personInChargeAddress: patientReentryInfo.ingresoPaciente?.domicilioResponsable || '',
      personInChargePhoneNumber: patientReentryInfo.ingresoPaciente?.telefonoResponsable || '',
    };

    const clinicalData: IClinicalData = {
      admissionDiagnosis: patientReentryInfo.ingresoPaciente?.diagnosticoIngreso || '',
      comments: patientReentryInfo.ingresoPaciente?.comentarios || '',
      reasonForAdmission: patientReentryInfo.ingresoPaciente?.motivoIngreso || '',
      allergies: patientReentryInfo.paciente?.alergias || '',
      bloodType: patientReentryInfo.paciente?.tipoSangre || '',
    };

    setPatient(patientData);
    setClinicalData(clinicalData);

    if (patientReentryInfo.id_Medico) {
      setMedicId(patientReentryInfo.id_Medico);
    }

    if (patientReentryInfo.cirugias) {
      setProcedures(patientReentryInfo.cirugias);
    }

    if (patientReentryInfo.equipoHonorario) {
      const biomedicalEquipment: IBiomedicalEquipment[] = patientReentryInfo.equipoHonorario.map((equipo) => ({
        nombre: equipo.nombre,
        precio: equipo.precio,
        id: '',
        cantidad: 1,
      }));
      setMedicPersonalBiomedicalEquipment(biomedicalEquipment);
    }
  }, [patientReentryInfo]);
};
