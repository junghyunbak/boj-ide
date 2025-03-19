import { createContext, useContext } from 'react';

export type MovableTabValue = {
  ghost?: boolean;
  isSelect?: boolean;
  isHover?: boolean;
  tabIndex: number;
};

export const MovableTabContext = createContext<MovableTabValue>({
  isSelect: false,
  tabIndex: -1,
  ghost: false,
  isHover: false,
});

export function useMovableTabContext() {
  const contextValue = useContext(MovableTabContext);

  return contextValue;
}
