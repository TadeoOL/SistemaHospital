// import { Box, ButtonBase, Collapse, Stack } from "@mui/material";
// import { IModuleItems } from "../../types/types";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import { useAppNavStore } from "../../store/appNav";
// import { shallow } from "zustand/shallow";

// interface ISideNavItems extends IModuleItems {
//   active: boolean;
//   disabled: boolean;
// }

// export const SideNavItems = (props: ISideNavItems) => {
//   const SelectedOptionColor = "#9ca1a5";
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const { setOpen, open } = useAppNavStore(
//     (state) => ({ setOpen: state.setOpen, open: state.open }),
//     shallow
//   );

//   useEffect(() => {
//     if (!open) setIsOpen(false);
//   }, [open]);

//   return (
//     <li>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           ...(props.active && {
//             backgroundColor: "rgba(255, 255, 255, 0.04)",
//           }),
//           "&:hover": {
//             backgroundColor: "rgba(255, 255, 255, 0.04)",
//           },
//           borderRadius: 1,
//         }}
//       >
//         <ButtonBase
//           onClick={() => {
//             if (props.active && !props.children) {
//               setOpen(false);
//               navigate(props.path);
//             } else {
//               setOpen(true);
//               setIsOpen(!isOpen);
//             }
//           }}
//           sx={{
//             alignItems: "center",
//             borderRadius: 1,
//             display: "flex",
//             justifyContent: "flex-start",
//             pl: "16px",
//             pr: "16px",
//             py: "6px",
//             textAlign: "left",
//             width: "100%",
//           }}
//         >
//           {props.icon && (
//             <Box
//               component="span"
//               sx={{
//                 alignItems: "center",
//                 color: "neutral.400",
//                 display: "inline-flex",
//                 justifyContent: "center",
//                 mr: 2,
//                 ...(props.active && {
//                   color: "primary.main",
//                 }),
//               }}
//             >
//               {props.icon}
//             </Box>
//           )}
//           {open && (
//             <>
//               <Box
//                 component="span"
//                 sx={{
//                   color: "white",
//                   flexGrow: 1,
//                   fontSize: 14,
//                   fontWeight: 400,
//                   lineHeight: "24px",
//                   whiteSpace: "nowrap",
//                   ...(props.active && {
//                     color: "common.white",
//                   }),
//                   ...(props.disabled && {
//                     color: "neutral.500",
//                   }),
//                 }}
//               >
//                 {props.title}
//               </Box>
//               <Box
//                 component="span"
//                 sx={{
//                   alignItems: "center",
//                   color: "neutral.400",
//                   display: "inline-flex",
//                   justifyContent: "center",
//                   transition: "color 0.3s ease-in-out",
//                   ...(props.active && {
//                     color: "primary.main",
//                   }),
//                 }}
//               >
//                 {isOpen && props.children ? (
//                   <ExpandLess />
//                 ) : (
//                   props.children && <ExpandMore />
//                 )}
//               </Box>
//             </>
//           )}
//         </ButtonBase>
//         {props.childrenItems && props.childrenItems.length === 0 ? null : (
//           <Collapse in={isOpen}>
//             {props.children &&
//               props.children.map((childItem, i) => {
//                 const pathSplit = location.pathname.split("/");
//                 const childSplit = childItem.path.split("/");
//                 const isActive = pathSplit.includes(childSplit[2]);
//                 return (
//                   <Stack key={i}>
//                     <ButtonBase
//                       onClick={() => {
//                         if (isActive) {
//                           null;
//                         } else {
//                           setIsOpen(false);
//                           setOpen(false);
//                           navigate(childItem.path);
//                         }
//                       }}
//                       sx={{
//                         ...(isActive && {
//                           backgroundColor: "rgba(255, 255, 255, 0.04)",
//                         }),
//                         alignItems: "center",
//                         borderRadius: 1,
//                         display: "flex",
//                         justifyContent: "flex-start",
//                         pl: "28px",
//                         pr: "16px",
//                         py: "6px",
//                         textAlign: "left",
//                         width: "100%",
//                         "&:hover": {
//                           backgroundColor: "rgba(255, 255, 255, 0.04)",
//                         },
//                       }}
//                     >
//                       {childItem.icon && (
//                         <Box
//                           component="span"
//                           sx={{
//                             alignItems: "center",
//                             color: "neutral.400",
//                             display: "inline-flex",
//                             justifyContent: "center",
//                             mr: 2,
//                             ...(props.active && {
//                               color: "primary.main",
//                             }),
//                           }}
//                         >
//                           {childItem.icon}
//                         </Box>
//                       )}
//                       <Box
//                         component="span"
//                         sx={{
//                           color: "neutral.400",
//                           flexGrow: 1,
//                           fontFamily: (theme) => theme.typography.fontFamily,
//                           fontSize: 14,
//                           fontWeight: 600,
//                           lineHeight: "24px",
//                           whiteSpace: "nowrap",
//                           ...(props.active && {
//                             color: "common.white",
//                           }),
//                           ...(props.disabled && {
//                             color: "neutral.500",
//                           }),
//                         }}
//                       >
//                         {childItem.title}
//                       </Box>
//                     </ButtonBase>
//                   </Stack>
//                 );
//               })}
//           </Collapse>
//         )}
//       </Box>
//     </li>
//   );
// };
