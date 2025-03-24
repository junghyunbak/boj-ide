import { useCallback } from 'react';

import { useModifyTestcase } from '@/renderer/hooks';

import { TextButton } from '@/renderer/components/atoms/buttons/TextButton';

interface TestcaseDeleteProps {
  idx: number;
}

export function TestcaseDelete({ idx }: TestcaseDeleteProps) {
  const { removeCustomTestcase } = useModifyTestcase();

  const handleRemoveButtonClick = useCallback(() => {
    removeCustomTestcase(idx);
  }, [removeCustomTestcase, idx]);

  return <TextButton onClick={handleRemoveButtonClick}>삭제</TextButton>;
}
