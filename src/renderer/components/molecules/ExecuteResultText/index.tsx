import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { useJudge } from '@/renderer/hooks';

export function ExecuteResultText() {
  const { totalCount, correctCount, isJudgingEnd, isCorrect } = useJudge();

  if (!isJudgingEnd) {
    return null;
  }

  return (
    <Text
      fontWeight="bold"
      type={isCorrect ? '맞았습니다!!' : '틀렸습니다'}
    >{`${totalCount}개 중 ${correctCount}개 성공`}</Text>
  );
}
