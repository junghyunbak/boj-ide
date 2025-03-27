import { css, useTheme } from '@emotion/react';
import React from 'react';

interface TextProps {
  children: React.ReactNode;
  fontSize?: React.CSSProperties['fontSize'];
  fontWeight?: React.CSSProperties['fontWeight'];
  whiteSpace?: React.CSSProperties['whiteSpace'];
  type?: JudgeResult['result'] | '기본' | '채점 중';
  userSelect?: React.CSSProperties['userSelect'];
}

export function Text({
  children,
  fontSize = '1rem',
  fontWeight = 'normal',
  type = '기본',
  whiteSpace = 'normal',
  userSelect = 'auto',
}: TextProps) {
  const theme = useTheme();

  const fontColor = (() => {
    switch (type) {
      case '런타임 에러':
        return theme.common.colors.judge.error;
      case '시간 초과':
      case '출력 초과':
        return theme.common.colors.judge.over;
      case '틀렸습니다':
        return theme.common.colors.judge.wrong;
      case '맞았습니다!!':
        return theme.common.colors.judge.correct;
      case '채점 중':
        return theme.common.colors.judge.judging;
      case '컴파일 에러':
        return theme.common.colors.judge.compileError;
      case '실행 중단':
        return theme.common.colors.judge.stop;
      case '기본':
      default:
        return theme.colors.fg;
    }
  })();

  return (
    <p
      css={css`
        margin: 0;
        color: ${fontColor};
      `}
      style={{
        fontSize,
        fontWeight,
        color: fontColor,
        whiteSpace,
        userSelect,
      }}
    >
      {children}
    </p>
  );
}
