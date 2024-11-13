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
