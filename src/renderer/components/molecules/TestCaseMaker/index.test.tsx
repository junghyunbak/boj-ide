import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '@/renderer/utils/jest';
import userEvent from '@testing-library/user-event';

import { useStore } from '@/renderer/store';

import { createMockProblem } from '@/renderer/mock';

import { TestCaseMaker } from '.';

describe('[UI] TestcaseMaker', () => {
  describe('문제가 초기화되지 않은 상태', () => {
    it('추가 버튼을 누를 수 없어야 한다.', async () => {
      render(<TestCaseMaker />);

      const $addButton = screen.getByRole<HTMLButtonElement>('button');

      expect($addButton.disabled).toBe(true);
    });

    it('문제 번호가 입력되면, 추가 버튼이 활성화 되어야 한다.', async () => {
      render(<TestCaseMaker />);

      const $input = screen.getByPlaceholderText<HTMLInputElement>('문제 번호');

      await userEvent.type($input, '1000');

      const $addButton = screen.getByRole<HTMLButtonElement>('button');

      expect($addButton.disabled).toBe(false);
    });
  });

  describe('문제가 초기화 되어있는 상태', () => {
    beforeAll(() => {
      const { setProblem } = useStore.getState();

      setProblem(createMockProblem());
    });

    it('표준 입력/출력이 비어있는 상태에서 추가 버튼을 누를 경우 에러 메세지를 설정해야한다.', async () => {
      render(<TestCaseMaker />);

      const $addButton = screen.getByRole('button');

      fireEvent.click($addButton);

      expect(typeof useStore.getState().alertContent).toBe('string');
    });
  });
});
