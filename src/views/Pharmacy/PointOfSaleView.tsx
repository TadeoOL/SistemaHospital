import { Backdrop, Stack } from '@mui/material';
import { PointOfSale } from '../../components/Pharmacy/PointOfSale/PointOfSale';
import { PointOfSaleTabs } from '../../components/Pharmacy/PointOfSale/PointOfSaleTabs';
import { usePosTabNavStore } from '../../store/pharmacy/pointOfSale/posTabNav';
import { useEffect, useState } from 'react';
import { usePosOrderArticlesStore } from '../../store/pharmacy/pointOfSale/posOrderArticles';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { error, primary } from '../../theme/colors';
import { IUser, IUserSalesRegister } from '../../types/types';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../store/auth';
import { createUserSalesRegister, getUserSalesRegister } from '../../services/pharmacy/pointOfSaleService';
import { ArticlesSoldHistory } from '../../components/Pharmacy/PointOfSale/ArticlesSoldHistory';
// import { useShallow } from 'zustand/react/shallow';
import { ReceiptEmitterPharmacy } from '../../components/Pharmacy/PointOfSale/ReceiptEmitterPharmacy';

const alert = (navigate: NavigateFunction, userData: IUserSalesRegister, setIsLoading: Function) => {
  Swal.fire({
    title: 'Advertencia',
    text: `Para poder acceder al punto de venta es necesario crear una caja. Al hacer click en el botón aceptar automáticamente se creara una caja, en caso de rechazar sera redireccionado al inicio`,
    icon: 'warning',
    confirmButtonText: 'Aceptar',
    confirmButtonColor: primary.main,
    cancelButtonText: 'Rechazar',
    cancelButtonColor: error.main,
    showCancelButton: true,
    reverseButtons: true,
  }).then(async (res) => {
    if (res.isDenied || res.dismiss) return navigate('/');
    if (res.isConfirmed) {
      try {
        const res = await createUserSalesRegister();
        usePosOrderArticlesStore.setState({ userSalesRegisterData: { ...userData, id: res.id } });
        Swal.fire({
          icon: 'success',
          title: 'Éxito!',
          text: 'Se ha creado la caja correctamente!',
        });
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Se ha generado un error al crear la caja!',
        }).then((res) => {
          if (res.dismiss || res.isConfirmed) return navigate('/');
        });
      }
    }
  });
};

// const closeCheckoutAlert = () => {
//   Swal.fire({
//     title: 'Advertencia',
//     text: `Su jornada laboral ya paso, favor de cerrar la caja y imprimir el ticket para realizar nuevas compras`,
//     icon: 'warning',
//     confirmButtonText: 'Aceptar',
//     confirmButtonColor: primary.main,
//   });
// };

const useGetUserSalesRegister = (navigate: NavigateFunction) => {
  const [isLoading, setIsLoading] = useState(true);
  const setUserSalesRegisterData = usePosOrderArticlesStore((state) => state.setUserSalesRegisterData);
  const userSalesRegisterData = usePosOrderArticlesStore((state) => state.userSalesRegisterData);
  const profile = useAuthStore((state) => state.profile) as IUser;

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const res = await getUserSalesRegister(profile.id);
      if (!res.tieneCaja || res.cerrada) return alert(navigate, userSalesRegisterData, setIsLoading);
      setUserSalesRegisterData(res);
      try {
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return isLoading;
};

const returnPosView = (tabValue: number) => {
  switch (tabValue) {
    case 0:
      return <PointOfSale />;
    case 1:
      return <ReceiptEmitterPharmacy />;
    case 2:
      return <ArticlesSoldHistory />;
    default:
      break;
  }
};

const PointOfSaleView = () => {
  const tabValue = usePosTabNavStore((state) => state.tabValue);
  const navigate = useNavigate();
  // const profile = useAuthStore((state) => state.profile);
  const isLoading = useGetUserSalesRegister(navigate);
  const clearData = usePosOrderArticlesStore((state) => state.clearData);
  // const data = usePosOrderArticlesStore(useShallow((state) => state.userSalesRegisterData));

  useEffect(() => {
    return () => {
      clearData();
    };
  }, []);

  // useEffect(() => {
  //   const checkJornadaLaboral = () => {
  //     // if (data.pasoSuJornada) {
  //     //   closeCheckoutAlert();
  //     // }
  //   };
  //   checkJornadaLaboral();
  //   const intervalId = setInterval(checkJornadaLaboral, 60 * 10000000);
  //   return () => clearInterval(intervalId);
  // }, [data]);

  return (
    <Stack sx={{ display: 'flex', flex: 1 }}>
      <PointOfSaleTabs />
      {isLoading ? <Backdrop open /> : returnPosView(tabValue)}
    </Stack>
  );
};

export default PointOfSaleView;
