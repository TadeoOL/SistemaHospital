import { FormControl, MenuItem, Pagination, Select, Stack, TextField, Typography } from '@mui/material';
import { TableBasic } from './TableBasic';
import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useState } from 'react';

interface PaginatedResponse {
  count: number;
  data: any[];
  habilitado: boolean;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  resultByPage: number;
}

interface TablePaginatedColumn {
  header: string | React.ReactNode;
  value: string | Function | React.ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string;
  sort?: boolean;
}

interface TablePaginatedProps {
  columns: TablePaginatedColumn[];
  fetchData: (params: any) => Promise<PaginatedResponse>;
  params: any;
  isLoading?: any;
  children?: React.ReactNode;
}

export const TablePaginated = memo(
  forwardRef((props: TablePaginatedProps, ref) => {
    const { columns, fetchData, params } = props;

    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState('');

    const getData = async () => {
      setIsLoading(true);
      if (!!props.isLoading) return;
      const page = pageIndex + 1;
      try {
        const finalParams = {
          pageIndex: page === 0 ? '' : page,
          pageSize: pageSize === 0 ? '' : pageSize,
          sort,
          ...params,
        };
        console.log('finalParams:', finalParams);

        const response = await fetchData(finalParams);
        console.log('response:', response);

        setData(response.data);
        setCount(response.count);
        const validPageSize = [5, 10, 25, 50].includes(response.resultByPage)
          ? response.resultByPage
          : response.pageSize;
        setPageSize(validPageSize);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      getData();
    }, [props.isLoading, pageIndex, pageSize, sort, JSON.stringify(params)]);

    const newColumns = columns.map((c) => {
      if (!c.sort) return c;

      return {
        ...c,
        sort: (value: any) => {
          setSort(value);
        },
      };
    });

    useImperativeHandle(ref, () => ({
      fetchData: getData,
    }));

    const handlePageChange = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, value: number) => {
      event?.stopPropagation();
      setPageIndex(value);
    }, []);

    const [goto, setGoto] = useState<string | number>(1);

    const handleChangeGoto = (event: React.ChangeEvent<HTMLInputElement>) => {
      const totalPages = Math.ceil(count / pageSize);
      if (+event.target.value > 0 && +event.target.value <= totalPages) {
        setGoto(+event.target.value);
        setPageSize(+event.target.value - 1);
      } else {
        setGoto('');
      }
    };

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
      const handleResize = (): void => {
        setWindowHeight(window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    const dynamicHeight = `${windowHeight - 360}px`;

    return (
      <>
        <TableBasic maxHeight={dynamicHeight} rows={data} columns={newColumns as any} isLoading={isLoading}>
          {props.children}
        </TableBasic>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2, mb: 2, ml: 2, mr: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6">Página:</Typography>
            <TextField
              id="outlined-name"
              placeholder="Page"
              value={goto}
              onChange={handleChangeGoto}
              size="small"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1.25, width: 50 } }}
            />

            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                id="demo-controlled-open-select"
                value={pageSize}
                onChange={(e: any) => {
                  setPageSize(e.target.value);
                  setPageIndex(0);
                  getData();
                }}
                size="small"
                sx={{ '& .MuiSelect-select': { py: 0.75, px: 1.25 } }}
              >
                <MenuItem value={5}>5 por página</MenuItem>
                <MenuItem value={10}>10 por página</MenuItem>
                <MenuItem value={25}>25 por página</MenuItem>
                <MenuItem value={50}>50 por página</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Pagination
            count={Math.ceil(count / pageSize)}
            page={pageIndex + 1}
            onChange={(e, v) => handlePageChange(e as any, v - 1)}
            variant="combined"
            color="primary"
          />
        </Stack>
      </>
    );
  })
);
