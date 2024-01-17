import { create } from "zustand"

interface IAuthentication {
    isAuth:boolean
}

interface Action {
    setIsAuth: (isAuth: IAuthentication["isAuth"])=> void
}

export const useIsAuthStore = create<IAuthentication & Action>((set)=>{
    return {
        isAuth: false,
        setIsAuth: (isAuth)=> set(()=>({isAuth:isAuth}))
    }
})