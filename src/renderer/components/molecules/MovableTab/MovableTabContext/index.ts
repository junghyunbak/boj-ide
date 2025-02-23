import { createContext, useContext } from 'react';

export type MovableTabValue = {
  isSelect?: boolean;
  tabIndex: number;
};

export const MovableTabContext = createContext<MovableTabValue>({ isSelect: false, tabIndex: -1 });

export function useMovableTabContext() {
  const contextValue = useContext(MovableTabContext);

  return contextValue;
}
