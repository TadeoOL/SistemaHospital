import { Box, IconButton, Tooltip } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

export interface Action {
  icon: SvgIconComponent;
  title: string;
  onClick: () => void;
  show?: boolean;
  color?: string;
  disabled?: boolean;
}

interface ActionButtonsProps {
  actions: Action[];
  gap?: number;
  size?: 'small' | 'medium' | 'large';
}

export const ActionButtons = ({ actions, gap = 1, size = 'small' }: ActionButtonsProps) => {
  return (
    <Box sx={{ display: 'flex', gap }}>
      {actions
        .filter((action) => action.show !== false)
        .map((action, index) => (
          <Tooltip key={index} title={action.title}>
            <span>
              <IconButton size={size} onClick={action.onClick} disabled={action.disabled} sx={{ color: action.color }}>
                <action.icon />
              </IconButton>
            </span>
          </Tooltip>
        ))}
    </Box>
  );
};
