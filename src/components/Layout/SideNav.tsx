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
import { IModuleItems, IModuleItemsList, ISideBarWarehouse } from '../../types/types';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { getSideBardWarehouse } from '../../api/api.routes';
import { useWarehouseTabsNavStore } from '../../store/warehouseStore/warehouseTabsNav';
import { SideNavWarehouses } from './SideNavWarehouses';

const SelectedOptionColor = '#9ca1a5';
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
  const [warehouses, setWarehouses] = useState<ISideBarWarehouse[]>();
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
  icon: React.ReactNode | null;
  title: string;
  path: string;
  children?: IModuleItems[];
  warehouses: ISideBarWarehouse[];
  roles: string[];
  id?: string;
}

export const SideNavItems: React.FC<SideNavItemsProps> = ({ icon, title, path, children, warehouses, roles, id }) => {
  const clearWarehouseData = useWarehouseTabsNavStore(useShallow((state) => state.clearWarehouseData));
  const location = useLocation();
  const isOpen = useAppNavStore(useShallow((state) => state.open));
  const setIsOpen = useAppNavStore(useShallow((state) => state.setOpen));
  const navigate = useNavigate();
  const [childOpen, setChildOpen] = useState(false);
  const isWarehouse = title === 'Almacén';
  const warehousesNames = warehouses ? warehouses.flatMap((w) => w.nombre) : [];
  const pathSplit = location.pathname.split('/');
  const isActive = children ? children.some((child) => child.path === location.pathname) : path === location.pathname;
  const someWarehouseActive = id && pathSplit[2] === id;
  const isDashboard = title === 'Inicio';

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
      clearWarehouseData();
      setIsOpen(false);
      navigate(path);
    } else {
      if (isOpen && warehousesNames.includes(title) && roles.includes('ADMIN')) {
        const findId = warehouses.find((w) => w.nombre === title);
        navigate(`almacenes/${findId?.id}`);
        clearWarehouseData();
        setIsOpen(false);
        return;
      }
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
      {icon ? <ListItemIcon sx={{ mr: 1 }}>{icon}</ListItemIcon> : null}
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

  if (isWarehouse && !warehouses && !roles.includes('ADMIN')) return null;
  if (isWarehouse && warehouses) return <SideNavWarehouses warehouses={warehouses} roles={roles} />;
  return (
    <ListItemButton
      onClick={(e) => {
        handleClick(title, roles);
        e.stopPropagation();
      }}
      sx={{
        opacity: 0.7,
        borderRadius: 1,
        width: '100%',
        display: 'flex',
        flex: 1,
        p: 0,
        pl: isDashboard ? 0 : 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        '&:first-of-type': {
          mt: 0.5,
        },
        '&:hover': {
          backgroundColor: isOpen ? null : '#373b3e',
          width: isOpen ? '100%' : '40px',
          opacity: 1,
        },
      }}
    >
      <Stack sx={{ display: 'flex', flex: 1 }}>
        <ListItemButton
          selected={isActive || (someWarehouseActive as boolean)}
          sx={{
            display: 'flex',
            flex: 1,
            '&.Mui-selected': {
              backgroundColor: '#046DBD',
              width: isOpen ? '100%' : '40px',
              opacity: 1,
            },
            padding: 1,
            '&.Mui-selected:hover': { backgroundColor: SelectedOptionColor },
          }}
        >
          {children && children.length !== 0 ? (
            <>
              <HtmlTooltip
                sx={{ visibility: childOpen ? 'hidden' : 'visible' }}
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
                            e.stopPropagation();
                            if (isWarehouse) {
                              clearWarehouseData();
                              navigate(childItem.path);
                              return;
                            }
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
                          {childItem.icon && (
                            <ListItemIcon sx={{ mr: 1 }}>
                              {React.cloneElement(childItem.icon, {
                                style: {
                                  color: isActive ? '#046DBD' : 'inherit',
                                },
                              })}
                            </ListItemIcon>
                          )}
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
          {children &&
            children.map((childItem, i) => {
              const pathSplit = location.pathname.split('/');
              const childSplit = childItem.path.split('/');
              const isActive = pathSplit.includes(childSplit[2] || childSplit[1]);
              const uniqueKey = `${childItem.path}-${i}`;

              return (
                <List component="div" disablePadding key={uniqueKey} sx={{ display: 'flex', flex: 1, pl: 2 }}>
                  <ListItemButton
                    onClick={(e) => {
                      e.stopPropagation();
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
                      my: 0.5,
                      opacity: 0.7,
                    }}
                  >
                    {childItem.icon && <ListItemIcon sx={{ mr: 1 }}>{childItem.icon}</ListItemIcon>}
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
                </List>
              );
            })}
        </Collapse>
      </Stack>
    </ListItemButton>
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
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();

  useEffect(() => {
    if (!isOpen) return setOpen({});
  }, [isOpen]);

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
  const handleOpen = (key: string) => {
    if (!isOpen) {
      setIsOpen(true);
      setOpen({ [key]: true });
      return;
    }
    setOpen({ [key]: !open[key] });
  };

  const handleClick = (isWarehouseModule: boolean, module: string) => {
    if (isWarehouseModule && profile?.roles.includes('ADMIN')) {
      handleOpen(module);
      return navigate('almacenes');
    }
    return handleOpen(module);
  };

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
              {filteredItems.map((list: IModuleItemsList) => {
                const isWarehouseModule = list.categoryTitle === 'Almacen';
                const isActive = location.pathname.split('/')[1] === list.path;

                if (
                  isWarehouseModule &&
                  warehouses?.every((w) => w.subAlmacenes.length === 0) &&
                  !profile?.roles.includes('ADMIN')
                )
                  return null;

                if (list.categoryTitle === 'Dashboard') {
                  return (
                    <Box key={list.categoryTitle}>
                      {isOpen && (
                        <Typography
                          sx={{
                            '&.Mui-selected': {
                              backgroundColor: '#046DBD',
                              opacity: 1,
                            },
                            borderRadius: 1,
                            mb: 0.5,
                            opacity: 0.7,
                            fontSize: 12,
                          }}
                        >
                          {list.categoryTitle}
                        </Typography>
                      )}
                      {list.moduleItems.map((item, i) => (
                        <SideNavItems
                          icon={item.icon}
                          title={item.title}
                          path={item.path}
                          children={item.children}
                          warehouses={warehouses as []}
                          roles={profile?.roles as string[]}
                          key={`${item.path}-${i}`}
                        />
                      ))}
                    </Box>
                  );
                }

                return (
                  <ListItemButton
                    key={list.path}
                    sx={{
                      mt: 1,
                      mb: 1,
                      p: 0,
                      width: '100%',
                      display: 'flex',
                      flex: 1,
                      alignItems: 'center',
                      borderRadius: 1,
                      opacity: 0.7,
                      '&.Mui-selected': {
                        backgroundColor: '#046DBD',
                        opacity: 1,
                      },
                      '&:hover': {
                        backgroundColor: !isOpen || (!open[list.categoryTitle] && isOpen) ? '#373b3e' : null,
                        opacity: !isOpen || (!open[list.categoryTitle] && isOpen) ? 1 : null,
                      },
                    }}
                    selected={isActive && !isOpen}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(isWarehouseModule, list.categoryTitle);
                    }}
                  >
                    <Stack sx={{ display: 'flex', flex: 1 }}>
                      <ListItemButton
                        selected={isActive && isOpen}
                        disabled={!isOpen}
                        sx={{
                          display: 'flex',
                          flex: 1,
                          padding: 1,
                          margin: 0,
                          justifyContent: 'space-between',
                          '&.Mui-selected': {
                            backgroundColor: '#046DBD',
                            opacity: 1,
                          },
                          '&.Mui-disabled': {
                            opacity: 1,
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', flex: 1, alignItems: 'flex-start', columnGap: 1 }}>
                          <ListItemIcon sx={{ color: '#fff' }}>{list.icon}</ListItemIcon>
                          {isOpen && (
                            <Typography
                              variant="body1"
                              sx={{
                                display: 'inline',
                              }}
                            >
                              {list.categoryTitle}
                            </Typography>
                          )}
                        </Box>
                        <Box>
                          <ListItemButton
                            sx={{
                              justifyContent: 'center',
                              '&:hover': { backgroundColor: 'transparent' },
                              p: 0,
                              width: 40,
                              height: 22,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpen(list.categoryTitle);
                            }}
                          >
                            {isOpen && (open[list.categoryTitle] ? <ExpandLess /> : <ExpandMore />)}
                          </ListItemButton>
                        </Box>
                      </ListItemButton>
                      <Collapse in={open[list.categoryTitle]} sx={{ padding: 0 }}>
                        {list.moduleItems.map((item, i) => (
                          <SideNavItems
                            icon={item.icon}
                            title={item.title}
                            path={item.path}
                            children={item.children}
                            warehouses={warehouses as []}
                            roles={profile?.roles as string[]}
                            key={`${item.path}-${i}`}
                          />
                        ))}
                      </Collapse>
                    </Stack>
                  </ListItemButton>
                );
              })}
            </List>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};
