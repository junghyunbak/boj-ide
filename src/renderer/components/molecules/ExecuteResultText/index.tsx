import { Text } from '@/renderer/components/atoms/paragraphs/Text';

interface ExecuteResultTextProps {
  totalCount: number;
  correctCount: number;
}

export function ExecuteResultText({ totalCount, correctCount }: ExecuteResultTextProps) {
  if (totalCount === 0) {
    return null;
  }

  const isCorrect = totalCount === correctCount;

  return (
    <Text
      fontWeight="bold"
      type={isCorrect ? '맞았습니다!!' : '틀렸습니다'}
    >{`${totalCount}개 중 ${correctCount}개 성공`}</Text>
  );
}
