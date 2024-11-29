// import { useEffect, useState } from 'react';

// export const useFetchNormalRoomCategory = (id?: string) => {
//   const [isLoadingArticle, setIsLoadingArticle] = useState(true);
//   const [article, setArticle] = useState<IArticle | null>(null);

//   const fetchData = async () => {
//     setIsLoadingArticle(true);

//     if (!id) {
//       setArticle(null);
//       setIsLoadingArticle(false);
//       return;
//     }

//     try {
//       const data = await getArticleById(id);
//       setArticle(data);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsLoadingArticle(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [id]);

//   return { isLoadingArticle, article };
// };
