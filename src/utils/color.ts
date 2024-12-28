import { color } from '@/styles';

export const getResultColor = (result: JudgeResult['result']) => {
  switch (result) {
    case '런타임 에러':
      return color.error;
    case '맞았습니다!!':
      return color.correct;
    case '시간 초과':
    case '출력 초과':
      return color.over;
    case '틀렸습니다':
      return color.wrong;
    default:
      return color.text;
  }
};
