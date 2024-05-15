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
