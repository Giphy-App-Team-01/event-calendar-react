import { createContext } from 'react';
import { AppContextType } from '../types/interfaces';

export const AppContext = createContext<AppContextType>({
  authUser: null,
  dbUser: null,
  loading: true,
  setAppState: () => {},
});
