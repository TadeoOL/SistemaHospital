import { useEffect, useState } from 'react';
import { ISubCategory } from '../interfaces/subcategories.interface';
import { getSubCategoryById } from '../services/subcategories';

export const useFetchSubCategory = (id?: string) => {
  const [isLoadingSubCategory, setIsLoadingSubCategory] = useState(true);
  const [subCategory, setSubCategory] = useState<ISubCategory | null>(null);

  const fetchData = async () => {
    setIsLoadingSubCategory(true);

    if (!id) {
      setSubCategory(null);
      setIsLoadingSubCategory(false);
      return;
    }

    try {
      const data = await getSubCategoryById(id);
      setSubCategory(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingSubCategory(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return { isLoadingSubCategory, subCategory };
};
