import { Outlet } from "react-router-dom";
import { ArticleTabNav } from "../../components/Purchase/Articles/ArticleTabNav";

const ArticleView = () => {
  return (
    <>
      <ArticleTabNav />
      {<Outlet />}
    </>
  );
};

export default ArticleView;
