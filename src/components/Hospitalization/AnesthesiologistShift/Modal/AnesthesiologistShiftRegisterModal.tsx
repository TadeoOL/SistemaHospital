// import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material';
// import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
// import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';
// import { Controller, SubmitHandler, useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { anesthesiologistShiftRegisterSchema } from '../../../../schema/hospitalization/hospitalizationSchema';
// import { toast } from 'react-toastify';
// import { useGetAnesthesiologists } from '../../../../hooks/hospitalization/useGetAnesthesiologists';
// import { registerAnesthesiologistShift } from '../../../../services/hospitalization/anesthesiologistShift';
// import 'dayjs/locale/es-mx';
// dayjs.locale('es-mx');

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: { xs: 380, sm: 550 },
//   borderRadius: 2,
//   boxShadow: 24,
//   display: 'flex',
//   flexDirection: 'column',
//   maxHeight: { xs: 900 },
// };

// interface AnesthesiologistShiftRegisterModalProps {
//   setOpen: Function;
//   start: Date;
//   end: Date;
//   newEventAdded: boolean;
//   setNewEventAdded: Function;
// }
// interface Inputs {
//   startShift: Date;
//   endShift: Date;
//   anesthesiologist: { id: string; nombre: string } | null;
// }

// export const AnesthesiologistShiftRegisterModal = (props: AnesthesiologistShiftRegisterModalProps) => {
//   const { isLoadingAnesthesiologists, anesthesiologistsData } = useGetAnesthesiologists();

//   const {
//     formState: { errors },
//     control,
//     watch,
//     setValue,
//     handleSubmit,
//   } = useForm<Inputs>({
//     defaultValues: {
//       startShift: props.start,
//       endShift: props.end,
//       anesthesiologist: null,
//     },
//     resolver: zodResolver(anesthesiologistShiftRegisterSchema),
//   });
//   const watchAnesthesiologist = watch('anesthesiologist');

//   const onSubmit: SubmitHandler<Inputs> = async (data) => {
//     try {
//       await registerAnesthesiologistShift({
//         id_Anestesiologo: data.anesthesiologist?.id as string,
//         finGuardia: data.endShift,
//         inicioGuardia: data.startShift,
//       });
//       toast.success('Guardia registrada con éxito!');
//       props.setNewEventAdded(!props.newEventAdded);
//       props.setOpen(false);
//     } catch (error: any) {
//       console.log(error);
//       toast.error(error.response.data.message[0]);
//     }
//   };

//   return (
//     <Box sx={style}>
//       <HeaderModal setOpen={props.setOpen} title="Registrar guardia anestesiologo" />
//       <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
//         <form onSubmit={handleSubmit(onSubmit)} id="form1" />
//         <Typography>Selecciona el anestesiologo:</Typography>
//         <Autocomplete
//           onChange={(_, val) => {
//             if (!val) return;
//             setValue('anesthesiologist', val);
//           }}
//           loading={isLoadingAnesthesiologists}
//           getOptionLabel={(option) => option.nombre}
//           isOptionEqualToValue={(option, value) => option.id === value.id}
//           options={anesthesiologistsData}
//           value={watchAnesthesiologist}
//           onInputChange={(_, __, reason) => {
//             if (reason === 'clear') {
//               setValue('anesthesiologist', null);
//             }
//           }}
//           noOptionsText="No se encontraron anestesiologos"
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               placeholder="Anestesiologos"
//               error={!!errors.anesthesiologist?.message}
//               helperText={errors.anesthesiologist?.message}
//             />
//           )}
//         />
//         <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mt: 2 }}>
//           <Box sx={{ flex: 1 }}>
//             <Typography>Inicio de la guardia:</Typography>
//             <Controller
//               name="startShift"
//               control={control}
//               render={({ field: { onChange, value } }) => (
//                 <LocalizationProvider dateAdapter={AdapterDayjs}>
//                   <DateTimePicker
//                     ampm={false}
//                     label="Fecha inicio"
//                     defaultValue={dayjs(props.start)}
//                     disablePast
//                     value={dayjs(value)}
//                     onChange={onChange}
//                     slotProps={{
//                       textField: {
//                         error: !!errors.startShift?.message,
//                         helperText: errors.startShift?.message,
//                       },
//                     }}
//                   />
//                 </LocalizationProvider>
//               )}
//             />
//           </Box>
//           <Box sx={{ flex: 1 }}>
//             <Typography>Fin de la guardia:</Typography>
//             <Controller
//               name="endShift"
//               control={control}
//               render={({ field: { onChange, value } }) => (
//                 <LocalizationProvider dateAdapter={AdapterDayjs}>
//                   <DateTimePicker
//                     ampm={false}
//                     label="Fecha fin"
//                     defaultValue={dayjs(props.end)}
//                     value={dayjs(value)}
//                     onChange={onChange}
//                     slotProps={{
//                       textField: {
//                         error: !!errors.endShift?.message,
//                         helperText: errors.endShift?.message,
//                       },
//                     }}
//                   />
//                 </LocalizationProvider>
//               )}
//             />
//           </Box>
//         </Box>
//       </Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'background.paper' }}>
//         <Button variant="outlined" color="error" onClick={() => props.setOpen(false)}>
//           Cancelar
//         </Button>
//         <Button variant="contained" form="form1" type="submit">
//           Guardar
//         </Button>
//       </Box>
//     </Box>
//   );
// };
