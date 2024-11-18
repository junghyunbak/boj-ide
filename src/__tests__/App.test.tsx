/*
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../renderer/App';

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
*/

import { checkCli } from '../main/sub/judge';

describe('Main Process', () => {
  describe('cli 프로그램 체크 단계', () => {
    it('cli 프로그램이 설치되어있지 않을경우 false를 반환한다.', () => {
      expect(checkCli('a')).toEqual(false);
    });

    it('cli 프로그램이 설치되어 있을경우 true를 반환한다.', () => {
      expect(checkCli(process.platform === 'win32' ? 'ver' : 'bash')).toEqual(true);
    });
  });
});
