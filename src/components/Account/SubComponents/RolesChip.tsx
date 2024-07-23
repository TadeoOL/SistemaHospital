import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';

interface IUser {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  roles: string[];
}
interface IRolesChip {
  user: IUser;
}

export const RolesChip = (props: IRolesChip) => {
  const { user } = props;
  return (
    <Box>
      {user.roles.length <= 2 ? (
        user.roles.map((role, index) => (
          <Chip
            key={index}
            label={
              <Typography key={index} fontSize={13}>
                {index < user.roles.length - 1 ? role + ' ' : role}
              </Typography>
            }
          />
        ))
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user.roles.slice(0, 2).map((role, i) => (
            <Chip
              key={i}
              label={
                <Typography key={i} fontSize={13}>
                  {role}
                </Typography>
              }
            />
          ))}
          <Tooltip
            title={
              <Box>
                {user.roles.slice(2).map((role, index) => (
                  <Typography key={index} fontSize={13}>
                    {role}
                  </Typography>
                ))}
              </Box>
            }
          >
            <Chip
              label={
                <Stack
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <AddIcon sx={{ width: '16px' }} />
                  <Typography fontSize={14}>{user.roles.length - 2}</Typography>
                </Stack>
              }
            />
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};
