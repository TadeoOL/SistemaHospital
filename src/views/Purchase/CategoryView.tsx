interface ICategoryViewProps {
  children: React.ReactNode;
}
const CategoryView = (props: ICategoryViewProps) => {
  return <>{props.children}</>;
};

export default CategoryView;
