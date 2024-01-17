import {  Navigate, Outlet } from "react-router-dom"
import { useIsAuthStore } from "../store/authentication"

interface IProtectedRoute {
    children?: React.ReactNode;
    redirecTo?: string;
  }

export const ProtectedRoute: React.FC<IProtectedRoute> = ({children, redirecTo="/login"}) => {
    const isAuth = useIsAuthStore((state)=>state.isAuth)


    if(isAuth){
        return children ? children : <Outlet/>
    } else {
        return <Navigate to={redirecTo}/>
    }
    

}   