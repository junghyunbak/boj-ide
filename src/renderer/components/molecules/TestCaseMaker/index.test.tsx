import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { useStore } from '@/renderer/store';
import { TestCaseMaker } from '.';

describe('문제가 초기화되지 않은 상태', () => {
  it('추가 버튼을 누를 수 없어야 한다.', async () => {
    render(<TestCaseMaker />);

    const $addButton = screen.getByRole<HTMLButtonElement>('button');

    expect($addButton.disabled).toBe(true);
  });
});

describe('문제가 초기화 되어있는 상태', () => {
  it('표준 입력, 출력이 비어있는 상태에서 추가 버튼을 누를 경우 에러 메세지를 설정해야한다.', async () => {
    const { setProblem } = useStore.getState();

    setProblem({
      name: 'A + B',
      number: '1000',
      testCase: {
        inputs: [],
        outputs: [],
      },
    });

    render(<TestCaseMaker />);

    const $addButton = screen.getByRole('button');

    fireEvent.click($addButton);

    expect(typeof useStore.getState().alertContent).toBe('string');
  });
});
