import { Outlet } from "react-router-dom";
import { ArticleTabNav } from "../../components/Purchase/Articles/ArticleTabNav";

export const ArticleView = () => {
	return (
		<>
			<ArticleTabNav />
			{<Outlet />}
		</>
	);
};
