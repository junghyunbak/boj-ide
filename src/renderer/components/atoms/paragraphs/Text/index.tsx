import { color } from '@/styles';
import { css } from '@emotion/react';
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
  const fontColor = (() => {
    switch (type) {
      case '런타임 에러':
        return color.error;
      case '시간 초과':
      case '출력 초과':
        return color.over;
      case '틀렸습니다':
        return color.wrong;
      case '맞았습니다!!':
        return color.correct;
      case '채점 중':
        return color.judging;
      case '기본':
      default:
        return color.text;
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
