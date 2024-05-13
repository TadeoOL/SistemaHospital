// Roles para compras
export const purchaseGlobalRoles = ['ADMIN'];
export const supplyRoles = [...purchaseGlobalRoles, 'ABASTECIMIENTO'];
export const purchasingDirector = [...purchaseGlobalRoles, 'DIRECTORCOMPRAS'];
//Roles para farmacia
export const pharmacyDirectorRole = [...purchaseGlobalRoles, 'DIRECTORCFARMACIA'];
export const nurseRole = [...pharmacyDirectorRole, 'ENFERMERO'];
export const pharmacyManager = [...pharmacyDirectorRole, 'ENCARGADOFARMACIA'];
export const checkoutSell = [...pharmacyDirectorRole, 'VENTAS'];
