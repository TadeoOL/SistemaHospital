export interface TableBasicColumn<T> {
  header: string | React.ReactNode;
  value: keyof T | ((row: T) => React.ReactNode);
  align?: 'left' | 'right' | 'center';
  width?: string;
  sort?: boolean | ((value: any) => void);
}

export type NestedTable<T> = {
  [K in keyof T]?: T[K] extends (infer U)[] | undefined
    ? {
        columns: Array<TableBasicColumn<U>>;
        title?: string;
      }
    : never;
};

export interface TableBasicProps<T = any> {
  rows: T[];
  columns: TableBasicColumn<T>[];
  isLoading?: boolean;
  maxHeight?: string;
  children?: React.ReactNode;
  nestedTable?: NestedTable<T>;
}

export interface PaginatedResponse {
  count: number;
  data: any[];
  habilitado: boolean;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  resultByPage: number;
}

export interface TablePaginatedColumn<T> extends Omit<TableBasicColumn<T>, 'sort'> {
  sort?: boolean;
}

export interface TablePaginatedProps<T = any> extends Omit<TableBasicProps<T>, 'rows' | 'columns'> {
  columns: TablePaginatedColumn<T>[];
  fetchData: (params: any) => Promise<PaginatedResponse>;
  params: any;
}
