import { useGetAnesthesiologists } from "../../../../hooks/hospitalization/useGetAnesthesiologists";
import { useDailyOperatingRoomsPaginationStore } from "../../../../store/operatingRoom/dailyOperatingRoomsPagination";
import { Box, Typography, Autocomplete, TextField, Button } from "@mui/material";
import { toast } from "react-toastify";
import { HeaderModal } from "../../../Account/Modals/SubComponents/HeaderModal";
import { useGetAllNursesUsers } from "../../../../hooks/hospitalization/useGetAllNurse";
import { useState } from "react";
import { useGetMedics } from "../../../../hooks/programming/useGetDoctors";
import { modifyOperatingRoom } from "../../../../services/operatingRoom/operatingRoomService";

interface Props {
  setOpen: Function;
  registerRoomId: string;
  surgeon?: { id_Medico: string; nombre: string };
  anesthesiologist?: { id_Anestesiologo: string; nombre: string; };
  nurse?: { id: string; nombre: string }
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 800 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
};

const topContainerStyle = {
  bgcolor: 'background.paper',
  p: 2,
};

const bottomContainerStyle = {
  bgcolor: 'background.paper',
  p: 1,
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
  display: 'flex',
  justifyContent: 'space-between',
};

export const FormSurgeryInfoEditModal = (props: Props) => {
  const { doctorsData, isLoadingMedics } = useGetMedics();
  const { nursesUsersData, isLoadingNursesUsers } = useGetAllNursesUsers();
  const { anesthesiologistsData, isLoadingAnesthesiologists } = useGetAnesthesiologists();
  const refetch = useDailyOperatingRoomsPaginationStore((state) => state.fetchData);
  const [anesthesiologist, setAnesthesiologist] = useState<{ id_Anestesiologo: string; nombre: string; } | null>(props.anesthesiologist ? props.anesthesiologist : null)
  const [nurseSelected, setNurseSelected] = useState<{ id: string; nombre: string; } | null>(props.nurse ? props.nurse : null)
  const [medicSelected, setMedicSelected] = useState<{ id_Medico: string; nombre: string; } | null>(props.surgeon ? props.surgeon : null)
  const [nurseError, setNurseError] = useState(false);
  const [medicError, setMedicError] = useState(false);
  const [anesthesiologistError, setAnesthesiologistError] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  const onSubmit = async () => {
    setLoadingSubmit(true)
    try {
      if(!nurseSelected){
        setNurseError(true)
      }
      if(!anesthesiologist){
        setAnesthesiologistError(true)
      }
      if(!medicSelected){
        setMedicError(true);
      }
      if(!(nurseSelected && medicSelected && anesthesiologist)){
        return
      }
      console.log(props.registerRoomId);
      await modifyOperatingRoom({
        id_CuentaEspacioHospitalario: props.registerRoomId,
        id_Anestesiologo: anesthesiologist?.id_Anestesiologo,
        id_EnfermeroEncargado: nurseSelected?.id,
        id_Medico: medicSelected?.id_Medico
      });
      toast.success('Informacion completada con éxito!');
      refetch();
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error((error as any).response.data.message[0]);
    } finally {
      setLoadingSubmit(false);
    }
  };
  return (
    <>
      <Box sx={style} >
        <HeaderModal setOpen={props.setOpen} title={'Iniciar Cirugía'} />

        <Box sx={topContainerStyle}>
          <Typography>Seleccione el Médico</Typography>
          <Autocomplete
            onChange={(_, val) => {
              if (!val) return;
              setMedicSelected(val);
              setMedicError(false);
            }}
            loading={isLoadingMedics}
            getOptionLabel={(option) => option.nombre}
            isOptionEqualToValue={(option, value) => option.id_Medico === value.id_Medico}
            options={doctorsData}
            value={medicSelected}
            onInputChange={(_, __, reason) => {
              if (reason === 'clear') {
                setMedicSelected(null)
              }
            }}
            noOptionsText="No se encontraron medicos"
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Medico"
                error={medicError}
                helperText={"Es necesario seleccionar un medico"}
              />
            )}
          />

          <Typography>Seleccione el Anestesiólogo</Typography>
          <Autocomplete
            onChange={(_, val) => {
              if (!val) return;
              setAnesthesiologist(val)
              setAnesthesiologistError(false)
            }}
            loading={isLoadingAnesthesiologists}
            getOptionLabel={(option) => option.nombre }
            isOptionEqualToValue={(option, value) => option.id_Anestesiologo === value.id_Anestesiologo}
            options={anesthesiologistsData}
            value={anesthesiologist}
            onInputChange={(_, __, reason) => {
              if (reason === 'clear') {
                setAnesthesiologist(null)
              }
            }}
            noOptionsText="No se encontraron anestesiólogos"
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Anestesiólogos"
                error={anesthesiologistError}
                helperText={'Es necesario seleccionar un anestesiólogo'}
              />
            )}
          />
          <Typography>Seleccione el Enfermero a Cargo</Typography>
          <Autocomplete
            onChange={(_, val) => {
              if (!val) return;
              setNurseSelected(val)
              setNurseError(false)
            }}
            loading={isLoadingNursesUsers}
            getOptionLabel={(option) => option.nombre}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={nursesUsersData}
            value={nurseSelected}
            onInputChange={(_, __, reason) => {
              if (reason === 'clear') {
                setNurseSelected(null)
              }
            }}
            noOptionsText="No se encontraron enfermeros"
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Enfermero"
                error={nurseError}
                helperText={'Es necesario seleccionar un enfermero'}
              />
            )}
          />

        </Box>
        <Box sx={bottomContainerStyle}>
          <Button onClick={() => { }}>Regresar</Button>
          <Button type="submit" form="form1" variant="contained" disabled={loadingSubmit} onClick={()=>{onSubmit()}} >
            {loadingSubmit? 'Guardando...' : 'Guardar'  }
          </Button>
        </Box>
      </Box>

    </>
  );
}