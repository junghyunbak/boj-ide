import { Text } from '@/renderer/components/atoms/paragraphs/Text';

import { useJudge } from '@/renderer/hooks';

import { useTestcaseContext } from '../TestcaseContext';

export function TestcaseResult() {
  const { judgeResult } = useTestcaseContext();

  const { isJudging } = useJudge();

  if (isJudging) {
    return <Text type="채점 중">채점 중</Text>;
  }

  if (judgeResult) {
    return (
      <Text type={judgeResult.result} fontWeight={judgeResult.result === '맞았습니다!!' ? 'bold' : 'normal'}>
        {isJudging ? '채점 중' : judgeResult.result}
      </Text>
    );
  }

  return null;
}
