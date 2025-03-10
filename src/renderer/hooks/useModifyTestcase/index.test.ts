import { act } from 'react';

import { renderHook } from '@testing-library/react';

import { createMockTestcase, createMockProblem } from '@/renderer/mock';

import { useStore } from '@/renderer/store';

import { useModifyTestcase } from '.';
import { useTestcase } from '../useTestcase';
import { useModifyProblem } from '../useModifyProblem';

const mockProblem = createMockProblem();
const mockTestcase1 = createMockTestcase();
const mockTestcase2 = createMockTestcase();
const mockTestcase3 = createMockTestcase();

beforeEach(() => {
  const { setCustomTestcases } = useStore.getState();

  setCustomTestcases(() => ({
    [mockProblem.number]: [mockTestcase1, mockTestcase2, mockTestcase3],
  }));
});

describe('[Custom Hooks] useTestcase', () => {
  describe('문제가 초기화되지 않은 상태', () => {
    it('문제 번호가 추가로 전달 된 경우, 해당 문제 번호로 테스트케이스가 추가되어야 한다.', () => {
      const { result } = renderHook(() => ({ ...useTestcase(), ...useModifyProblem(), ...useModifyTestcase() }));

      act(() => {
        result.current.updateProblem(null);
      });

      const problemNumber = '0';
      const newMockTestcase = createMockTestcase();
      const prevCustomTestcaseLength = result.current.customTestcases[problemNumber]?.length || 0;

      act(() => {
        result.current.addCustomTestcase(newMockTestcase, problemNumber);
      });

      const customTestcases = result.current.customTestcases[problemNumber];

      expect(customTestcases?.length).toBe(prevCustomTestcaseLength + 1);
      expect(customTestcases?.find((testcase) => testcase.input === newMockTestcase.input)).not.toBe(undefined);
    });
  });

  describe('문제가 초기화 되어있는 상태', () => {
    it('테스트케이스를 추가할 경우, 현재 문제 번호로 테스트케이스가 추가되어야 한다.', () => {
      const { result } = renderHook(() => ({ ...useTestcase(), ...useModifyProblem(), ...useModifyTestcase() }));

      act(() => {
        result.current.updateProblem(mockProblem);
      });

      const newMockTestcase = createMockTestcase();
      const prevCustomTestcaseLength = result.current.customTestcases[mockProblem.number]?.length || 0;

      act(() => {
        result.current.addCustomTestcase(newMockTestcase);
      });

      const customTestcases = result.current.customTestcases[mockProblem.number];

      expect(customTestcases?.length).toBe(prevCustomTestcaseLength + 1);
      expect(customTestcases?.find((testcase) => testcase.input === newMockTestcase.input)).not.toBe(undefined);
    });

    it('범위 내 테스트케이스를 삭제할 경우, 해당 테스트케이스가 존재하지 않아야 한다.', () => {
      const { result } = renderHook(() => ({ ...useTestcase(), ...useModifyProblem(), ...useModifyTestcase() }));

      act(() => {
        result.current.updateProblem(mockProblem);
      });

      const removeIdx = 1;
      const removeMockTestcase = (result.current.customTestcases[mockProblem.number] || [])[removeIdx];

      act(() => {
        result.current.removeCustomTestcase(removeIdx);
      });

      const customTestcases = result.current.customTestcases[mockProblem.number];

      expect(customTestcases?.find((testcase) => testcase.input === removeMockTestcase.input)).toBe(undefined);
    });

    it('범위 밖 테스트케이스를 삭제할 경우, 삭제 된 테스트케이스가 없어야 한다.', () => {
      const { result } = renderHook(() => ({ ...useTestcase(), ...useModifyProblem(), ...useModifyTestcase() }));

      act(() => {
        result.current.updateProblem(mockProblem);
      });

      const prevCustomTestcaseLength = result.current.customTestcases[mockProblem.number]?.length || 0;
      const removeIdx = prevCustomTestcaseLength;

      act(() => {
        result.current.removeCustomTestcase(removeIdx);
      });

      const customTestcases = result.current.customTestcases[mockProblem.number];

      expect(customTestcases?.length).toBe(prevCustomTestcaseLength);
    });
  });
});
