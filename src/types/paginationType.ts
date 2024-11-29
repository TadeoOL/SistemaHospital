export interface IPagination<T> {
  count: number;
  pageIndex: number;
  pageSize: number;
  data: T[];
  pageCount: number;
  resultByPage: number;
  habilitado: boolean;
  fechaInicio: string | null;
  fechaFin: string | null;
}

export interface IParamsPagination {
  search?: string;
  pageIndex?: number;
  pageSize?: number;
  habilitado?: boolean;
  fechaInicio?: string;
  fechaFin?: string;
  sort?: string;
}

export const getDefaultPaginationParams = (overrides?: Partial<IParamsPagination>): IParamsPagination => ({
  search: '',
  pageIndex: 1,
  pageSize: 10,
  habilitado: true,
  fechaInicio: '',
  fechaFin: '',
  sort: '',
  ...overrides,
});
