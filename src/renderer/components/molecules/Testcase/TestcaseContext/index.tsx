import { createContext, useContext } from 'react';

type ContextValue = {
  judgeResult?: JudgeResult;
};

const TestcaseContext = createContext<ContextValue>({});

export function TestcaseContextProvider({ value, children }: React.PropsWithChildren<{ value: ContextValue }>) {
  return <TestcaseContext.Provider value={value}>{children}</TestcaseContext.Provider>;
}

export function useTestcaseContext() {
  const contextValue = useContext(TestcaseContext);

  if (!contextValue) {
    throw new Error('<Testcase/> 컴포넌트 내부에서만 사용하여야 합니다.');
  }

  return contextValue;
}
