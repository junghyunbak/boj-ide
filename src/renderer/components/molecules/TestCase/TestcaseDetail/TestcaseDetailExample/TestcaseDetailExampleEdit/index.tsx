import { useCallback } from 'react';

import { useTestcase } from '@/renderer/hooks';

import { TextButton } from '@/renderer/components/atoms/buttons/TextButton';

import { useTestcaseDetailExampleContext } from '../TestcaseDetailExampleContext';

interface TestcaseDetailExampleEditProps {
  idx: number;
}

export function TestcaseDetailExampleEdit({ idx }: TestcaseDetailExampleEditProps) {
  const { type, value, isEditing, setIsEditing } = useTestcaseDetailExampleContext();

  const { updateCustomTestcase } = useTestcase();

  const handleExampleEditButtonClick = () => {
    if (isEditing) {
      setIsEditing(false);
      if (type === '입력') {
        updateCustomTestcase(idx, { input: value });
      } else {
        updateCustomTestcase(idx, { output: value });
      }
    } else {
      setIsEditing(true);
    }
  };

  return <TextButton onClick={handleExampleEditButtonClick}>{isEditing ? '완료' : '수정'}</TextButton>;
}
