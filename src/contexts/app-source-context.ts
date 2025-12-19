import { createContext } from 'react';

export interface AppSourceContextType {
  appSource: string;
  setAppSource: (value: string) => void;
};

export const AppSourceContext = createContext<AppSourceContextType | undefined>(undefined);