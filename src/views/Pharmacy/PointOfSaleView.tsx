import { Backdrop, Stack } from '@mui/material';
import { PointOfSale } from '../../components/Pharmacy/PointOfSale/PointOfSale';
import { PointOfSaleTabs } from '../../components/Pharmacy/PointOfSale/PointOfSaleTabs';
import { usePosTabNavStore } from '../../store/pharmacy/pointOfSale/posTabNav';
import { AuthArticlesSold } from '../../components/Pharmacy/PointOfSale/AuthArticlesSold';
import { useEffect, useState } from 'react';
import { usePosOrderArticlesStore } from '../../store/pharmacy/pointOfSale/posOrderArticles';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { error, primary } from '../../theme/colors';
import { IUserSalesRegister } from '../../types/types';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../store/auth';
import { createUserSalesRegister, getUserSalesRegister } from '../../services/pharmacy/pointOfSaleService';
import { ArticlesSoldHistory } from '../../components/Pharmacy/PointOfSale/ArticlesSoldHistory';

const alert = (userId: string, navigate: NavigateFunction, userData: IUserSalesRegister, setIsLoading: Function) => {
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
        const res = await createUserSalesRegister(userId);
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

const useGetUserSalesRegister = (userId: string, navigate: NavigateFunction) => {
  const [isLoading, setIsLoading] = useState(true);
  const setUserSalesRegisterData = usePosOrderArticlesStore((state) => state.setUserSalesRegisterData);
  const userSalesRegisterData = usePosOrderArticlesStore((state) => state.userSalesRegisterData);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const res = await getUserSalesRegister(userId);
      setUserSalesRegisterData(res);
      if (!res.tieneCaja) return alert(userId, navigate, userSalesRegisterData, setIsLoading);
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
      return <AuthArticlesSold />;
    case 2:
      return <ArticlesSoldHistory />;
    default:
      break;
  }
};

const PointOfSaleView = () => {
  const tabValue = usePosTabNavStore((state) => state.tabValue);
  const navigate = useNavigate();
  const profile = useAuthStore((state) => state.profile);
  const isLoading = useGetUserSalesRegister(profile?.id as string, navigate);
  const clearData = usePosOrderArticlesStore((state) => state.clearData);

  useEffect(() => {
    return () => {
      clearData();
    };
  }, []);

  return (
    <Stack sx={{ display: 'flex', flex: 1 }}>
      <PointOfSaleTabs />

      {isLoading ? <Backdrop open /> : returnPosView(tabValue)}
    </Stack>
  );
};

export default PointOfSaleView;
