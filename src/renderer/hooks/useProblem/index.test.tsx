import { renderHook } from '@testing-library/react';
import { useStore } from '@/renderer/store';
import { createMockProblem, createMockTestcase } from '@/renderer/mock';
import { useProblem } from '.';

const mockProblem = createMockProblem();
const mockCustomTestcase = createMockTestcase({ type: 'custom' });
const mockCustomTestcase2 = createMockTestcase({ type: 'custom' });
const mockCustomTestcase3 = createMockTestcase({ type: 'custom' });

beforeAll(() => {
  useStore.getState().setProblem(mockProblem);
});

describe('커스텀 테스트케이스 추가/삭제', () => {
  it('addCustomTestcase', () => {
    const {
      result: {
        current: { addCustomTestcase },
      },
    } = renderHook(() => useProblem());

    addCustomTestcase(mockCustomTestcase);

    const { customTestCase } = useStore.getState();

    expect(customTestCase[mockProblem.number] instanceof Array).toBe(true);
  });

  it('removeCustomTestcase', () => {
    const {
      result: {
        current: { removeCustomTestcase },
      },
    } = renderHook(() => useProblem());

    const { setCustomTestcases } = useStore.getState();

    setCustomTestcases(() => {
      return {
        [mockProblem.number]: [mockCustomTestcase, mockCustomTestcase2, mockCustomTestcase3],
      };
    });

    removeCustomTestcase(1);

    expect(
      useStore.getState().customTestCase[mockProblem.number]?.some((v) => v.input === mockCustomTestcase2.input),
    ).toBe(false);
  });
});
