// import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material';
// import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
// import { useGetAllNursesUsers } from '../../../../hooks/hospitalization/useGetAllNurse';
// import { SubmitHandler, useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { nurseSchema } from '../../../../schema/hospitalization/hospitalizationSchema';
// import { toast } from 'react-toastify';
// import { useHospitalRoomsPaginationStore } from '../../../../store/hospitalization/hospitalRoomsPagination';

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

// interface Inputs {
//   nurse: { id_Enfermero: string; nombre: string } | null;
// }
// export const AssignNurseModal = (props: {
//   setOpen: Function;
//   registerRoomId: string;
//   nurses: { id_Enfermero: string; nombre: string }[];
// }) => {
//   const { isLoadingNursesUsers, nursesUsersData } = useGetAllNursesUsers();
//   const refetch = useHospitalRoomsPaginationStore((state) => state.fetchData);

//   const {
//     watch,
//     setValue,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<Inputs>({
//     defaultValues: {
//       nurse: props.nurses.length > 0 ? props.nurses[0] : null,
//     },
//     resolver: zodResolver(nurseSchema),
//   });

//   const onSubmit: SubmitHandler<Inputs> = (data) => {
//     try {
//       console.log(data);
//       // modifyOperatingRoomRegister({
//       //   enfermeros: JSON.stringify([...props.nurses, data.nurse]),
//       //   id_RegistroCuarto: props.registerRoomId,
//       // });
//       toast.success('Enfermero agregado correctamente');
//       refetch();
//       props.setOpen(false);
//     } catch (error) {
//       console.log(error);
//       toast.error('Error al asignar el enfermero');
//     }
//   };

//   return (
//     <Box sx={style}>
//       <HeaderModal setOpen={props.setOpen} title="Asignar Enfermero" />
//       <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
//         <form id="form1" onSubmit={handleSubmit(onSubmit)} />
//         <Typography>Agregar enfermero</Typography>
//         <Autocomplete
//           loading={isLoadingNursesUsers}
//           options={nursesUsersData}
//           noOptionsText="No se encontraron enfermeros"
//           getOptionLabel={(option) => option.nombre}
//           isOptionEqualToValue={(option, value) => option.id_Enfermero === value.id_Enfermero}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               placeholder="Enfermeros"
//               error={!!errors.nurse?.message}
//               helperText={errors.nurse?.message}
//             />
//           )}
//           onChange={(_, value) => setValue('nurse', value)}
//           value={watch('nurse')}
//         />
//       </Box>
//       <Box
//         sx={{
//           bgcolor: 'background.paper',
//           p: 1,
//           display: 'flex',
//           justifyContent: 'space-between',
//           borderBottomLeftRadius: 10,
//           borderBottomRightRadius: 10,
//         }}
//       >
//         <Button variant="outlined" color="error" onClick={() => props.setOpen(false)}>
//           Cerrar
//         </Button>
//         <Button variant="contained" type="submit" form="form1">
//           Guardar
//         </Button>
//       </Box>
//     </Box>
//   );
// };
