import React, { createContext, useState } from "react";

export const AppContext = createContext()

export const AppProvider = ({children})=>{
    const [appStorage, setAppStorage] = useState({name: 'sameer', password: 'something', domain : ''})
    // console.log("app storage", appStorage);
    return( <AppContext.Provider value={{appStorage, setAppStorage}}>
        {children}
    </AppContext.Provider>)
}

