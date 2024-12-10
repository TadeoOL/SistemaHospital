import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from '@mui/material';
import { TableHeaderComponent } from '../../Commons/TableHeaderComponent';
import { useSamiPAtientsPaginationStore } from '../../../store/admission/useSamiPatientsPagination';
import { useEffect, useState } from 'react';
import { TableFooterComponent } from '../../Pharmacy/ArticlesSoldHistoryTableComponent';
import { NoDataInTableInfo } from '../../Commons/NoDataInTableInfo';
import dayjs from 'dayjs';
import { FaEye } from 'react-icons/fa';
import { CheckCircle, Edit, Print } from '@mui/icons-material';
import { generateSamiDoc } from '../../Documents/AdmissionDocs/AdmissionDoc';
import { SamiPatientDetailsModal } from './Modal/SamiPatientDetailsModal';
import { AddPatientsEntrySami } from './Modal/AddPatientsEntrySami';
import Swal from 'sweetalert2';
import { ISAMInuevo } from '../../../types/admission/admissionTypes';
import { admitPatient } from '@/services/admission/admisionService';
import { EditPersonalInfoModal } from '@/components/Programming/Register/Modal/EditData/EditPersonalInfoModal';

const TABLE_HEADER = ['Nombre Paciente', 'Fecha Ingreso', 'Datos Paciente', 'Acciones'];

const useGetData = () => {
  const fetch = useSamiPAtientsPaginationStore((state) => state.fetchData);
  const data = useSamiPAtientsPaginationStore((state) => state.data);
  const isLoading = useSamiPAtientsPaginationStore((state) => state.loading);
  const search = useSamiPAtientsPaginationStore((state) => state.search);
  const pageSize = useSamiPAtientsPaginationStore((state) => state.pageSize);
  const pageIndex = useSamiPAtientsPaginationStore((state) => state.pageIndex);
  const setPageIndex = useSamiPAtientsPaginationStore((state) => state.setPageIndex);
  const setPageSize = useSamiPAtientsPaginationStore((state) => state.setPageSize);
  const count = useSamiPAtientsPaginationStore((state) => state.count);

  useEffect(() => {
    fetch();
  }, [search, pageSize, pageIndex]);

  return {
    data,
    isLoading,
    pageSize,
    pageIndex,
    setPageIndex,
    setPageSize,
    count,
  };
};

export const PatientsEntrySamiTable = () => {
  const { data, isLoading, count, pageIndex, pageSize, setPageIndex, setPageSize } = useGetData();

  if (isLoading)
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={TABLE_HEADER} />
          {data.length > 0 && (
            <>
              <TableBody>
                {data.map((d) => (
                  <PatientsEntrySamiTableRow data={d} key={d.id_IngresoPaciente} />
                ))}
              </TableBody>
              <TableFooterComponent
                count={count}
                pageIndex={pageIndex}
                pageSize={pageSize}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
              />
            </>
          )}
        </Table>
      </TableContainer>
      {data.length < 1 && <NoDataInTableInfo infoTitle="No hay registros de SAMI" />}
    </Card>
  );
};

const PatientsEntrySamiTableRow = (props: { data: ISAMInuevo }) => {
  const { data } = props;
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdmition, setOpenAdmition] = useState(false);
  const refetch = useSamiPAtientsPaginationStore((state) => state.fetchData);

  const handlePrint = () => {
    generateSamiDoc({
      name: data.nombrePaciente,
      lastName: data.paciente.apellidoPaterno,
      secondLastName: data.paciente.apellidoMaterno,
      birthDate: data.paciente.fechaNacimiento,
      genere: data.paciente.genero,
      civilStatus: data.paciente.estadoCivil,
      phoneNumber: data.paciente.telefono,
      zipCode: data.paciente.codigoPostal,
      neighborhood: data.paciente.colonia,
      address: data.paciente.direccion,
      personInCharge: data.paciente.nombreResponsable,
    });
  };

  const handleAdmitSamiPatient = () => {
    Swal.fire({
      title: '¿Desea admitir al paciente en el hospital?',
      text: 'Se le pedirá una serie de datos para completar el registro',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, admitir',
    }).then(async (res) => {
      if (res.isConfirmed) {
          console.log(data);
          setOpenAdmition(true)
        /*try {
          console.log(data);
          await admitPatient({ 
            id_IngresoPaciente: data.id_IngresoPaciente,
            paciente: data.paciente,
          });
          refetch();
          Swal.fire('Paciente admitido correctamente', '', 'success');
        } catch (error) {
          Swal.fire('Error al admitir al paciente', '', 'error');
        }*/
      }
    });
  };

  const nombrePaciente = data.nombrePaciente;

  return (
    <>
      <TableRow>
        <TableCell>{nombrePaciente}</TableCell>
        <TableCell>{dayjs(data.fechaIngreso).format('DD/MM/YYYY - hh:mm a')}</TableCell>
        <TableCell>
          <Button
            variant="outlined"
            startIcon={
              <FaEye
                style={{
                  color: '#81B5DE',
                }}
              />
            }
            onClick={() => setOpen(true)}
          >
            Ver datos
          </Button>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            <Tooltip title="Pasar a admisión">
              <IconButton onClick={handleAdmitSamiPatient}>
                <CheckCircle color="success" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton onClick={() => setOpenEdit(true)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Imprimir">
              <IconButton onClick={handlePrint}>
                <Print />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <SamiPatientDetailsModal
            patient={{
              ...data.paciente,
              codigoPostalResponsable: '',
              coloniaResponsable: '',
              domicilioResponsable: '',
              ocupacion: '',
              parentesco: '',
              telefonoResponsable: '',
              ciudad: '',
              estado: '',
            }}
            setOpen={setOpen}
          />
        </>
      </Modal>
      <Modal open={openEdit}>
        <>
          <AddPatientsEntrySami setOpen={setOpenEdit} isEdit patientData={data.paciente} medicId="" />
        </>
      </Modal>
      <Modal open={openAdmition}>
        <>
          <EditPersonalInfoModal setOpen={setOpenAdmition} id_IngresoPaciente={data.id_IngresoPaciente} optionalRefetch={refetch} />
        </>
      </Modal>
    </>
  );
};
