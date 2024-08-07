import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import Docxtemplater from 'docxtemplater';
import expressionParser from 'docxtemplater/expressions';
import { saveAs } from 'file-saver';
import { getDocumentData } from '../../../services/programming/admissionRegisterService';
import { IDocumentsInfo } from '../../../types/admissionTypes';
import { toast } from 'react-toastify';
import { calculateAge } from '../../../utils/admission/admissionUtils';
import dayjs from 'dayjs';

const loadFile = (url: string, callback: (err: any, content: any) => void) => {
  PizZipUtils.getBinaryContent(url, callback);
};

export const generateHospitalizationDoc = async (registerId: string) => {
  loadFile('/FORMATO_HOSPITALIZACION.docx', async (err: any, content: any) => {
    if (err) {
      console.error(err);
      return;
    }
    try {
      const data: IDocumentsInfo = await getDocumentData(registerId);
      const {
        clavePaciente,
        diagnosticoIngreso,
        especialidad,
        fechaIngreso,
        horaIngreso,
        motivoIngreso,
        nombreMedico,
        paciente,
        procedimientos,
        alergias,
        nombreCuarto,
        nombreQuirofano,
        nombreAnestesiologo,
        tipoSangre,
      } = data;

      const zip = new PizZip(content);
      expressionParser.filters.upper = function (input) {
        if (!input) {
          return input;
        }
        return input.toUpperCase();
      };
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: expressionParser,
      });

      doc.render({
        genero: paciente.genero ?? '',
        nombre: paciente.nombre + ' ' + paciente.apellidoPaterno + ' ' + paciente.apellidoMaterno,
        nombreMedico: nombreMedico ?? '',
        especialidad: especialidad ?? '',
        diagnosticoIngreso: diagnosticoIngreso ?? '',
        motivoIngreso: motivoIngreso ?? '',
        estadoCivil: paciente.estadoCivil ?? '',
        nombreResponsable: paciente.nombreResponsable ?? '',
        direccion: paciente.direccion ?? '',
        colonia: paciente.colonia ?? '',
        codigoPostal: paciente.codigoPostal ?? '',
        procedimiento: procedimientos ?? '',
        domicilioResponsable: paciente.domicilioResponsable ?? '',
        coloniaResponsable: paciente.coloniaResponsable ?? '',
        codigoPostalResponsable: paciente.codigoPostalResponsable ?? '',
        parentesco: paciente.parentesco ?? '',
        telefono: paciente.telefono ?? '',
        telefonoResponsable: paciente.telefonoResponsable ?? '',
        fechaNacimiento: paciente.fechaNacimiento ? dayjs(paciente.fechaNacimiento).format('DD/MM/YYYY') : '',
        fechaIngreso: fechaIngreso ?? '',
        horaIngreso: horaIngreso ?? '',
        clavePaciente: clavePaciente ?? '',
        edad: calculateAge(paciente.fechaNacimiento),
        alergias: alergias ?? '',
        cuarto: nombreCuarto ?? '',
        quirofano: nombreQuirofano ?? '',
        nombreAnestesiologo: nombreAnestesiologo ?? '',
        sangre: tipoSangre ?? '',
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

export const generateAdmissionDoc = async (registerId: string) => {
  loadFile('/FORMATO_ADMISION.docx', async (err: any, content: any) => {
    if (err) {
      console.error(err);
      return;
    }
    try {
      const data: IDocumentsInfo = await getDocumentData(registerId);
      const {
        clavePaciente,
        diagnosticoIngreso,
        especialidad,
        fechaIngreso,
        horaIngreso,
        motivoIngreso,
        nombreMedico,
        paciente,
        procedimientos,
        alergias,
        nombreAnestesiologo,
        nombreCuarto,
        nombreQuirofano,
        tipoSangre,
      } = data;

      const zip = new PizZip(content);
      expressionParser.filters.upper = function (input) {
        if (!input) {
          return input;
        }
        return input.toUpperCase();
      };
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: expressionParser,
      });

      doc.render({
        genero: paciente.genero ?? '',
        nombre: paciente.nombre + ' ' + paciente.apellidoPaterno + ' ' + paciente.apellidoMaterno,
        nombreMedico: nombreMedico ?? '',
        especialidad: especialidad ?? '',
        diagnosticoIngreso: diagnosticoIngreso ?? '',
        motivoIngreso: motivoIngreso ?? '',
        estadoCivil: paciente.estadoCivil ?? '',
        nombreResponsable: paciente.nombreResponsable ?? '',
        direccion: paciente.direccion ?? '',
        colonia: paciente.colonia ?? '',
        codigoPostal: paciente.codigoPostal ?? '',
        procedimiento: procedimientos ?? '',
        domicilioResponsable: paciente.domicilioResponsable ?? '',
        coloniaResponsable: paciente.coloniaResponsable ?? '',
        codigoPostalResponsable: paciente.codigoPostalResponsable ?? '',
        parentesco: paciente.parentesco ?? '',
        telefono: paciente.telefono ?? '',
        telefonoResponsable: paciente.telefonoResponsable ?? '',
        fechaNacimiento: paciente.fechaNacimiento ? dayjs(paciente.fechaNacimiento).format('DD/MM/YYYY') : '',
        fechaIngreso: fechaIngreso ?? '',
        horaIngreso: horaIngreso ?? '',
        clavePaciente: clavePaciente ?? '',
        edad: calculateAge(paciente.fechaNacimiento),
        alergias: alergias ?? '',
        cuarto: nombreCuarto ?? '',
        quirofano: nombreQuirofano ?? '',
        nombreAnestesiologo: nombreAnestesiologo ?? '',
        sangre: tipoSangre ?? '',
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

export const generateSurgeryDoc = async (registerId: string) => {
  loadFile('/FORMATO_QUIRURGICO.docx', async (err: any, content: any) => {
    if (err) {
      console.error(err);
      return;
    }
    try {
      const data: IDocumentsInfo = await getDocumentData(registerId);
      const {
        clavePaciente,
        diagnosticoIngreso,
        especialidad,
        fechaIngreso,
        horaIngreso,
        motivoIngreso,
        nombreMedico,
        paciente,
        procedimientos,
        alergias,
        nombreAnestesiologo,
        nombreCuarto,
        nombreQuirofano,
        tipoSangre,
      } = data;

      const zip = new PizZip(content);
      expressionParser.filters.upper = function (input) {
        if (!input) {
          return input;
        }
        return input.toUpperCase();
      };
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: expressionParser,
      });

      doc.render({
        genero: paciente.genero ?? '',
        nombre: paciente.nombre + ' ' + paciente.apellidoPaterno + ' ' + paciente.apellidoMaterno,
        nombreMedico: nombreMedico ?? '',
        especialidad: especialidad ?? '',
        diagnosticoIngreso: diagnosticoIngreso ?? '',
        motivoIngreso: motivoIngreso ?? '',
        estadoCivil: paciente.estadoCivil ?? '',
        nombreResponsable: paciente.nombreResponsable ?? '',
        direccion: paciente.direccion ?? '',
        colonia: paciente.colonia ?? '',
        codigoPostal: paciente.codigoPostal ?? '',
        procedimiento: procedimientos ?? '',
        domicilioResponsable: paciente.domicilioResponsable ?? '',
        coloniaResponsable: paciente.coloniaResponsable ?? '',
        codigoPostalResponsable: paciente.codigoPostalResponsable ?? '',
        parentesco: paciente.parentesco ?? '',
        telefono: paciente.telefono ?? '',
        telefonoResponsable: paciente.telefonoResponsable ?? '',
        fechaNacimiento: paciente.fechaNacimiento ? dayjs(paciente.fechaNacimiento).format('DD/MM/YYYY') : '',
        fechaIngreso: fechaIngreso ?? '',
        horaIngreso: horaIngreso ?? '',
        clavePaciente: clavePaciente ?? '',
        edad: calculateAge(paciente.fechaNacimiento),
        alergias: alergias ?? '',
        cuarto: nombreCuarto ?? '',
        quirofano: nombreQuirofano ?? '',
        nombreAnestesiologo: nombreAnestesiologo ?? '',
        sangre: tipoSangre ?? '',
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
    } = data;

    const zip = new PizZip(content);
    expressionParser.filters.upper = function (input) {
      if (!input) {
        return input;
      }
      return input.toUpperCase();
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
      fechaNacimiento: birthDate ? dayjs(birthDate).format('DD/MM/YYYY') : '',
      fechaIngreso: dayjs().format('DD/MM/YYYY'),
      horaIngreso: dayjs().format('HH:mm:ss'),
      edad: calculateAge(birthDate),
      sangre: bloodType ?? '',
    });

    const out = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    saveAs(out, 'Sami_Paciente.docx');
  });
};
