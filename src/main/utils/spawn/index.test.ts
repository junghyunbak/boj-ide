import { checkCli } from '.';

describe('cli 프로그램 존재여부 확인', () => {
  it('cli 프로그램이 설치되어있지 않을경우 false를 반환한다.', () => {
    expect(checkCli('a')).toEqual(false);
  });

  it('cli 프로그램이 설치되어 있을경우 true를 반환한다.', () => {
    expect(checkCli(process.platform === 'win32' ? 'ver' : 'bash')).toEqual(true);
  });
});
