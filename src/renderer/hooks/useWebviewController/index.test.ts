import { act } from 'react';
import { renderHook } from '@testing-library/react';

import { createMockProblem } from '@/renderer/mock';

import { useStore } from '@/renderer/store';

import { useWebviewController } from '.';

const mockProblem = createMockProblem();

beforeEach(() => {
  const { setWebview, setProblem } = useStore.getState();

  setProblem(mockProblem);
  setWebview({
    loadURL(url, options) {
      return new Promise<void>((resolve) => {
        resolve();
      });
    },
  } as Electron.WebviewTag);
});

describe('[커스텀 훅] 웹 뷰 컨트롤러', () => {
  it('새로운 문제로 이동시킬 경우, true를 반환한다.', () => {
    const { result } = renderHook(() => useWebviewController());

    const newMockProblem = createMockProblem();

    let isSuccess = false;

    act(() => {
      isSuccess = result.current.gotoProblem(newMockProblem);
    });

    expect(isSuccess).toBe(true);
  });

  it('동일한 문제 번호로 이동시킬 경우, false를 반환한다.', () => {
    const { result } = renderHook(() => useWebviewController());

    const sameNumberMockProblem = createMockProblem({ number: mockProblem.number });

    let isSuccess = true;

    act(() => {
      isSuccess = result.current.gotoProblem(sameNumberMockProblem);
    });

    expect(isSuccess).toBe(false);
  });
});
