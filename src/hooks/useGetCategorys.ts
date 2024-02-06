import { useEffect, useState } from "react";
import { ICategory } from "../types/types";
import { getAllCategories } from "../api/api.routes";

export const useGetCategories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getAllCategories();
        setCategories(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return { isLoading, categories };
};
