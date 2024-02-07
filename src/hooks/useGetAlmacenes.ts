import { useEffect, useState } from "react";
import { IAlmacen } from "../types/types";
import { getAllAlmacenes } from "../api/api.routes";

export const useGetAlmacenes = () => {
  const [isLoadingAlmacenes, setIsLoadingAlmacenes] = useState(true);
  const [almacenes, setAlmacenes] = useState<IAlmacen[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingAlmacenes(true);
      try {
        const res = await getAllAlmacenes();
        setAlmacenes(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingAlmacenes(false);
      }
    };
    fetchData();
  }, []);
  return { isLoadingAlmacenes, almacenes };
};
