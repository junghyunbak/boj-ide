import { act } from 'react';

import { renderHook } from '@testing-library/react';

import { useLayout } from '../useLayout';
import { useModifyLayout } from '.';

describe('[Custom Hooks] 레이아웃 상태 변경 훅', () => {
  it('웹 뷰 레이아웃 비율 변경 시, 리렌더링이 발생하지 않아야 한다.', () => {
    const all = [];

    const { result } = renderHook(() => {
      const value = { ...useLayout(), ...useModifyLayout() };
      all.push(value);
      return value;
    });

    act(() => {
      result.current.updateWebviewRatio(51);
      result.current.updateWebviewRatio(52);
      result.current.updateWebviewRatio(53);
      result.current.updateWebviewRatio(54);
    });

    expect(all.length).toBe(1);
  });

  it('에디터 레이아웃 비율 변경 시, 리렌더링이 발생하지 않아야 한다.', () => {
    const all = [];

    const { result } = renderHook(() => {
      const value = { ...useLayout(), ...useModifyLayout() };
      all.push(value);
      return value;
    });

    act(() => {
      result.current.updateEditorRatio(51);
      result.current.updateEditorRatio(52);
      result.current.updateEditorRatio(53);
      result.current.updateEditorRatio(54);
    });

    expect(all.length).toBe(1);
  });

  it('그림판 레이아웃 비율 변경 시, 리렌더링이 발생하지 않아야 한다.', () => {
    const all = [];

    const { result } = renderHook(() => {
      const value = { ...useLayout(), ...useModifyLayout() };
      all.push(value);
      return value;
    });

    act(() => {
      result.current.updatePaintRatio(51);
      result.current.updatePaintRatio(52);
      result.current.updatePaintRatio(53);
      result.current.updatePaintRatio(54);
    });

    expect(all.length).toBe(1);
  });

  it('히스토리 모달 레이아웃 비율 변경 시, 리렌더링이 발생하지 않아야 한다.', () => {
    const all = [];

    const { result } = renderHook(() => {
      const value = { ...useLayout(), ...useModifyLayout() };
      all.push(value);
      return value;
    });

    act(() => {
      result.current.updateHistoryModalHeight(51);
      result.current.updateHistoryModalHeight(52);
      result.current.updateHistoryModalHeight(53);
      result.current.updateHistoryModalHeight(54);
    });

    expect(all.length).toBe(1);
  });
});
