import { ComponentType } from 'react';
import { EmptyKardexState, EmptyKardexStateProps } from './EmptyKardexState';

// Definimos una interfaz base que requiere un id
interface BaseItem {
  id: string;
}

interface BaseKardexCardProps<T extends BaseItem> {
  data: T;
  expanded: { [key: string]: boolean };
  onExpandClick: (id: string) => void;
}

interface KardexListProps<T extends BaseItem> {
  data: T[] | undefined;
  expanded: { [key: string]: boolean };
  onExpandClick: (kardexId: string) => void;
  CardComponent: ComponentType<BaseKardexCardProps<T>>;
  emptyStateProps?: Partial<EmptyKardexStateProps>;
}

export function KardexList<T extends BaseItem>({
  data,
  expanded,
  onExpandClick,
  CardComponent,
  emptyStateProps,
}: KardexListProps<T>) {
  if (!data?.length) {
    return <EmptyKardexState {...emptyStateProps} />;
  }

  return (
    <>
      {data.map((item) => (
        <CardComponent key={item.id} data={item} expanded={expanded} onExpandClick={onExpandClick} />
      ))}
    </>
  );
}
