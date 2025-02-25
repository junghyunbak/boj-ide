import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { Highlight } from '@/renderer/components/atoms/spans/Highlight';

import { useTestcaseContext } from '../TestcaseContext';

export function TestcaseElapsed() {
  const { judgeResult } = useTestcaseContext();

  if (!judgeResult || judgeResult.result !== '맞았습니다!!') {
    return null;
  }

  return (
    <Text>
      {judgeResult.elapsed} <Highlight>ms</Highlight>
    </Text>
  );
}
