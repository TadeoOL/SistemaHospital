import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import Docxtemplater from 'docxtemplater';
import expressionParser from 'docxtemplater/expressions';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import { calculateAge } from '../../../utils/admission/admissionUtils';
import dayjs from 'dayjs';
import { getAdmissionDoc } from '@/services/admission/admisionService';

const loadFile = (url: string, callback: (err: any, content: any) => void) => {
  PizZipUtils.getBinaryContent(url, callback);
};

const handleUpperCase = (input: string | string[] | null | undefined): string => {
  if (!input) return '';
  if (Array.isArray(input)) return input.join(', ').toUpperCase();
  return input.toUpperCase();
};

export const generateHospitalizationDoc = async (id_IngresoPaciente: string) => {
  loadFile('/FORMATO_HOSPITALIZACION.docx', async (err: any, content: any) => {
    if (err) {
      console.error(err);
      return;
    }
    try {
      const patientInfo = await getAdmissionDoc(id_IngresoPaciente);

      const zip = new PizZip(content);
      expressionParser.filters.upper = function (input) {
        return handleUpperCase(input);
      };

      const renderData = {
        ...patientInfo,
        procedimientos: Array.isArray(patientInfo.procedimientos)
          ? patientInfo.procedimientos.join(', ')
          : (patientInfo.procedimientos ?? ''),
        cuarto: Array.isArray(patientInfo.cuarto) ? patientInfo.cuarto.join(', ') : (patientInfo.cuarto ?? ''),
        quirofano: Array.isArray(patientInfo.quirofano)
          ? patientInfo.quirofano.join(', ')
          : (patientInfo.quirofano ?? ''),
      };

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: expressionParser,
      });

      doc.render({
        genero: renderData.genero ?? '',
        nombre: renderData.nombrePaciente ?? '',
        nombreMedico: renderData.nombreMedico ?? '',
        especialidad: renderData.especialidadMedico ?? '',
        diagnosticoIngreso: renderData.diagnosticoIngreso ?? '',
        motivoIngreso: renderData.motivoIngreso ?? '',
        estadoCivil: renderData.estadoCivil ?? '',
        nombreResponsable: renderData.nombreResponsable ?? '',
        direccion: renderData.direccion ?? '',
        colonia: renderData.colonia ?? '',
        codigoPostal: renderData.codigoPostal ?? '',
        procedimiento: renderData.procedimientos ?? '',
        domicilioResponsable: renderData.domicilioResponsable ?? '',
        coloniaResponsable: renderData.coloniaResponsable ?? '',
        codigoPostalResponsable: renderData.codigoPostalResponsable ?? '',
        parentesco: renderData.parentesco ?? '',
        telefono: renderData.telefono ?? '',
        telefonoResponsable: renderData.telefonoResponsable ?? '',
        fechaNacimiento: renderData.fechaNacimiento ?? '',
        fechaIngreso: renderData.fechaIngreso ?? '',
        horaIngreso: renderData.horaIngreso ?? '',
        clavePaciente: renderData.clavePaciente ?? '',
        edad: renderData.edad ?? '',
        alergias: renderData.alergias ?? '',
        cuarto: renderData.cuarto ?? '',
        quirofano: renderData.quirofano ?? '',
        nombreAnestesiologo: renderData.nombreAnestesiologo ?? '',
        sangre: renderData.sangre ?? '',
        ciudad: renderData.ciudad ?? '',
        estado: renderData.estado ?? '',
      });

      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      saveAs(out, 'Hospitalización_Paciente_Test.docx');
    } catch (error) {
      console.log(error);
      toast.error('Error al obtener los datos del registro!');
    }
  });
};

export const generateAdmissionDoc = async (id_IngresoPaciente: string) => {
  loadFile('/FORMATO_ADMISION.docx', async (err: any, content: any) => {
    if (err) {
      console.error(err);
      return;
    }
    try {
      const patientInfo = await getAdmissionDoc(id_IngresoPaciente);

      const zip = new PizZip(content);
      expressionParser.filters.upper = function (input) {
        return handleUpperCase(input);
      };

      const renderData = {
        ...patientInfo,
        procedimientos: Array.isArray(patientInfo.procedimientos)
          ? patientInfo.procedimientos.join(', ')
          : (patientInfo.procedimientos ?? ''),
        cuarto: Array.isArray(patientInfo.cuarto) ? patientInfo.cuarto.join(', ') : (patientInfo.cuarto ?? ''),
        quirofano: Array.isArray(patientInfo.quirofano)
          ? patientInfo.quirofano.join(', ')
          : (patientInfo.quirofano ?? ''),
      };

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: expressionParser,
      });

      doc.render({
        genero: renderData.genero ?? '',
        nombre: renderData.nombrePaciente ?? '',
        nombreMedico: renderData.nombreMedico ?? '',
        especialidad: renderData.especialidadMedico ?? '',
        diagnosticoIngreso: renderData.diagnosticoIngreso ?? '',
        motivoIngreso: renderData.motivoIngreso ?? '',
        estadoCivil: renderData.estadoCivil ?? '',
        nombreResponsable: renderData.nombreResponsable ?? '',
        direccion: renderData.direccion ?? '',
        colonia: renderData.colonia ?? '',
        codigoPostal: renderData.codigoPostal ?? '',
        procedimiento: renderData.procedimientos ?? '',
        domicilioResponsable: renderData.domicilioResponsable ?? '',
        coloniaResponsable: renderData.coloniaResponsable ?? '',
        codigoPostalResponsable: renderData.codigoPostalResponsable ?? '',
        parentesco: renderData.parentesco ?? '',
        telefono: renderData.telefono ?? '',
        telefonoResponsable: renderData.telefonoResponsable ?? '',
        fechaNacimiento: renderData.fechaNacimiento ?? '',
        fechaIngreso: renderData.fechaIngreso ?? '',
        horaIngreso: renderData.horaIngreso ?? '',
        clavePaciente: renderData.clavePaciente ?? '',
        edad: renderData.edad ?? '',
        alergias: renderData.alergias ?? '',
        cuarto: renderData.cuarto ?? '',
        quirofano: renderData.quirofano ?? '',
        nombreAnestesiologo: renderData.nombreAnestesiologo ?? '',
        sangre: renderData.sangre ?? '',
        ciudad: renderData.ciudad ?? '',
        estado: renderData.estado ?? '',
      });

      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      saveAs(out, 'Endopro_Paciente_Test.docx');
    } catch (error) {
      console.log(error);
      toast.error('Error al obtener los datos del registro!');
    }
  });
};

export const generateSurgeryDoc = async (id_IngresoPaciente: string) => {
  loadFile('/FORMATO_QUIRURGICO.docx', async (err: any, content: any) => {
    if (err) {
      console.error(err);
      return;
    }
    try {
      const patientInfo = await getAdmissionDoc(id_IngresoPaciente);

      const zip = new PizZip(content);
      expressionParser.filters.upper = function (input) {
        return handleUpperCase(input);
      };

      const renderData = {
        ...patientInfo,
        procedimientos: Array.isArray(patientInfo.procedimientos)
          ? patientInfo.procedimientos.join(', ')
          : (patientInfo.procedimientos ?? ''),
        cuarto: Array.isArray(patientInfo.cuarto) ? patientInfo.cuarto.join(', ') : (patientInfo.cuarto ?? ''),
        quirofano: Array.isArray(patientInfo.quirofano)
          ? patientInfo.quirofano.join(', ')
          : (patientInfo.quirofano ?? ''),
      };
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: expressionParser,
      });

      doc.render({
        genero: renderData.genero ?? '',
        nombre: renderData.nombrePaciente ?? '',
        nombreMedico: renderData.nombreMedico ?? '',
        especialidad: renderData.especialidadMedico ?? '',
        diagnosticoIngreso: renderData.diagnosticoIngreso ?? '',
        motivoIngreso: renderData.motivoIngreso ?? '',
        estadoCivil: renderData.estadoCivil ?? '',
        nombreResponsable: renderData.nombreResponsable ?? '',
        direccion: renderData.direccion ?? '',
        colonia: renderData.colonia ?? '',
        codigoPostal: renderData.codigoPostal ?? '',
        procedimiento: renderData.procedimientos ?? '',
        domicilioResponsable: renderData.domicilioResponsable ?? '',
        coloniaResponsable: renderData.coloniaResponsable ?? '',
        codigoPostalResponsable: renderData.codigoPostalResponsable ?? '',
        parentesco: renderData.parentesco ?? '',
        telefono: renderData.telefono ?? '',
        telefonoResponsable: renderData.telefonoResponsable ?? '',
        fechaNacimiento: renderData.fechaNacimiento ?? '',
        fechaIngreso: renderData.fechaIngreso ?? '',
        horaIngreso: renderData.horaIngreso ?? '',
        clavePaciente: renderData.clavePaciente ?? '',
        edad: renderData.edad ?? '',
        alergias: renderData.alergias ?? '',
        cuarto: renderData.cuarto ?? '',
        quirofano: renderData.quirofano ?? '',
        nombreAnestesiologo: renderData.nombreAnestesiologo ?? '',
        sangre: renderData.sangre ?? '',
        ciudad: renderData.ciudad ?? '',
        estado: renderData.estado ?? '',
      });

      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      saveAs(out, 'Quirurgico_Paciente_Test.docx');
    } catch (error) {
      console.log(error);
      toast.error('Error al obtener los datos del registro!');
    }
  });
};

export const generateSamiDoc = async (data: {
  name?: string;
  lastName?: string;
  secondLastName?: string;
  birthDate?: Date;
  genere?: string;
  civilStatus?: string;
  phoneNumber?: string;
  zipCode?: string;
  neighborhood?: string;
  address?: string;
  personInCharge?: string;
  bloodType?: string;
  state?: string;
  city?: string;
}) => {
  loadFile('/FORMATO_SAMI.docx', async (err: any, content: any) => {
    if (err) {
      console.error(err);
      return;
    }

    const {
      address,
      birthDate,
      civilStatus,
      neighborhood,
      genere,
      lastName,
      personInCharge,
      phoneNumber,
      secondLastName,
      zipCode,
      name,
      bloodType,
      city,
      state,
    } = data;

    const zip = new PizZip(content);
    expressionParser.filters.upper = function (input) {
      return handleUpperCase(input);
    };
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      parser: expressionParser,
    });

    doc.render({
      genero: genere,
      nombrePaciente: name + ' ' + lastName + ' ' + secondLastName,
      edoCivil: civilStatus ?? '',
      nombreRepresentante: personInCharge ?? '',
      direccion: address ?? '',
      colonia: neighborhood ?? '',
      codigoPostal: zipCode ?? '',
      telefono: phoneNumber ?? '',
      fechaNacimiento: birthDate ?? '',
      fechaIngreso: dayjs().format('DD/MM/YYYY'),
      horaIngreso: dayjs().format('HH:mm:ss'),
      edad: calculateAge(birthDate),
      sangre: bloodType ?? '',
      ciudad: city,
      estado: state,
    });

    const out = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    saveAs(out, 'Sami_Paciente.docx');
  });
};
