// Roles para compras
export const purchaseGlobalRoles = ['ADMIN'];
export const supplyRoles = [...purchaseGlobalRoles, 'ABASTECIMIENTO'];
export const purchasingDirector = [...purchaseGlobalRoles, 'DIRECTORCOMPRAS'];
//Roles para farmacia
export const pharmacyDirectorRole = [...purchaseGlobalRoles, 'DIRECTORCFARMACIA'];
export const nurseRole = [...pharmacyDirectorRole, 'ENFERMERO'];
export const pharmacyManager = [...pharmacyDirectorRole, 'ENCARGADOFARMACIA'];
//Roles para Venta
export const checkoutAdmin = [...purchaseGlobalRoles, 'ADMINISTRADORCAJA'];
export const checkoutSell = [...purchaseGlobalRoles, 'PASECAJA'];
export const checkout = [...purchaseGlobalRoles, 'CAJA'];
//Roles Hospitalizacion
export const hospitalization = [...purchaseGlobalRoles, 'HOSPITALIZACION'];
export const hospitalizationANDnurse = [...nurseRole, 'HOSPITALIZACION'];

//Roles Admision
export const admission = [...purchaseGlobalRoles, 'ADMISION'];
export const closeAccount = [...purchaseGlobalRoles, 'CERRARCUENTA'];
//Roles programacion
export const programation = [...purchaseGlobalRoles, 'PROGRAMACION'];

//Roles Quirofano
export const operatingRoom = [...purchaseGlobalRoles, 'QUIROFANO'];
export const operatingRoomANDnurse = [...nurseRole, 'QUIROFANO'];

//Roles radiografia??? wea para ultrasonido, analisis radiografia etc
export const xrayAdmin = [...purchaseGlobalRoles, 'RAYOSXADMIN'];
export const invoiceAdmin = [...purchaseGlobalRoles, 'FACTURACION'];
