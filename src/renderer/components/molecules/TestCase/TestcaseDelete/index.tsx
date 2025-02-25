import { TextButton } from '@/renderer/components/atoms/buttons/TextButton';
import { useTestcase } from '@/renderer/hooks';
import { useCallback } from 'react';

interface TestcaseDeleteProps {
  idx: number;
}

export function TestcaseDelete({ idx }: TestcaseDeleteProps) {
  const { removeCustomTestcase } = useTestcase();

  const handleRemoveButtonClick = useCallback(() => {
    console.log('hi', idx);
    removeCustomTestcase(idx);
  }, [removeCustomTestcase, idx]);

  return <TextButton onClick={handleRemoveButtonClick}>삭제</TextButton>;
}
