import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { NavItemType } from '@/types/menu';
import { useAuthStore } from '@/store/auth';
import sideBarRoutes from '@/routes/sidebar.routes';

const matchRoles = (profile: any, roles: string[] | undefined) => {
  if (!roles || !profile?.roles) return false;

  return roles.some((role) => profile.roles.includes(role));
};

const canShow = (profile: any, items: NavItemType[] | undefined, path: any[] = []) => {
  if (!items) return { children: [], paths: {} };

  const itemsToShow: NavItemType[] = [];
  let finalPaths: any = {};

  for (const item of items) {
    if (item.protectedRoles && !matchRoles(profile, item.protectedRoles)) {
      continue;
    }
    itemsToShow.push(item);

    if (item.url) {
      const totalPath = [
        ...path,
        {
          title: item.title,
          icon: item.icon,
        },
      ];

      const url = item.url;
      finalPaths[url] = totalPath;
    }

    if (['collapse', 'group'].includes(item.type as string)) {
      const { children, paths } = canShow(profile, item.children, [
        ...path,
        {
          title: item.title,
          icon: item.icon,
        },
      ]);

      if (children.length > 0) {
        itemsToShow.push({ ...item, children });
      }

      finalPaths = { ...finalPaths, ...paths };
    }
  }

  return { children: itemsToShow, paths: finalPaths };
};

const CustomBreadcrumb = () => {
  const location = useLocation();

  const { profile } = useAuthStore((state) => ({
    profile: state.profile,
  }));

  const breadcrumbs = React.useMemo(() => {
    const { paths } = canShow(profile, sideBarRoutes[0].children);
    return paths;
  }, [profile]);

  const [firstBreadcrumb, ...restBreadcrumb] = breadcrumbs[location.pathname] || [];
  const { title: firstTitle, icon } = firstBreadcrumb || {};

  const restBreadcrumbs = restBreadcrumb.map((breadcrumb: any, index: number) => {
    const { title, icon: Icon } = breadcrumb;
    return (
      <Typography
        key={index}
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'black',
          fontWeight: 600,
          fontSize: '1rem',
        }}
        color="text.primary"
      >
        <Icon sx={{ mr: 0.5, fontSize: '22px' }} fontSize="inherit" />
        {title}
      </Typography>
    );
  });

  const Icon = icon || HomeIcon;

  return (
    <Breadcrumbs>
      <Box sx={{ display: 'flex', flex: 1, alignContent: 'center' }}>
        <Icon sx={{ mr: 0.5, fontSize: '22px', color: 'black' }} />
        <Typography
          sx={{
            color: 'black',
            fontWeight: 550,
            fontSize: '1rem',
          }}
        >
          {firstTitle}
        </Typography>
      </Box>
      {restBreadcrumbs}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumb;
