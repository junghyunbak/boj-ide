import { createContext, useContext } from 'react';

type ExampleContext = {
  type: '입력' | '출력';
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const TestcaseDetailExampleContext = createContext<ExampleContext>({
  type: '입력',
  value: '',
  setValue: () => {},
  isEditing: false,
  setIsEditing: () => {},
});

export function TestcaseDetailExampleContextProvider({
  value,
  children,
}: React.PropsWithChildren<{ value: ExampleContext }>) {
  return <TestcaseDetailExampleContext.Provider value={value}>{children}</TestcaseDetailExampleContext.Provider>;
}

export function useTestcaseDetailExampleContext() {
  const contextValue = useContext(TestcaseDetailExampleContext);

  if (!contextValue) {
    throw new Error('<TestcaseDetailExample/> 컴포넌트 안에서만 사용해야합니다.');
  }

  return contextValue;
}
