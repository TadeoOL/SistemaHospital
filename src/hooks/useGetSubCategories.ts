import { useEffect, useState } from "react";
import { ISubCategory } from "../types/types";
import { getAllSubCategories } from "../api/api.routes";

export const useGetSubCategories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getAllSubCategories();
        setSubCategories(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return { isLoading, subCategories };
};
