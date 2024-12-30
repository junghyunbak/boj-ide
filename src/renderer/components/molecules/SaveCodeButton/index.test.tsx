import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { useStore } from '@/renderer/store';
import { SaveCodeButton } from '.';

describe('저장 버튼이 활성화되어있는 상태', () => {
  beforeAll(() => {
    const { setProblem, setIsCodeStale } = useStore.getState();

    setProblem({
      name: 'A + B',
      number: '1000',
      testCase: {
        inputs: [],
        outputs: [],
      },
    });

    setIsCodeStale(true);

    let fn: () => void;

    window.electron = {
      ipcRenderer: {
        on: (channel: string, func: (message?: any) => void) => {
          fn = () => {
            func({ data: { isSaved: true } });
          };
          return () => {};
        },
        sendMessage: (channel: string, message?: any) => {
          if (fn) {
            fn();
          }
        },
        removeAllListeners(channel) {},
      },
    };
  });

  it('저장 버튼을 누르면 저장 버튼이 비활성화 되어야 한다', () => {
    render(<SaveCodeButton />);

    const $button = screen.getByRole<HTMLButtonElement>('button');

    fireEvent.click($button);

    expect($button.disabled).toBe(true);
  });

  it('저장 버튼을 누르면 완료 메세지가 출력되어야 한다.', () => {
    render(<SaveCodeButton />);

    fireEvent.click(screen.getByRole<HTMLButtonElement>('button'));

    expect(typeof useStore.getState().message).toBe('string');
  });
});
