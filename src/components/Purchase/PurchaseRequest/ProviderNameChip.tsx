import { Chip, Tooltip } from '@mui/material';
import React from 'react';

interface ProviderNameChip {
  provider: { id: string; name: string }[];
}
const isLonger = (name: string) => {
  return name.length > 25;
};

export const ProviderNameChip = (props: ProviderNameChip) => {
  if (!props.provider?.length) return null;

  return (
    <React.Fragment>
      {props.provider.map((p) => {
        return (
          <Tooltip key={p.id} title={isLonger(p.name) ? p.name : null}>
            <Chip key={p.id} label={isLonger(p.name) ? p.name.slice(0, 24).concat('...') : p.name} />
          </Tooltip>
        );
      })}
    </React.Fragment>
  );
};
