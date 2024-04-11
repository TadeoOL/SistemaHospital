import { ISideBarWarehouse } from '../../types/types';
import { SideNavItems } from './SideNav';

interface SideNavWarehousesProps {
  warehouses: ISideBarWarehouse[];
  roles: string[];
}

export const SideNavWarehouses: React.FC<SideNavWarehousesProps> = ({ warehouses, roles }) => {
  return (
    <>
      {warehouses.map((warehouse) => {
        const children = warehouse.subAlmacenes.map((sw) => {
          return {
            title: sw.nombre,
            icon: null,
            path: `/almacenes/${sw.id}`,
            id: sw.id,
          };
        });

        if (!roles.includes('ADMIN') && warehouse.subAlmacenes.length === 0) return null;
        return (
          <SideNavItems
            icon={null}
            path={`/almacenes/${warehouse.id}`}
            roles={roles}
            title={warehouse.nombre}
            warehouses={warehouses}
            children={children}
            key={warehouse.id}
            id={warehouse.id}
          />
        );
      })}
    </>
  );
};
