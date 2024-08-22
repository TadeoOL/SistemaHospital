import { Box, TableCell, TableHead, TableRow } from '@mui/material';
import { useState } from 'react';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

export interface SortColumnConfig {
  label: string;
  sortKey?: string;
  isAction?: boolean;
}

interface BetterSortComponentProps {
  columns: { [key: string]: SortColumnConfig };
  setSortFunction: (sortKey: string) => void;
}

export const BetterSortComponent = (props: BetterSortComponentProps) => {
  const { columns, setSortFunction } = props;
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: '',
    direction: 'desc',
  });

  //   useEffect(() => {
  //     const firstColumnKey = Object.keys(columns)[0];
  //     const firstColumn = columns[firstColumnKey];
  //     if (firstColumn.sortKey) {
  //       setSortConfig({ key: firstColumnKey, direction: 'asc' });
  //       setSortFunction(`${firstColumn.sortKey}Asc`);
  //     }
  //   }, [columns, setSortFunction]);

  const handleSortClick = (columnKey: string, sortKey?: string) => {
    if (!sortKey) return;

    const newDirection = sortConfig.key === columnKey && sortConfig.direction === 'asc' ? 'desc' : 'asc';

    setSortConfig({ key: columnKey, direction: newDirection });
    setSortFunction(`${sortKey}${newDirection === 'asc' ? 'Asc' : 'Desc'}`);
  };

  return (
    <TableHead>
      <TableRow>
        {Object.keys(columns).map((columnKey) => {
          const column = columns[columnKey];
          return (
            <TableCell
              key={columnKey}
              sx={{
                cursor: column.sortKey ? 'pointer' : 'default',
              }}
              onClick={() => handleSortClick(columnKey, column.sortKey)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                {column.sortKey && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
                    {sortConfig.key === columnKey && sortConfig.direction === 'asc' ? (
                      <ArrowUpward sx={{ color: 'grey', width: 15 }} />
                    ) : sortConfig.key === columnKey && sortConfig.direction === 'desc' ? (
                      <ArrowDownward sx={{ color: 'grey', width: 15 }} />
                    ) : null}
                  </Box>
                )}
                {column.label}
              </Box>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};
