import { createContext, Dispatch, SetStateAction } from 'react';
import { databaseUser } from '../services/db-service';

interface AuthUser {
  uid: string;
  // Add more properties here if needed
}

interface AppState {
  authUser: AuthUser | null;
  dbUser: databaseUser | null;
  loading: boolean;
  setAppState: Dispatch<SetStateAction<AppState>>;
}

export const AppContext = createContext<AppState>({
  authUser: null,
  dbUser: null,
  loading: true,
  setAppState: () => {},
});
