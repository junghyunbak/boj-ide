import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function ExecuteResultText() {
  const [judgeResults] = useStore(useShallow((s) => [s.judgeResult])); // [ ]: persist 때문에 참조 변수명만 변경

  const totalCount = judgeResults.length;
  const correctCount = judgeResults
    .filter((v) => v !== undefined)
    .reduce((a, c) => a + (c.result === '맞았습니다!!' ? 1 : 0), 0);

  const isCorrect = totalCount === correctCount;

  if (totalCount === 0) {
    return null;
  }

  return (
    <Text
      fontWeight="bold"
      type={isCorrect ? '맞았습니다!!' : '틀렸습니다'}
    >{`${totalCount}개 중 ${correctCount}개 성공`}</Text>
  );
}
