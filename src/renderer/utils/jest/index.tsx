import { render } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { themes } from '@/renderer/styles';

/**
 * emotion theme provider 사용으로 발생한 jest ui 테스트 오류를 해결할 수 있는 커스텀 render 함수
 */
const customRender = (ui: React.ReactElement, options = {}) =>
  render(<ThemeProvider theme={themes.baekjoon}>{ui}</ThemeProvider>, options);

export * from '@testing-library/react';
export { customRender as render };
