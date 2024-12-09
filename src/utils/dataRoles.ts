// Roles para compras
export const purchaseGlobalRoles = ['ADMIN'];
//COMPRAS
export const supplyRoles = [...purchaseGlobalRoles, 'COMPRAS'];
export const purchasingDirector = [...purchaseGlobalRoles, 'DIRECTORCOMPRAS'];
//almacen
export const warehouse = [...purchaseGlobalRoles, 'ALMACEN'];
//Roles para farmacia
export const pharmacyManager = [...purchaseGlobalRoles, 'FARMACIA'];
//Roles programacion
export const programation = [...purchaseGlobalRoles, 'PROGRAMACION'];
//Roles Admision
export const admission = [...purchaseGlobalRoles, 'ADMISION'];
//Roles Hospitalizacion
export const hospitalization = [...purchaseGlobalRoles, 'HOSPITALIZACION'];
//Roles Quirofano
export const operatingRoom = [...purchaseGlobalRoles, 'QUIROFANO'];
//enfermeria
export const nurseRole = [...purchaseGlobalRoles, 'ENFERMERIA'];

//SERVICIOS
export const xrayAdmin = [...purchaseGlobalRoles, 'SERVICIOS'];

//Roles CAJA
export const checkout = [...purchaseGlobalRoles, 'CAJA'];
export const checkoutDirector = [...purchaseGlobalRoles, 'DIRECTORCAJA'];

export const invoiceAdmin = [...purchaseGlobalRoles, 'FACTURACION'];
export const reports = [...purchaseGlobalRoles, 'REPORTES'];
