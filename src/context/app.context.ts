import { createContext } from "react";

export const AppContext = createContext({
  authUser: null,  
  dbUser: null,   
  loading: true,   
  setAppState: () => {}, 
});