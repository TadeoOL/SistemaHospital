import { Card, CardHeader, CardContent, Collapse, IconButton, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface BaseKardexCardProps<T> {
  data: T;
  expanded: { [key: string]: boolean };
  onExpandClick: (id: string) => void;
  id: string;
  renderHeader: (data: T) => React.ReactNode;
  renderContent: (data: T) => React.ReactNode;
  renderActions?: (data: T) => React.ReactNode;
}

export function BaseKardexCard<T>({
  data,
  expanded,
  onExpandClick,
  id,
  renderHeader,
  renderContent,
}: BaseKardexCardProps<T>) {
  return (
    <Card elevation={3}>
      <CardHeader
        sx={{
          p: { xs: 1.5, sm: 3 },
          '& .MuiCardHeader-content': { width: '100%' },
          '& .MuiCardHeader-action': {
            m: 0,
            alignSelf: 'center',
          },
        }}
        title={renderHeader(data)}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => onExpandClick(id)}
              sx={{
                transform: expanded[id] ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
                p: { xs: 0.5, sm: 1 },
                ml: { xs: 0.5, sm: 1 },
              }}
            >
              <ExpandMoreIcon sx={{ fontSize: { xs: '1.25rem', sm: '2rem' } }} />
            </IconButton>
          </Box>
        }
      />
      <Collapse in={expanded[id]}>
        <CardContent sx={{ pt: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>{renderContent(data)}</CardContent>
      </Collapse>
    </Card>
  );
}
