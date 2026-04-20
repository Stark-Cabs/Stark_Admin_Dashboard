import { createContext, useReducer } from "react";
import PackagesReducer from "./PackagesReducer";


const INITIAL_STATE = {
    packages: [],
    isFetching: false,
    error: false
}

export const PackagesContext = createContext(INITIAL_STATE)

export const PackagesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(PackagesReducer, INITIAL_STATE)

    return (
        <PackagesContext.Provider value={{
            packages: state.packages,
            isFetching: state.isFetching,
            error: state.error,
            dispatch
        }}
        >
            {children}
        </PackagesContext.Provider>
    )
}