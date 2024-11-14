import { IPatientKardex } from "../../../types/nursing/nursingTypes";
import { EmptyKardexState } from "./EmptyKardexState";
import { KardexCard } from "./KardexCard";

interface KardexListProps {
  data: IPatientKardex[] | undefined;
  expanded: string | false;
  onExpandClick: (kardexId: string) => void;
  onCreateClick: () => void;
}

export const KardexList = ({ 
  data, 
  expanded, 
  onExpandClick,
  onCreateClick 
}: KardexListProps) => {
  if (!data?.length) {
    return <EmptyKardexState onCreateClick={onCreateClick} />;
  }

  return (
    <>
      {data.map((kardex) => (
        <KardexCard 
          key={kardex.id} 
          kardex={kardex} 
          expanded={expanded} 
          onExpandClick={onExpandClick} 
        />
      ))}
    </>
  );
}; 