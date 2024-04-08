import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { styled, useTheme } from '@mui/material/styles';
import {
  Collapse,
  Drawer,
  List,
  Stack,
  Tooltip,
  TooltipProps,
  Typography,
  tooltipClasses,
  useMediaQuery,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Plug from '../../assets/Plug.svg';
import { useAppNavStore } from '../../store/appNav';
import { ModuleList } from '../../utils/ModuleItems';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useAuthStore } from '../../store/auth';
import { useShallow } from 'zustand/react/shallow';
import { IModuleItems, IModuleItemsList } from '../../types/types';
import { ExpandLess, ExpandMore, Info } from '@mui/icons-material';
import { getSideBardWarehouse } from '../../api/api.routes';
import { useSubWarehousePaginationStore } from '../../store/warehouseStore/subWarehousePagination';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'rgba(0, 0, 0, 0.87)',
    color: 'rgba(255, 255, 255, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const useGetWarehouses = () => {
  const [warehouses, setWarehouses] = useState<any[]>();
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(true);
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getSideBardWarehouse();
        setWarehouses(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingWarehouses(false);
      }
    };
    fetch();
  }, []);
  return { warehouses, isLoadingWarehouses };
};

interface SideNavItemsProps {
  icon: React.ReactNode;
  title: string;
  path: string;
  children?: IModuleItems[];
  warehouses: { id: string; nombre: string }[];
  roles: string[];
}

const SideNavItems: React.FC<SideNavItemsProps> = ({ icon, title, path, children, warehouses, roles }) => {
  const SelectedOptionColor = '#9ca1a5';
  const location = useLocation();
  const isOpen = useAppNavStore(useShallow((state) => state.open));
  const setIsOpen = useAppNavStore(useShallow((state) => state.setOpen));
  const isActive = children ? children.some((child) => child.path === location.pathname) : path === location.pathname;
  const navigate = useNavigate();
  const [childOpen, setChildOpen] = useState(false);
  const handleClick = (title: string, roles: string[]) => {
    if (isActive && !children) return;
    if (!children) {
      if (!roles.includes('ADMIN') && title === 'Almacén') {
        if (!isOpen) {
          setIsOpen(true);
          setChildOpen(true);
          return;
        } else {
          setChildOpen(!childOpen);
          return;
        }
      }
      setIsOpen(false);
      navigate(path);
    } else {
      if (!isOpen) {
        setIsOpen(true);
        setChildOpen(true);
      } else {
        setChildOpen(!childOpen);
      }
    }
  };
  useEffect(() => {
    if (!isOpen) setChildOpen(false);
  }, [isOpen]);

  const iconInSideBar = (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <ListItemIcon sx={{ mr: 1 }}>{icon}</ListItemIcon>

      {isOpen ? (
        <Typography
          variant="body1"
          sx={{
            display: 'inline',
          }}
        >
          {title}
        </Typography>
      ) : null}
    </Box>
  );

  if (title === 'Almacén' && !warehouses && !roles.includes('ADMIN')) return null;
  return (
    <>
      <ListItemButton
        onClick={(e) => {
          handleClick(title, roles);
          e.stopPropagation();
        }}
        selected={isActive}
        sx={{
          '&.Mui-selected': {
            backgroundColor: '#046DBD',
            width: isOpen ? '100%' : '40px',
          },
          '&:hover': {
            backgroundColor: '#373b3e',
            opacity: 10,
            width: isOpen ? '100%' : '40px',
          },
          '&.Mui-selected:hover': { backgroundColor: SelectedOptionColor },
          borderRadius: 1,
          mb: 1,
          p: 1,
          width: '100%',
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {children ? (
          <>
            <HtmlTooltip
              sx={{ visibility: isOpen ? 'hidden' : 'visible' }}
              title={
                <React.Fragment>
                  {children.map((childItem, i) => {
                    const pathSplit = location.pathname.split('/');
                    const childSplit = childItem.path.split('/');
                    const isActive = pathSplit.includes(childSplit[2]);
                    const uniqueKey = `${childItem.path}-${i}`;
                    return (
                      <ListItemButton
                        key={uniqueKey}
                        onClick={(e) => {
                          console.log('aa');

                          e.stopPropagation();
                          navigate(childItem.path);
                        }}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: '#046DBD',
                            opacity: 1,
                          },
                          '&:hover': {
                            backgroundColor: '#373b3e',
                            opacity: 1,
                          },
                          '&.Mui-selected:hover': {
                            backgroundColor: SelectedOptionColor,
                          },
                          borderRadius: 1,
                          mb: 0.5,
                          opacity: 0.7,
                        }}
                      >
                        <ListItemIcon sx={{ mr: 1 }}>
                          {React.cloneElement(childItem.icon, {
                            style: {
                              color: isActive ? '#046DBD' : 'inherit',
                            },
                          })}
                        </ListItemIcon>
                        <Typography
                          variant="body1"
                          sx={{
                            display: 'inline',
                            color: isActive ? '#046DBD' : 'inherit',
                          }}
                        >
                          {childItem.title}
                        </Typography>
                      </ListItemButton>
                    );
                  })}
                </React.Fragment>
              }
              placement="right"
            >
              {iconInSideBar}
            </HtmlTooltip>
          </>
        ) : (
          <>{iconInSideBar}</>
        )}

        <Box
          sx={{
            justifyContent: 'flex-end',
          }}
        >
          {(children && isOpen) || (title === 'Almacén' && isOpen) ? (
            <ListItemButton
              sx={{
                justifyContent: 'center',
                '&:hover': { backgroundColor: 'transparent' },
                p: 0,
                width: 40,
                height: 22,
              }}
              onClick={(e) => {
                setChildOpen(!childOpen);
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              {childOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          ) : null}
        </Box>
      </ListItemButton>
      <Collapse in={childOpen} unmountOnExit>
        {title === 'Almacén' &&
          warehouses &&
          warehouses.map((w) => (
            <ListItemButton
              key={w.id}
              onClick={() => {
                useSubWarehousePaginationStore.getState().clearData();
                navigate(`/almacenes/${w.id}`);
              }}
            >
              <ListItemIcon>
                <Info />
              </ListItemIcon>
              <Typography>{w.nombre}</Typography>
            </ListItemButton>
          ))}
        {children &&
          children.map((childItem, i) => {
            const pathSplit = location.pathname.split('/');
            const childSplit = childItem.path.split('/');
            const isActive = pathSplit.includes(childSplit[2]);
            const uniqueKey = `${childItem.path}-${i}`;
            return (
              <ListItemButton
                key={uniqueKey}
                onClick={() => {
                  setIsOpen(false);
                  navigate(childItem.path);
                }}
                selected={isActive}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#046DBD',
                    opacity: 1,
                  },
                  '&:hover': {
                    backgroundColor: '#373b3e',
                    opacity: 1,
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: SelectedOptionColor,
                  },
                  borderRadius: 1,
                  mb: 0.5,
                  opacity: 0.7,
                }}
              >
                <ListItemIcon sx={{ mr: 1 }}>{childItem.icon}</ListItemIcon>
                {isOpen ? (
                  <Typography
                    variant="body1"
                    sx={{
                      display: 'inline',
                    }}
                  >
                    {childItem.title}
                  </Typography>
                ) : null}
              </ListItemButton>
            );
          })}
      </Collapse>
    </>
  );
};

export const SideNav = () => {
  const { warehouses } = useGetWarehouses();
  const theme = useTheme();
  const isOpen = useAppNavStore(useShallow((state) => state.open));
  const setIsOpen = useAppNavStore(useShallow((state) => state.setOpen));
  const xlUp = useMediaQuery(theme.breakpoints.up('lg'));
  const navigate = useNavigate();
  const profile = useAuthStore(useShallow((state) => state.profile));

  const filteredItems: IModuleItemsList[] = ModuleList.reduce(
    (accumulator: IModuleItemsList[], list: IModuleItemsList) => {
      const filteredModuleItems = list.moduleItems.filter((item) => {
        const isMainDashboard =
          item.mainDashboard &&
          profile?.roles.some((role) => {
            if (item.mainDashboard) {
              return item.mainDashboard.includes(role);
            }
            return false;
          });
        /*const hideCatalogsForAbastecimiento =
          item.title === "Catálogos" && profile?.roles.includes("DIRECTORCOMPRAS");
  */
        return (
          !isMainDashboard &&
          (!item.protectedRoles || item.protectedRoles.some((role) => profile?.roles.includes(role)))
        );
      });

      if (filteredModuleItems.length > 0) {
        accumulator.push({ ...list, moduleItems: filteredModuleItems });
      }

      return accumulator;
    },
    []
  );
  /*const filteredItems = ModuleItems.filter((item) => {
    const isMainDashboard =
      item.mainDashboard &&
      profile?.roles.some((role) => {
        if (item.mainDashboard) {
          return item.mainDashboard.includes(role);
        }
        return false;
      });
    const hideCatalogsForAbastecimiento = item.title === 'Catálogos' && profile?.roles.includes('DIRECTORCOMPRAS');

    return (
      !isMainDashboard &&
      !hideCatalogsForAbastecimiento &&
      (!item.protectedRoles || item.protectedRoles.some((role) => profile?.roles.includes(role)))
    );
  });*/

  return (
    <>
      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
        />
      )}
      <Drawer
        variant={xlUp ? 'permanent' : isOpen ? 'permanent' : 'temporary'}
        anchor="left"
        onClose={() => {
          setIsOpen(false);
        }}
        PaperProps={{
          sx: {
            backgroundColor: '#24282C',
            color: 'common.white',
            width: isOpen ? 230 : 70,
            transition: 'width 0.2s ease-in-out',
            borderRight: isOpen ? 'none' : '1px solid transparent',
            overflowX: 'hidden',
          },
        }}
      >
        <DrawerHeader
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            sx={{
              p: 2,
              width: '140px',
              maxHeight: 100,
              objectFit: 'contain',
              filter: 'invert(1)',
              transition: 'background-color 0.3s ease-in-out, border-radius 0.3s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'background-color 0.3s ease-in-out, border-radius 0.3s ease-in-out',
              },
            }}
            src={Plug}
            onClick={() => navigate('/')}
          />
        </DrawerHeader>
        <Divider sx={{ borderColor: 'gray', my: 1 }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3,
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0,
            }}
          >
            <List component="div" disablePadding>
              {filteredItems.map((list: IModuleItemsList) => (
                <React.Fragment key={list.categoryTitle}>
                  {isOpen && <Typography fontSize={12}>{list.categoryTitle}</Typography>}
                  {list.moduleItems.map((item, i) => (
                    <React.Fragment key={`${item.path}-${i}`}>
                      <SideNavItems
                        icon={item.icon}
                        title={item.title}
                        path={item.path}
                        children={item.children}
                        warehouses={warehouses as []}
                        roles={profile?.roles as string[]}
                      />
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </List>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};
