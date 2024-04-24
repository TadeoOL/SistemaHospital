import {create} from "zustand"

interface State {
    tabValue:number
}

interface Action {
    setTabValue:(tabValue:number)=>void
}

export const usePosTabNavStore = create<State&Action>(set=>({
    tabValue:0,
    setTabValue:(tabValue:number)=>set({tabValue})
}))