import React, { createContext, useState } from "react";

export const AppContext = createContext()

export const AppProvider = ({children})=>{
    const [appStorage, setAppStorage] = useState({name: 'sameer', password: 'something'})

    return( <AppContext.Provider value={{appStorage, setAppStorage}}>
        {children}
    </AppContext.Provider>)
}

